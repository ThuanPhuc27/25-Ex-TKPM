import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [activeLink, setActiveLink] = useState("/");

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  return (
    <header className="mb-4 flex items-center justify-between bg-blue-500 p-6 text-white">
      <div>
        <h1 className="text-3xl font-bold">Student Management Software</h1>
        <nav className="mt-4 space-x-6">
          <Link
            to="/"
            onClick={() => handleLinkClick("/")}
            className={`${
              activeLink === "/" ? "border-b-2 border-white" : ""
            } focus:outline-none`}
          >
            Home
          </Link>
          <Link
            to="/faculties"
            onClick={() => handleLinkClick("/faculties")}
            className={`${
              activeLink === "/faculties" ? "border-b-2 border-white" : ""
            } focus:outline-none`}
          >
            Faculties
          </Link>
          <Link
            to="/programs"
            onClick={() => handleLinkClick("/programs")}
            className={`${
              activeLink === "/programs" ? "border-b-2 border-white" : ""
            } focus:outline-none`}
          >
            Programs
          </Link>
          <Link
            to="/student-statuses"
            onClick={() => handleLinkClick("/student-statuses")}
            className={`${
              activeLink === "/student-statuses"
                ? "border-b-2 border-white"
                : ""
            } focus:outline-none`}
          >
            Student Statuses
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
