import s from "./TeacherFilter.module.css";

const TeacherFilter = ({
  language = "",
  level = "",
  pricePerHour = "",
  onChange,
}) => {
  const handleSelectChange = (evt) => {
    const { name, value } = evt.target;
    onChange?.({ [name]: value });
  };

  return (
    <div className={s.teacherFilterContainer}>
      <div className={s.filterPart}>
        <p className={s.filterText}>Language</p>
        <select
          className={s.filterSelect}
          name="language"
          value={language}
          onChange={handleSelectChange}
        >
          <option value="">All</option>
          <option value="french">French</option>
          <option value="english">English</option>
          <option value="german">German</option>
          <option value="ukrainian">Ukrainian</option>
          <option value="polish">Polish</option>
          <option value="spanish">Spanish</option>
          <option value="italian">Italian</option>
          <option value="portuguese">Portuguese</option>
          <option value="russian">Russian</option>
          <option value="turkish">Turkish</option>
          <option value="arabic">Arabic</option>
        </select>
      </div>
      <div className={s.filterPart}>
        <p className={s.filterText}>Level of knowledge</p>
        <select
          className={s.filterSelect}
          name="level"
          value={level}
          onChange={handleSelectChange}
        >
          <option value="">All</option>
          <option value="A1 Beginner">A1 Beginner</option>
          <option value="A2 Elementary">A2 Elementary</option>
          <option value="B1 Intermediate">B1 Intermediate</option>
          <option value="B2 Upper-Intermediate">B2 Upper-Intermediate</option>
          <option value="C1 Advanced">C1 Advanced</option>
          <option value="C2 Proficient">C2 Proficient</option>
        </select>
      </div>
      <div className={s.filterPart}>
        <p className={s.filterText}>Price</p>
        <select
          className={s.filterSelect}
          name="pricePerHour"
          value={pricePerHour}
          onChange={handleSelectChange}
        >
          <option value="">All</option>
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
