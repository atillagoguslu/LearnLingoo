import s from "./CardList.module.css";
import Card from "./Card.jsx";
import { useState, useEffect } from "react";
import { database } from "../../db/dbInit.js";
import { ref, get } from "firebase/database";

const CardList = () => {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTeachers() {
      setIsLoading(true);
      setError(null);

      try {
        const snapshot = await get(ref(database, "teachers"));
        if (snapshot.exists()) {
          const value = snapshot.val();

          let list = [];
          if (Array.isArray(value)) {
            list = value
              .filter(Boolean)
              .map((teacher, index) => ({ id: index, ...teacher }));
          } else if (value && typeof value === "object") {
            list = Object.entries(value).map(([key, teacher]) => ({
              id: key,
              ...teacher,
            }));
          }

          setTeachers(list);
          // Log fetched teachers
          // eslint-disable-next-line no-console
          console.log("Teachers fetched:", list);
        } else {
          // Fallback to sample if DB has no data
          );
        }
      } catch (e) {
        // Permission denied or any fetch error -> fallback to local sample
        const fallback = sampleTeachers.map((t, idx) => ({ id: idx, ...t }));
        setTeachers(fallback);
        // eslint-disable-next-line no-console
        console.warn(
          "Failed to fetch teachers remotely, using fallback sample:",
          e
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchTeachers();
  }, []);

  console.log("All teachers: \n", teachers);

  return (
    <div className={s.cardListContainer}>
      {isLoading && <div>Loading...</div>}
      {error && <div>Failed to load</div>}
      {!isLoading && !error && teachers.map((t) => <Card key={t.id} {...t} />)}
    </div>
  );
};

export default CardList;
