import React, { useState, useEffect } from "react";
import config from "../config";

const Faculties = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State cho form thêm mới
  const [newFaculty, setNewFaculty] = useState({ code: "", name: "" });
  // State cho việc chỉnh sửa
  const [editingFaculty, setEditingFaculty] = useState(null);

  // Lấy danh sách faculties từ API
  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.faculty}`
      );
      if (!response.ok) throw new Error("Failed to fetch faculties");
      const data = await response.json();
      setFaculties(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  // Xử lý thay đổi trong form thêm mới
  const handleNewFacultyChange = (e) => {
    const { name, value } = e.target;
    setNewFaculty((prev) => ({ ...prev, [name]: value }));
  };

  // Thêm mới faculty
  const handleAddFaculty = async () => {
    if (!newFaculty.code.trim() || !newFaculty.name.trim()) {
      setError("Code and Name cannot be empty!");
      alert("Code and Name cannot be empty!");
      return;
    }
    if (faculties.some((fac) => fac.code === newFaculty.code)) {
      setError("Code already exists!");
      alert("Code already exists!");
      return;
    }
    if (faculties.some((fac) => fac.name === newFaculty.name)) {
      setError("Name already exists!");
      alert("Name already exists!");
      return;
    }
    try {
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.faculty}/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newFaculty),
        }
      );
      if (!response.ok) throw new Error("Failed to add faculty");
      await fetchFaculties();
      setNewFaculty({ code: "", name: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  // Xóa faculty
  const handleDeleteFaculty = async (id) => {
    try {
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.faculty}/${id}/delete`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete faculty");
      await fetchFaculties();
    } catch (err) {
      setError(err.message);
    }
  };

  // Bắt đầu chỉnh sửa một faculty
  const handleEditFaculty = (faculty) => {
    setEditingFaculty({ ...faculty });
  };

  // Xử lý thay đổi trong form chỉnh sửa
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingFaculty((prev) => ({ ...prev, [name]: value }));
  };

  // Lưu thay đổi sau chỉnh sửa
  const handleUpdateFaculty = async () => {
    if (!editingFaculty.code.trim() || !editingFaculty.name.trim()) {
      setError("Code and Name cannot be empty!");
      alert("Code and Name cannot be empty!");
      return;
    }
    if (
      faculties.some(
        (fac) =>
          fac._id !== editingFaculty._id &&
          (fac.code === editingFaculty.code || fac.name === editingFaculty.name)
      )
    ) {
      setError("Code or Name already exists!");
      alert("Code or Name already exists!");
      return;
    }
    try {
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.faculty}/${editingFaculty._id}/edit`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingFaculty),
        }
      );
      if (!response.ok) throw new Error("Failed to update faculty");
      setEditingFaculty(null);
      await fetchFaculties();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {loading && <div className="text-center">Loading...</div>}
      {error && (
        <div className="mb-4 text-center text-red-500">Error: {error}</div>
      )}
      <div className=" rounded-l">
        <div className="flex w-full flex-col items-center justify-around gap-6 md:flex-row md:gap-8">
          <h1 className="by-2 border-r-2 pr-2 text-xl font-bold">
            New Faculty
          </h1>

          <input
            name="code"
            placeholder="Code"
            value={newFaculty.code}
            onChange={handleNewFacultyChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 md:w-1/4"
          />
          <input
            name="name"
            placeholder="Name"
            value={newFaculty.name}
            onChange={handleNewFacultyChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 md:w-1/2"
          />
          <button
            onClick={handleAddFaculty}
            className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white transition-colors duration-300 hover:bg-green-700 focus:outline-none"
          >
            Add
          </button>
        </div>
      </div>

      <ul className="mt-10 space-y-4">
        {faculties.map((fac) => (
          <li
            key={fac._id}
            className="flex items-center justify-between rounded bg-white p-4 shadow"
          >
            {editingFaculty && editingFaculty._id === fac._id ? (
              <div className="flex w-full flex-col items-center gap-2 md:flex-row">
                <input
                  name="code"
                  value={editingFaculty.code}
                  onChange={handleEditChange}
                  placeholder="Code"
                  className="w-full rounded border px-3 py-2 md:w-1/4"
                />
                <input
                  name="name"
                  value={editingFaculty.name}
                  onChange={handleEditChange}
                  placeholder="Name"
                  className="w-full rounded border px-3 py-2 md:w-1/2"
                />
                <button
                  onClick={handleUpdateFaculty}
                  className="rounded bg-green-500 px-3 py-2 text-white hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingFaculty(null)}
                  className="rounded bg-gray-300 px-3 py-2 text-gray-700 hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex w-full items-center justify-between">
                <span className="text-lg font-medium">
                  {fac.code} - {fac.name}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditFaculty(fac)}
                    className="rounded bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteFaculty(fac._id)}
                    className="rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Faculties;
