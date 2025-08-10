import s from "./TeacherFilter.module.css";
import Select from "./Select";

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
      <Select
        label="Languages"
        name="language"
        value={language}
        onChange={handleSelectChange}
        options={[
          { value: "french", label: "French" },
          { value: "english", label: "English" },
          { value: "german", label: "German" },
          { value: "ukrainian", label: "Ukrainian" },
          { value: "polish", label: "Polish" },
          { value: "spanish", label: "Spanish" },
          { value: "italian", label: "Italian" },
          { value: "portuguese", label: "Portuguese" },
          { value: "russian", label: "Russian" },
          { value: "turkish", label: "Turkish" },
          { value: "arabic", label: "Arabic" },
        ]}
        placeholder="All"
        className={s.filterPart}
      />
      <Select
        label="Level of knowledge"
        name="level"
        value={level}
        onChange={handleSelectChange}
        options={[
          { value: "A1 Beginner", label: "A1 Beginner" },
          { value: "A2 Elementary", label: "A2 Elementary" },
          { value: "B1 Intermediate", label: "B1 Intermediate" },
          { value: "B2 Upper-Intermediate", label: "B2 Upper-Intermediate" },
          { value: "C1 Advanced", label: "C1 Advanced" },
          { value: "C2 Proficient", label: "C2 Proficient" },
        ]}
        placeholder="All"
        className={s.filterPart}
      />
      <Select
        label="Price"
        name="pricePerHour"
        value={pricePerHour}
        onChange={handleSelectChange}
        options={[
          { value: "10", label: "10" },
          { value: "20", label: "20" },
          { value: "30", label: "30" },
          { value: "40", label: "40" },
        ]}
        placeholder="All"
        className={s.filterPart}
      />
    </div>
  );
};

export default TeacherFilter;
