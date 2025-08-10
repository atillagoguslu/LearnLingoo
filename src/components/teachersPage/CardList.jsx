import s from "./CardList.module.css";
import Card from "./Card.jsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchTeachers } from "../../db/teachers.js";
import LoadMore from "./LoadMore.jsx";

const CardList = ({ limit = 4, filters = {} }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const cursorRef = useRef(null);

  const normalizedFilters = useMemo(
    () => ({
      language: filters.language || "",
      level: filters.level || "",
      pricePerHour: filters.pricePerHour || "",
    }),
    [filters.language, filters.level, filters.pricePerHour]
  );

  const loadFirstPage = useCallback(async () => {
    setIsLoading(true);
    try {
      const { items, nextCursor, hasMore, total } = await fetchTeachers({
        limit,
        cursor: null,
        filters: normalizedFilters,
      });
      setItems(items);
      cursorRef.current = nextCursor;
      setHasMore(hasMore);
      setTotal(total);
    } catch (e) {
      console.warn("Failed to fetch teachers:", e);
      setItems([]);
      cursorRef.current = null;
      setHasMore(false);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [limit, normalizedFilters]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const {
        items: nextItems,
        nextCursor,
        hasMore: more,
      } = await fetchTeachers({
        limit,
        cursor: cursorRef.current,
        filters: normalizedFilters,
      });
      setItems((prev) => [...prev, ...nextItems]);
      cursorRef.current = nextCursor;
      setHasMore(more);
    } catch (e) {
      console.warn("Failed to load more teachers:", e);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, limit, normalizedFilters]);

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  console.log(items);

  return (
    <div className={s.cardListContainer}>
      {isLoading && <div>Loading...</div>}
      {!isLoading && items.map((t) => <Card key={t.id} {...t} />)}
      {!isLoading && items.length === 0 && <div>No results</div>}
      {!isLoading && hasMore && (
        <LoadMore
          onClick={loadMore}
          disabled={!hasMore}
          isLoading={isLoadingMore}
        />
      )}
    </div>
  );
};

export default CardList;
