import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./normalize.css";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router"; // Not  react-router-dom
import Home from "./pages/HomePage.jsx";
import Teachers from "./pages/TeachersPage.jsx";
import Favorites from "./pages/FavoritesPage.jsx";
import PageAuthorization from "./utilities/pageAuthorization.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<Home />} />
          <Route element={<PageAuthorization />}>
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/favorites" element={<Favorites />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
