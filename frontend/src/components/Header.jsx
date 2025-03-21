import React from "react";
import { Link } from "react-router-dom";

const Header = ({ setIsAdding }) => {
  return (
    <header className="mb-4 flex items-center justify-between bg-blue-500 p-6 text-white">
      <div>
        <h1 className="text-3xl font-bold">Student Management Software</h1>
        <nav className="mt-4 space-x-4">
          <Link to="/faculties" className="hover:underline">
            Faculties
          </Link>
          <Link to="/programs" className="hover:underline">
            Programs
          </Link>
          <Link to="/student-statuses" className="hover:underline">
            Student Statuses
          </Link>
        </nav>
      </div>
      <div className="mt-8 mb-4">
        <button
          onClick={() => setIsAdding(true)}
          className="rounded bg-white px-4 py-2 text-blue-500 shadow-md transition hover:bg-gray-200"
        >
          Add Student
        </button>
      </div>
    </header>
  );
};

export default Header;
