import {
  ref,
  get,
  query as dbQuery,
  orderByChild,
  orderByKey,
  startAt,
  endAt,
  limitToFirst,
} from "firebase/database";
import { database } from "./dbInit.js";

function normalizeTeachers(snapshotValue) {
  if (Array.isArray(snapshotValue)) {
    return snapshotValue
      .filter(Boolean)
      .map((teacher, index) => ({ id: index, ...teacher }));
  }

  if (snapshotValue && typeof snapshotValue === "object") {
    return Object.entries(snapshotValue).map(([key, teacher]) => ({
      id: key,
      ...teacher,
    }));
  }

  return [];
}

/**
 * Fetch teachers with pagination and filters, prioritizing server-side filtering.
 *
 * Implementation notes (Realtime Database constraints):
 * - Realtime DB supports a single orderBy + (startAt/endAt/equalTo) per query.
 * - We apply ONE primary filter server-side (priority: price > language > level).
 * - We page through the primary-filtered set and apply the remaining filters client-side
 *   until we collect `limit` matches or run out of results.
 * - Cursor is an opaque object containing the last scanned key and primary selector.
 *
 * @param {Object} params
 * @param {number} [params.limit=4] - Number of items per page
 * @param {object|null} [params.cursor=null] - Opaque cursor from previous call
 * @param {Object} [params.filters] - Optional filters
 * @param {string|null} [params.filters.language]
 * @param {string|null} [params.filters.level]
 * @param {number|string|null} [params.filters.pricePerHour]
 * @returns {Promise<{items: Array, nextCursor: object|null, hasMore: boolean, total: number|null}>}
 */
