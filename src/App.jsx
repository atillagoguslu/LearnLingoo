import "./App.css";
import Header from "./components/Header.jsx";
import { Outlet } from "react-router";

function App() {
  return (
    <>
      <div className="container">
        <Header />
        <Outlet />
      </div>
    </>
  );
}

export default App;
