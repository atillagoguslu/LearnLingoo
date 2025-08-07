import s from "./heroPart.module.css";

const HeroPart = () => {
  return (
    <div className={s.heroPartContainer}>
      <h1 className={s.title}>
        Unlock your potential with the best <span className={s.highlightText}> <div className={s.highlight}></div>language</span> tutors
      </h1>
      <p className={s.description}>
        Embark on an Exciting Language Journey with Expert Language Tutors:
        Elevate your language proficiency to new heights by connecting with
        highly qualified and experienced tutors.
      </p>
      <button className={s.button}>
        <p className={s.buttonText}>Get Started</p>
      </button>
    </div>
  );
};

export default HeroPart;
