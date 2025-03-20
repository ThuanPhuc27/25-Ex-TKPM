import React from "react";

const Search = ({
  searchQuery,
  setSearchQuery,
  facultyFilter,
  setFacultyFilter,
  faculties,
}) => {
  return (
    <div className="mb-4 flex space-x-4">
      <input
        type="text"
        placeholder="Search students by name or ID"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-grow rounded border p-2"
      />
      <select
        value={facultyFilter}
        onChange={(e) => setFacultyFilter(e.target.value)}
        className="rounded border p-2"
      >
        <option value="">All Faculties</option>
        {faculties.map((fac) => (
          <option key={fac} value={fac}>
            {fac}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Search;
