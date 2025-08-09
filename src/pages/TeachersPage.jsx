import s from "./TeachersPage.module.css";
import TeacherFilter from "../components/teachersPage/filters/TeacherFilter";
import CardList from "../components/teachersPage/CardList";
 
const TeachersPage = () => {
  return (
    <div className={s.teachersPageContainer}>
      <TeacherFilter />
      <CardList />
    </div>
  );
};

export default TeachersPage;