async function fetchTeachers({ limit = 4, cursor = null, filters = {} } = {}) {
  // Normalize filters
  const language = filters.language ? String(filters.language).trim() : "";
  const level = filters.level ? String(filters.level).trim() : "";
  const pricePerHourRaw =
    filters.pricePerHour === 0 || filters.pricePerHour
      ? String(filters.pricePerHour)
      : "";
  const pricePerHour = pricePerHourRaw ? Number(pricePerHourRaw) : null;

  const normalizeLower = (v) =>
    String(v || "")
      .trim()
      .toLowerCase();

  // Client-side matchers for secondary filters
  const matchesLanguage = (teacher) => {
    if (!language) return true;
    const langs = teacher.languages || teacher.language || [];
    if (Array.isArray(langs))
      return langs
        .map(String)
        .map((s) => s.toLowerCase())
        .includes(normalizeLower(language));
    if (typeof langs === "string")
      return normalizeLower(langs) === normalizeLower(language);
    if (langs && typeof langs === "object")
      return Object.keys(langs)
        .map((s) => s.toLowerCase())
        .includes(normalizeLower(language));
    return false;
  };

  const matchesLevel = (teacher) => {
    if (!level) return true;
    const levels = teacher.levels || teacher.level || [];
    if (Array.isArray(levels))
      return levels
        .map(String)
        .map((s) => s.toLowerCase())
        .includes(normalizeLower(level));
    if (typeof levels === "string")
      return normalizeLower(levels) === normalizeLower(level);
    if (levels && typeof levels === "object")
      return Object.keys(levels)
        .map((s) => s.toLowerCase())
        .includes(normalizeLower(level));
    return false;
  };

  const matchesPrice = (teacher) => {
    if (
      pricePerHour === null ||
      pricePerHour === undefined ||
      pricePerHour === ""
    )
      return true;
    const price = Number(
      teacher.price_per_hour ?? teacher.pricePerHour ?? teacher.price
    );
    if (Number.isNaN(price)) return false;
    return price === Number(pricePerHour);
  };

  // Determine primary server-side filter (to avoid index errors, only price is used)
  let primary = { type: "none", path: null, value: null };
  if (
    pricePerHour !== null &&
    pricePerHour !== undefined &&
    pricePerHour !== ""
  ) {
    primary = {
      type: "price",
      path: "price_per_hour",
      value: Number(pricePerHour),
    };
  }

  // Helper to fetch a small page of candidates from DB using the primary filter
  const fetchPrimaryPage = async (lastKey) => {
    const baseRef = ref(database, "teachers");
    let q;
    const pageSize = limit + 1; // fetch one extra to detect if there is a next page
    if (primary.type === "none") {
      if (lastKey) {
        q = dbQuery(
          baseRef,
          orderByKey(),
          startAt(String(lastKey)),
          limitToFirst(pageSize)
        );
      } else {
        q = dbQuery(baseRef, orderByKey(), limitToFirst(pageSize));
      }
    } else {
      if (lastKey) {
        q = dbQuery(
          baseRef,
          orderByChild(primary.path),
          startAt(primary.value, String(lastKey)),
          endAt(primary.value),
          limitToFirst(pageSize)
        );
      } else {
        q = dbQuery(
          baseRef,
          orderByChild(primary.path),
          startAt(primary.value),
          endAt(primary.value),
          limitToFirst(pageSize)
        );
      }
    }

    const snap = await get(q);
    if (!snap.exists())
      return { candidates: [], nextKey: lastKey, rawCount: 0 };

    const raw = [];
    snap.forEach((child) => {
      raw.push({ id: child.key, ...child.val() });
    });

    const hasMoreInSource = raw.length === pageSize;

    // If we used a cursor, drop the first item which duplicates the lastKey
    const candidates = [...raw];
    if (
      lastKey &&
      candidates.length &&
      String(candidates[0].id) === String(lastKey)
    ) {
      candidates.shift();
    }

    const nextKey = candidates.length
      ? candidates[candidates.length - 1].id
      : lastKey;
    return { candidates, nextKey, hasMoreInSource };
  };

  // If the caller provided a legacy numeric cursor, ignore and start fresh.
  const startingKey =
    cursor && typeof cursor === "object" ? cursor.lastKey : null;

  const collected = [];
  let scanningKey = startingKey;
  let exhausted = false;
  let lastHasMoreInSource = false;

  // Keep pulling small primary-filtered pages until we fill `limit` or exhaust data
  while (collected.length < limit && !exhausted) {
    // eslint-disable-next-line no-await-in-loop
    const { candidates, nextKey, hasMoreInSource } = await fetchPrimaryPage(
      scanningKey
    );
    lastHasMoreInSource = hasMoreInSource;
    if (candidates.length === 0 && !hasMoreInSource) {
      exhausted = true;
      break;
    }

    let lastVisitedKey = null;
    let filledLimit = false;
    for (const cand of candidates) {
      lastVisitedKey = cand.id;
      if (matchesLanguage(cand) && matchesLevel(cand) && matchesPrice(cand)) {
        collected.push(cand);
        if (collected.length === limit) {
          filledLimit = true;
          break;
        }
      }
    }
    // If we filled the page limit, continue from the last visited key to avoid skipping unseen candidates
    scanningKey = filledLimit && lastVisitedKey ? lastVisitedKey : nextKey;

    // If source indicates no more, stop scanning
    if (!hasMoreInSource) {
      exhausted = true;
    }
  }

  // Show "Load more" if source indicates more records exist beyond the last page we scanned
  const hasMore = collected.length === limit || lastHasMoreInSource;
  const nextCursor = hasMore ? { lastKey: scanningKey, primary } : null;

  // We cannot reliably compute total without scanning the entire dataset under current constraints
  return { items: collected, nextCursor, hasMore, total: null };
}

export { fetchTeachers };

/**
 * Fetch teachers by a list of IDs.
 * @param {Array<string|number>} ids
 * @returns {Promise<Array<object>>}
 */
export async function fetchTeachersByIds(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  const snapshot = await get(ref(database, "teachers"));
  if (!snapshot.exists()) return [];

  const value = snapshot.val();
  const allTeachers = normalizeTeachers(value);
  const wanted = new Set(ids.map((v) => String(v)));
  return allTeachers.filter((t) => wanted.has(String(t.id)));
}
