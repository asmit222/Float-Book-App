import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Staff from "./pages/Staff";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/floatBook" element={<App />} />
      <Route path="/staff" element={<Staff />} />
    </Routes>
    <div className="bottom-navbar">
      <Link to="/floatBook" className="nav-section">
        <i className="fa-solid fa-book fa-lg"></i>
      </Link>
      <Link to="/staff" className="nav-section">
        <i className="fa-solid fa-users fa-lg"></i>
      </Link>
    </div>
  </Router>
);
