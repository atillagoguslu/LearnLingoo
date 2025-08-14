import { useState } from "react";
import { useNavigate } from "react-router";
import s from "./heroPart.module.css";
import LoginModal from "../modals/login.jsx";
import { getSavedSession } from "../../db/auth";

const HeroPart = () => {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleGetStarted = () => {
    const session = getSavedSession();
    if (session) {
      navigate("/teachers");
    } else {
      setIsLoginOpen(true);
    }
  };
  return (
    <div className={s.heroPartContainer}>
      <h1 className={s.title}>
        Unlock your potential with the best{" "}
        <span className={s.highlightText}>
          {" "}
          <div className={s.highlight}></div>language
        </span>{" "}
        tutors
      </h1>
      <p className={s.description}>
        Embark on an Exciting Language Journey with Expert Language Tutors: Elevate your language proficiency to new
        heights by connecting with highly qualified and experienced tutors.
      </p>
      <button className={s.button} onClick={handleGetStarted}>
        <p className={s.buttonText}>Get Started</p>
      </button>
      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
    </div>
  );
};

export default HeroPart;
