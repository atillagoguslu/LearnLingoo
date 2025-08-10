import { useCallback, useState } from "react";
import s from "./TeachersPage.module.css";
import TeacherFilter from "../components/teachersPage/filters/TeacherFilter";
import CardList from "../components/teachersPage/CardList";

const DEFAULT_LIMIT = 4;

const TeachersPage = () => {
  const [filters, setFilters] = useState({
    language: "",
    level: "",
    pricePerHour: "",
  });

  const handleFilterChange = useCallback((partial) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  }, []);

  return (
    <div className={s.teachersPageContainer}>
      <TeacherFilter
        language={filters.language}
        level={filters.level}
        pricePerHour={filters.pricePerHour}
        onChange={handleFilterChange}
      />
      <CardList limit={DEFAULT_LIMIT} filters={filters} />
    </div>
  );
};

export default TeachersPage;
