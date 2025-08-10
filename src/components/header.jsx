import { useEffect, useState } from "react";
import s from "./Header.module.css";
import { ukraine, login } from "../constants/ImportedImages.js";
import { NavLink } from "react-router";
import LoginModal from "./modals/login.jsx";
import RegistrationModal from "./modals/registration.jsx";
import { getSavedSession, subscribeToAuthState, signOutUser } from "../db/auth";

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [session, setSession] = useState(() => getSavedSession());

  const handleLogin = () => setIsLoginOpen(true);
  const handleRegistration = () => setIsRegistrationOpen(true);
  const closeLogin = () => setIsLoginOpen(false);
  const closeRegistration = () => setIsRegistrationOpen(false);

  useEffect(() => {
    const unsub = subscribeToAuthState((s) => setSession(s));
    return () => unsub && unsub();
  }, []);

  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch (_) {
      // ignore
    }
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
        {!session && (
          <>
            <div className={s.login}>
              <img src={login} alt="login-logo" />
              <button className={s.loginButton} onClick={handleLogin}>
                Login
              </button>
            </div>
            <button
              className={s.registrationButton}
              onClick={handleRegistration}
            >
              Registration
            </button>
          </>
        )}
        {session && (
          <div className={s.login}>
            <span className={s.logoLink} style={{ marginRight: 12 }}>
              {session.name || session.email}
            </span>
            <button className={s.loginButton} onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>

      {isLoginOpen && <LoginModal onClose={closeLogin} />}
      {isRegistrationOpen && <RegistrationModal onClose={closeRegistration} />}
    </header>
  );
};

export default Header;
