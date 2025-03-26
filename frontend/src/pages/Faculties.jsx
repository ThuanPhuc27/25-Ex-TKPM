import React, { useState, useEffect } from "react";
import config from "../config";
import Swal from "sweetalert2";
import Pagination from "../components/Pagination";

const Faculties = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for adding a new faculty (only "name" field)
  const [newFaculty, setNewFaculty] = useState({ name: "" });
  // State for editing a faculty
  const [editingFaculty, setEditingFaculty] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Get faculties from API
  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.faculty}`
      );
      if (!response.ok) throw new Error("Failed to fetch faculties");
      const data = await response.json();
      setFaculties(data);

      // Tính lại số trang sau khi fetch dữ liệu mới
      const newTotalPages = Math.ceil(data.length / itemsPerPage);
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  // Handle changes for new faculty input
  const handleNewFacultyChange = (e) => {
    const { name, value } = e.target;
    setNewFaculty((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new faculty (only validating "name")
  const handleAddFaculty = async () => {
    if (!newFaculty.name.trim()) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Name cannot be empty!",
        showConfirmButton: true,
      });
    }
    if (faculties.some((fac) => fac.name === newFaculty.name)) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Name already exists!",
        showConfirmButton: true,
      });
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
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `${newFaculty.name} has been added successfully.`,
        showConfirmButton: false,
        timer: 1500,
      });
      setNewFaculty({ name: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete a faculty
  const handleDeleteFaculty = async (id, name) => {
    try {
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.faculty}/${id}/delete`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete faculty");
      }
      await fetchFaculties();

      return Swal.fire({
        icon: "success",
        title: "Delete!",
        text: `${name} has been deleted successfully`,
        showConfirmButton: true,
      });
    } catch (err) {
      setError(err.message);
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: err.message,
        showConfirmButton: true,
      });
    }
  };

  // Start editing a faculty
  const handleEditFaculty = (faculty) => {
    setEditingFaculty({ _id: faculty._id, facultyName: faculty.facultyName });
  };

  // Handle changes for edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingFaculty((prev) => ({ ...prev, [name]: value }));
  };

  // Update a faculty (only "name" validation)
  const handleUpdateFaculty = async () => {
    if (!editingFaculty.facultyName.trim()) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Name cannot be empty!",
        showConfirmButton: true,
      });
    }
    if (
      faculties.some(
        (fac) =>
          fac._id !== editingFaculty._id &&
          fac.facultyName === editingFaculty.facultyName
      )
    ) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Name already exists!",
        showConfirmButton: true,
      });
    }
    try {
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.faculty}/${editingFaculty._id}/edit`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: editingFaculty.facultyName }),
        }
      );
      if (!response.ok) throw new Error("Failed to update faculty");

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `${editingFaculty.facultyName} has been updated successfully.`,
        showConfirmButton: false,
        timer: 1500,
      });
      setEditingFaculty(null);
      await fetchFaculties();
    } catch (err) {
      setError(err.message);
    }
  };

  // Pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFaculties = faculties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(faculties.length / itemsPerPage);

  return (
    <div className="container mx-auto p-2">
      {loading && <div className="text-center">Loading...</div>}
      {error && (
        <div className="mb-4 text-center text-red-500">Error: {error}</div>
      )}
      <div className="mb-4 rounded bg-gray-50 p-2">
        <div className="flex flex-col items-center justify-around gap-4 md:flex-row md:gap-6">
          <h1 className="text-lg font-bold">New Faculty</h1>
          <input
            name="name"
            placeholder="Name"
            value={newFaculty.name}
            onChange={handleNewFacultyChange}
            className="w-full rounded border border-gray-300 px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 md:w-1/2"
          />
          <button
            onClick={handleAddFaculty}
            className="rounded bg-green-600 px-4 py-1 font-semibold text-white transition-colors duration-300 hover:bg-green-700 focus:outline-none"
          >
            Add
          </button>
        </div>
      </div>

      <ul className="space-y-2">
        {currentFaculties.map((fac) => (
          <li
            key={fac._id}
            className="flex items-center justify-between rounded bg-white p-2 shadow"
          >
            {editingFaculty && editingFaculty._id === fac._id ? (
              <div className="flex w-full flex-col items-center gap-2 md:flex-row">
                <input
                  name="facultyName"
                  value={editingFaculty.facultyName}
                  onChange={handleEditChange}
                  placeholder="Name"
                  className="w-full rounded border px-2 py-1 md:w-1/2"
                />
                <button
                  onClick={handleUpdateFaculty}
                  className="rounded bg-green-500 px-2 py-1 text-white hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingFaculty(null)}
                  className="rounded bg-gray-300 px-2 py-1 text-gray-700 hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex w-full items-center justify-between">
                <span className="text-base font-medium">{fac.facultyName}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditFaculty(fac)}
                    className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteFaculty(fac._id, fac.facultyName)
                    }
                    className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default Faculties;
