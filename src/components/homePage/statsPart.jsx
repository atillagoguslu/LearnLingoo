import s from "./statsPart.module.css";

const StatsPart = () => {
  return (
    <div className={s.statsContainer}>
      <div className={s.innerContainer}>
        <div className={s.statsPart}>
          <p className={s.number}>32,000 +</p>
          <p className={s.text}>Experienced tutors</p>
        </div>
        <div className={s.statsPart}>
          <p className={s.number}>300,000 +</p>
          <p className={s.text}>5-star tutor reviews</p>
        </div>
        <div className={s.statsPart}>
          <p className={s.number}>120 +</p>
          <p className={s.text}>Subjects taught</p>
        </div>
        <div className={s.statsPart}>
          <p className={s.number}>200 +</p>
          <p className={s.text}>Tutor nationalities</p>
        </div>
      </div>
    </div>
  );
};

export default StatsPart;
