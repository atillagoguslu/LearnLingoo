import "./App.css";
import Header from "./components/Header.jsx";
import { Outlet, useLocation } from "react-router";

function App() {
  const location = useLocation();
  const pageClass =
    location.pathname === "/"
      ? "inHomePage"
      : location.pathname.startsWith("/teachers")
      ? "inTeachersPage"
      : location.pathname.startsWith("/favorites")
      ? "inFavoritesPage"
      : "";
  return (
    <>
      <div className={`AppContainer ${pageClass}`}>
        <Header />
        <Outlet />
      </div>
    </>
  );
}

export default App;
