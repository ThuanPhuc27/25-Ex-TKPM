import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const activeLink = location.pathname; // Lấy pathname hiện tại

  return (
    <header className="mb-4 flex items-center justify-between bg-blue-500 p-6 text-white">
      <div>
        <h1 className="text-3xl font-bold">Student Management Software</h1>
        <nav className="mt-4 space-x-6">
          <Link
            to="/"
            className={`${
              activeLink === "/" ? "border-b-2 border-white" : ""
            } focus:outline-none`}
          >
            Home
          </Link>
          <Link
            to="/faculties"
            className={`${
              activeLink === "/faculties" ? "border-b-2 border-white" : ""
            } focus:outline-none`}
          >
            Faculties
          </Link>
          <Link
            to="/programs"
            className={`${
              activeLink === "/programs" ? "border-b-2 border-white" : ""
            } focus:outline-none`}
          >
            Programs
          </Link>
          <Link
            to="/student-statuses"
            className={`${
              activeLink === "/student-statuses"
                ? "border-b-2 border-white"
                : ""
            } focus:outline-none`}
          >
            Student Statuses
          </Link>
          <Link
            to="/email-format"
            className={`${
              activeLink === "/email-format" ? "border-b-2 border-white" : ""
            } focus:outline-none`}
          >
            Email Format
          </Link>
          <Link
            to="/rules"
            className={`${
              activeLink === "/rules" ? "border-b-2 border-white" : ""
            } focus:outline-none`}
          >
            Status Rules
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
