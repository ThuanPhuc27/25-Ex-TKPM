import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const activeLink = location.pathname;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/faculties", label: "Faculties" },
    { path: "/programs", label: "Programs" },
    { path: "/student-statuses", label: "Student Statuses" },
    { path: "/email-format", label: "Email Format" },
    { path: "/rules", label: "Status Rules" },
    { path: "/courses", label: "Courses" },
    { path: "/classes", label: "Classes" },
  ];

  return (
    <header className="mb-4 flex items-center justify-between bg-blue-500 p-6 text-white">
      <div>
        <h1 className="text-3xl font-bold">Student Management Software</h1>
        <nav className="mt-4 space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${
                activeLink === link.path ? "border-b-2 border-white" : ""
              } focus:outline-none`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
