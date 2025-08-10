import { ref, get } from "firebase/database";
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
 * Fetch teachers with optional pagination and filters.
 * Note: Due to Firebase Realtime Database query limitations, multi-field
 * filtering is done client-side after fetching the dataset.
 *
 * @param {Object} params
 * @param {number} [params.limit=4] - Number of items per page
 * @param {number|null} [params.cursor=null] - Start index for pagination (opaque to caller)
 * @param {Object} [params.filters] - Optional filters
 * @param {string|null} [params.filters.language] - e.g. "english"
 * @param {string|null} [params.filters.level] - e.g. "a1"
 * @param {number|string|null} [params.filters.pricePerHour] - e.g. 10, 20, 30, 40
 * @returns {Promise<{items: Array, nextCursor: number|null, hasMore: boolean, total: number}>}
 */
async function fetchTeachers({ limit = 4, cursor = null, filters = {} } = {}) {
  const snapshot = await get(ref(database, "teachers"));
  if (!snapshot.exists()) {
    return { items: [], nextCursor: null, hasMore: false, total: 0 };
  }

  const value = snapshot.val();
  const allTeachers = normalizeTeachers(value);

  // Apply client-side filters
  const language = filters.language || null;
  const level = filters.level || null;
  const pricePerHour = filters.pricePerHour ?? null;

  const matchesLanguage = (teacher) => {
    if (!language) return true;
    const langs = teacher.languages || teacher.language || [];
    if (Array.isArray(langs))
      return langs
        .map(String)
        .map((s) => s.toLowerCase())
        .includes(String(language).toLowerCase());
    if (typeof langs === "string")
      return langs.toLowerCase() === String(language).toLowerCase();
    if (langs && typeof langs === "object")
      return Object.keys(langs)
        .map((s) => s.toLowerCase())
        .includes(String(language).toLowerCase());
    return false;
  };

  const matchesLevel = (teacher) => {
    if (!level) return true;
    const levels = teacher.levels || teacher.level || [];
    if (Array.isArray(levels))
      return levels
        .map(String)
        .map((s) => s.toLowerCase())
        .includes(String(level).toLowerCase());
    if (typeof levels === "string")
      return levels.toLowerCase() === String(level).toLowerCase();
    if (levels && typeof levels === "object")
      return Object.keys(levels)
        .map((s) => s.toLowerCase())
        .includes(String(level).toLowerCase());
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
    const selected = Number(pricePerHour);
    if (Number.isNaN(price) || Number.isNaN(selected)) return true;
    // Exact match per UI options; adjust to `price <= selected` if needed
    return price === selected;
  };

  const filtered = allTeachers.filter(
    (t) => matchesLanguage(t) && matchesLevel(t) && matchesPrice(t)
  );

  // Stable sort to maintain deterministic pagination
  const sorted = filtered.sort((a, b) => {
    const aid = String(a.id);
    const bid = String(b.id);
    if (aid < bid) return -1;
    if (aid > bid) return 1;
    return 0;
  });

  const startIndex = cursor ?? 0;
  const endIndex = Math.min(startIndex + limit, sorted.length);
  const items = sorted.slice(startIndex, endIndex);
  const hasMore = endIndex < sorted.length;
  const nextCursor = hasMore ? endIndex : null;

  return { items, nextCursor, hasMore, total: sorted.length };
}

export { fetchTeachers };
