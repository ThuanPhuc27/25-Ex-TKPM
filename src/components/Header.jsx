import React from "react";

const Header = ({ setIsAdding }) => {
  return (
    <header className="items-center justify-between bg-blue-500 p-6 text-white">
      <h1 className="text-3xl font-bold">Student Management Software</h1>
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
