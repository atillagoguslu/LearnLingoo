import s from "./Header.module.css";
import { ukraine, login } from "../constants/ImportedImages.js";
import { NavLink } from "react-router";

const Header = () => {
  const handleLogin = () => {
    console.log("Login");
  };

  const handleRegistration = () => {
    console.log("Registration");
  };

  return (
    <header className={s.HeaderContainer}>
      <div className={s.logo}>
        <img src={ukraine} alt="logo" />
        <NavLink className={s.logoLink} to="/">
          LearnLingo
        </NavLink>
      </div>
      <nav className={s.nav}>
        <div className={s.navList}>
          <NavLink className={s.navLink} to="/">
            Home
          </NavLink>
          <NavLink className={s.navLink} to="/teachers">
            Teachers
          </NavLink>
          <NavLink className={s.navLink} to="/favorites">
            Favorites
          </NavLink>
        </div>
      </nav>
      <div className={s.user}>
        <div className={s.login}>
          <img src={login} alt="login-logo" />
          <button className={s.loginButton} onClick={handleLogin}>
            Login
          </button>
        </div>
        <button className={s.registrationButton} onClick={handleRegistration}>
          Registration
        </button>
      </div>
    </header>
  );
};

export default Header;
