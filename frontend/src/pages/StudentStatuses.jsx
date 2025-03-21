import React, { useState, useEffect } from "react";
import config from "../config";

const StudentStatuses = () => {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState({ name: "" });
  const [editingStatus, setEditingStatus] = useState(null);

  const fetchStatuses = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.studentStatus}`
      );
      if (!response.ok) throw new Error("Failed to fetch statuses");
      const data = await response.json();
      setStatuses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const handleNewStatusChange = (e) => {
    const { name, value } = e.target;
    setNewStatus((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddStatus = async () => {
    if (!newStatus.name.trim()) {
      setError("Name cannot be empty!");
      alert("Name cannot be empty!");
      return;
    }
    if (statuses.some((st) => st.code === newStatus.name)) {
      setError("Name already exists!");
      alert("Name already exists!");
      return;
    }
    try {
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.studentStatus}/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newStatus),
        }
      );
      if (!response.ok) throw new Error("Failed to add status");
      await fetchStatuses();
      setNewStatus({ code: "", name: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteStatus = async (id) => {
    try {
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.studentStatus}/${id}/delete`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete status");
      await fetchStatuses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditStatus = (status) => {
    setEditingStatus({ ...status });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingStatus((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateStatus = async () => {
    if (!newStatus.name.trim()) {
      setError("Name cannot be empty!");
      alert("Name cannot be empty!");
      return;
    }
    if (
      statuses.some(
        (st) => st._id !== editingStatus._id && st.name === editingStatus.name
      )
    ) {
      setError("Name already exists!");
      alert("Name already exists!");
      return;
    }
    try {
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.studentStatus}/${editingStatus._id}/edit`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingStatus),
        }
      );
      if (!response.ok) throw new Error("Failed to update status");
      setEditingStatus(null);
      await fetchStatuses();
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

      <div className="mb-4 rounded">
        <div className="flex flex-col items-center justify-start gap-4 md:flex-row">
          <h2 className=" mr-8 border-r-2 pr-2 text-xl font-semibold">
            New Status
          </h2>

          <input
            name="name"
            placeholder="Name"
            value={newStatus.name}
            onChange={handleNewStatusChange}
            className="w-full rounded border px-3 py-2 md:w-1/2"
          />
          <button
            onClick={handleAddStatus}
            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Add
          </button>
        </div>
      </div>
      <ul className="space-y-4">
        {statuses.map((st) => (
          <li
            key={st._id}
            className="flex items-center justify-between rounded bg-white p-4 shadow"
          >
            {editingStatus && editingStatus._id === st._id ? (
              <div className="flex w-full flex-col items-center gap-2 md:flex-row">
                <input
                  name="name"
                  value={editingStatus.name}
                  onChange={handleEditChange}
                  placeholder="Name"
                  className="w-full rounded border px-3 py-2 md:w-1/2"
                />
                <button
                  onClick={handleUpdateStatus}
                  className="rounded bg-green-500 px-3 py-2 text-white hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingStatus(null)}
                  className="rounded bg-gray-300 px-3 py-2 text-gray-700 hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex w-full items-center justify-between">
                <span className="text-lg font-medium">{st.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditStatus(st)}
                    className="rounded bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteStatus(st._id)}
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

export default StudentStatuses;
