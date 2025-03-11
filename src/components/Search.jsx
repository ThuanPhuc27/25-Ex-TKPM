import React from "react";

const Search = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search students by id or name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded"
      />
    </div>
  );
};

export default Search;
