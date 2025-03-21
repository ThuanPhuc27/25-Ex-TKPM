import React, { useState, useEffect } from "react";
import config from "../config";

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newProgram, setNewProgram] = useState({ code: "", name: "" });
  const [editingProgram, setEditingProgram] = useState(null);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.program}`
      );
      if (!response.ok) throw new Error("Failed to fetch programs");
      const data = await response.json();
      setPrograms(data);
    } catch (err) {
      setError(err.message);
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
    if (!newProgram.code.trim() || !newProgram.name.trim()) {
      setError("Code and Name cannot be empty!");
      alert("Code and Name cannot be empty!");
      return;
    }
    if (programs.some((pro) => pro.code === newProgram.code)) {
      setError("Code already exists!");
      alert("Code already exists!");
      return;
    }
    if (programs.some((pro) => pro.name === newProgram.name)) {
      setError("Name already exists!");
      alert("Name already exists!");
      return;
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
      setNewProgram({ code: "", name: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProgram = async (id) => {
    try {
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.program}/${id}/delete`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete program");
      await fetchPrograms();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditProgram = (program) => {
    setEditingProgram({ ...program });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProgram((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProgram = async () => {
    if (!editingProgram.code.trim() || !editingProgram.name.trim()) {
      setError("Code and Name cannot be empty!");
      alert("Code and Name cannot be empty!");
      return;
    }
    if (
      programs.some(
        (pro) =>
          pro._id !== editingProgram._id &&
          (pro.code === editingProgram.code || pro.name === editingProgram.name)
      )
    ) {
      setError("Code or Name already exists!");
      alert("Code or Name already exists!");
      return;
    }
    try {
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.program}/${editingProgram._id}/edit`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProgram),
        }
      );
      if (!response.ok) throw new Error("Failed to update program");
      setEditingProgram(null);
      await fetchPrograms();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Programs</h1>
      {loading && <div className="text-center">Loading...</div>}
      {error && (
        <div className="mb-4 text-center text-red-500">Error: {error}</div>
      )}

      <ul className="space-y-4">
        {programs.map((pro) => (
          <li
            key={pro._id}
            className="flex items-center justify-between rounded bg-white p-4 shadow"
          >
            {editingProgram && editingProgram._id === pro._id ? (
              <div className="flex w-full flex-col items-center gap-2 md:flex-row">
                <input
                  name="code"
                  value={editingProgram.code}
                  onChange={handleEditChange}
                  placeholder="Code"
                  className="w-full rounded border px-3 py-2 md:w-1/4"
                />
                <input
                  name="name"
                  value={editingProgram.name}
                  onChange={handleEditChange}
                  placeholder="Name"
                  className="w-full rounded border px-3 py-2 md:w-1/2"
                />
                <button
                  onClick={handleUpdateProgram}
                  className="rounded bg-green-500 px-3 py-2 text-white hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingProgram(null)}
                  className="rounded bg-gray-300 px-3 py-2 text-gray-700 hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex w-full items-center justify-between">
                <span className="text-lg font-medium">
                  {pro.code} - {pro.name}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditProgram(pro)}
                    className="rounded bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProgram(pro._id)}
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

      <div className="mt-8 rounded bg-white p-6 shadow">
        <h2 className="mb-4 text-2xl font-semibold">Add New Program</h2>
        <div className="flex flex-col gap-4 md:flex-row">
          <input
            name="code"
            placeholder="Code"
            value={newProgram.code}
            onChange={handleNewProgramChange}
            className="w-full rounded border px-3 py-2 md:w-1/4"
          />
          <input
            name="name"
            placeholder="Name"
            value={newProgram.name}
            onChange={handleNewProgramChange}
            className="w-full rounded border px-3 py-2 md:w-1/2"
          />
          <button
            onClick={handleAddProgram}
            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default Programs;
