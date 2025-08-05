import s from "./Header.module.css";

const Header = () => {
  return (
    <header className={s.container}>
      <h1>Header</h1>

      <div className={s.nav}>
        <ul>
          <li>Home</li>
          <li>Teachers</li>
          <li>Favorites</li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
