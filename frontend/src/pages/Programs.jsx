import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import config from "../config";
import Pagination from "../components/Pagination";

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newProgram, setNewProgram] = useState({ name: "" });
  const [editingProgram, setEditingProgram] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.program}`
      );
      if (!response.ok) throw new Error("Failed to fetch programs");
      const data = await response.json();
      setPrograms(data);

      // Tính lại số trang sau khi fetch dữ liệu mới
      const newTotalPages = Math.ceil(data.length / itemsPerPage);
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
    } catch (err) {
      setError(err.message);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: err.message,
        showConfirmButton: true,
        customClass: {
          confirmButton:
            "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleNewProgramChange = (e) => {
    const { name, value } = e.target;
    setNewProgram((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProgram = async () => {
    if (!newProgram.name.trim()) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Name cannot be empty!",
        showConfirmButton: true,
        customClass: {
          confirmButton:
            "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
        },
      });
    }
    if (programs.some((pro) => pro.programName === newProgram.name)) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Name already exists!",
        showConfirmButton: true,
        customClass: {
          confirmButton:
            "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
        },
      });
    }
    try {
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.program}/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProgram),
        }
      );
      if (!response.ok) throw new Error("Failed to add program");
      await fetchPrograms();
      Swal.fire({
        icon: "success",
        title: "Added!",
        text: `${newProgram.name} added successfully.`,
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          confirmButton:
            "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
        },
      });
      setNewProgram({ name: "" });
    } catch (err) {
      setError(err.message);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: err.message,
        showConfirmButton: true,
        customClass: {
          confirmButton:
            "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
        },
      });
    }
  };

  const handleDeleteProgram = async (id, name) => {
    try {
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.program}/${id}/delete`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete faculty");
      }
      await fetchPrograms();
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `${name} deleted successfully.`,
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          confirmButton:
            "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
        },
      });
    } catch (err) {
      setError(err.message);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: err.message,
        showConfirmButton: true,
        customClass: {
          confirmButton:
            "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
        },
      });
    }
  };

  const handleEditProgram = (program) => {
    setEditingProgram({ _id: program._id, programName: program.programName });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProgram((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProgram = async () => {
    if (!editingProgram.programName.trim()) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Name cannot be empty!",
        showConfirmButton: true,
        customClass: {
          confirmButton:
            "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
        },
      });
    }
    if (
      programs.some(
        (pro) =>
          pro._id !== editingProgram._id &&
          pro.programName === editingProgram.programName
      )
    ) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Name already exists!",
        showConfirmButton: true,
        customClass: {
          confirmButton:
            "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
        },
      });
    }
    try {
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.program}/${editingProgram._id}/edit`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: editingProgram.programName }),
        }
      );
      if (!response.ok) throw new Error("Failed to update program");
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `${editingProgram.programName} updated successfully.`,
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          confirmButton:
            "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
        },
      });
      setEditingProgram(null);
      await fetchPrograms();
    } catch (err) {
      setError(err.message);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: err.message,
        showConfirmButton: true,
        customClass: {
          confirmButton:
            "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
        },
      });
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPrograms = programs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(programs.length / itemsPerPage);

  return (
    <div className="container mx-auto p-2">
      {loading && <div className="text-center">Loading...</div>}
      {error && (
        <div className="mb-4 text-center text-red-500">Error: {error}</div>
      )}
      <div className="mb-4 rounded bg-gray-50 p-2">
        <div className="flex flex-col items-center justify-around gap-4 md:flex-row">
          <h1 className="text-lg font-bold">New Program</h1>
          <input
            name="name"
            placeholder="Name"
            value={newProgram.name}
            onChange={handleNewProgramChange}
            className="w-full rounded border px-3 py-1 md:w-1/2"
          />
          <button
            onClick={handleAddProgram}
            className="rounded bg-green-500 px-4 py-1 text-white hover:bg-green-600"
          >
            Add
          </button>
        </div>
      </div>
      <ul className="space-y-2">
        {currentPrograms.map((pro) => (
          <li
            key={pro._id}
            className="flex items-center justify-between rounded bg-white p-2 shadow"
          >
            {editingProgram && editingProgram._id === pro._id ? (
              <div className="flex w-full flex-col items-center gap-2 md:flex-row">
                <input
                  name="programName"
                  value={editingProgram.programName}
                  onChange={handleEditChange}
                  placeholder="Name"
                  className="w-full rounded border px-2 py-1 md:w-1/2"
                />
                <button
                  onClick={handleUpdateProgram}
                  className="rounded bg-green-500 px-2 py-1 text-white hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingProgram(null)}
                  className="rounded bg-gray-300 px-2 py-1 text-gray-700 hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex w-full items-center justify-between">
                <span className="text-base font-medium">{pro.programName}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditProgram(pro)}
                    className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteProgram(pro._id, pro.programName)
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

export default Programs;
