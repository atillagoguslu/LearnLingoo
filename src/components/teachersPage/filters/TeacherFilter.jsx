import s from "./TeacherFilter.module.css";

const TeacherFilter = () => {
  return (
    <div className={s.teacherFilterContainer}>
      <div className={s.filterPart}>
        <p className={s.filterText}>Language</p>
        <select className={s.filterSelect}>
          <option value="french">French</option>
          <option value="english">English</option>
          <option value="german">German</option>
          <option value="ukrainian">Ukrainian</option>
          <option value="polish">Polish</option>
        </select>
      </div>
      <div className={s.filterPart}>
        <p className={s.filterText}>Level of knowledge</p>
        <select className={s.filterSelect}>
          <option value="a1">A1 Beginner</option>
          <option value="a2">A2 Elementary</option>
          <option value="b1">B1 Intermediate</option>
          <option value="b2">B2 Upper-Intermediate</option>
        </select>
      </div>
      <div className={s.filterPart}>
        <p className={s.filterText}>Price</p>
        <select className={s.filterSelect}>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
        </select>
      </div>
    </div>
  );
};

export default TeacherFilter;
