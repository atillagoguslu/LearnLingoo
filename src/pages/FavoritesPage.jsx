import { useEffect, useMemo, useState } from "react";
import s from "./FavoritesPage.module.css";
import { getSavedSession, subscribeToFavorites } from "../db/auth";
import { fetchTeachersByIds } from "../db/teachers";
import Card from "../components/teachersPage/Card";

const FavoritesPage = () => {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const session = useMemo(() => getSavedSession(), []);

  useEffect(() => {
    if (!session) {
      setFavoriteIds([]);
      setTeachers([]);
      setIsLoading(false);
      return undefined;
    }
    const unsub = subscribeToFavorites(session.uid, (ids) => {
      setFavoriteIds(ids);
    });
    return () => unsub && unsub();
  }, [session]);

  useEffect(() => {
    async function run() {
      if (!favoriteIds.length) {
        setTeachers([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const items = await fetchTeachersByIds(favoriteIds);
        setTeachers(items);
      } catch (_) {
        setTeachers([]);
      } finally {
        setIsLoading(false);
      }
    }
    run();
  }, [favoriteIds]);

  return (
    <div className={s.container}>
      {!session && <div>Please login to view your favorites.</div>}
      {session && isLoading && <div>Loading...</div>}
      {session && !isLoading && teachers.length === 0 && (
        <div>No favorites yet.</div>
      )}
      {session && !isLoading && teachers.map((t) => <Card key={t.id} {...t} />)}
    </div>
  );
};

export default FavoritesPage;
