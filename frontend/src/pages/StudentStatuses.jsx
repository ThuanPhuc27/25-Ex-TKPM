import React, { useState, useEffect } from "react";
import config from "../config";
import Pagination from "../components/Pagination";

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
    fetchStatuses();
  }, []);

  const handleNewStatusChange = (e) => {
    const { name, value } = e.target;
    setNewStatus((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddStatus = async () => {
    if (!newStatus.name.trim()) {
      alert("Name cannot be empty!");
      return;
    }
    if (statuses.some((st) => st.statusName === newStatus.name)) {
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
      setNewStatus({ name: "" });
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
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete status");
      }
      await fetchStatuses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditStatus = (status) => {
    setEditingStatus({ _id: status._id, statusName: status.statusName });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingStatus((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateStatus = async () => {
    if (!editingStatus.statusName.trim()) {
      setError("Name cannot be empty!");
      alert("Name cannot be empty!");
      return;
    }
    if (
      statuses.some(
        (st) =>
          st._id !== editingStatus._id &&
          st.statusName === editingStatus.statusName
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
          body: JSON.stringify({ name: editingStatus.statusName }), // ✅ Sửa đúng key
        }
      );
      if (!response.ok) throw new Error("Failed to update status");
      setEditingStatus(null);
      await fetchStatuses();
    } catch (err) {
      setError(err.message);
    }
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStatuses = statuses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(statuses.length / itemsPerPage);

  return (
    <div className="container mx-auto p-2">
      {loading && <div className="text-center">Loading...</div>}
      {error && (
        <div className="mb-4 text-center text-red-500">Error: {error}</div>
      )}
      <div className="mb-4 rounded bg-gray-50 p-2">
        <div className="flex flex-col items-center justify-around gap-4 md:flex-row">
          <h2 className="text-lg font-bold">New Status</h2>
          <input
            name="name"
            placeholder="Name"
            value={newStatus.name}
            onChange={handleNewStatusChange}
            className="w-full rounded border px-3 py-1 md:w-1/2"
          />
          <button
            onClick={handleAddStatus}
            className="rounded bg-green-500 px-4 py-1 text-white hover:bg-green-600"
          >
            Add
          </button>
        </div>
      </div>
      <ul className="space-y-2">
        {currentStatuses.map((st) => (
          <li
            key={st._id}
            className="flex items-center justify-between rounded bg-white p-2 shadow"
          >
            {editingStatus && editingStatus._id === st._id ? (
              <div className="flex w-full flex-col items-center gap-2 md:flex-row">
                <input
                  name="statusName"
                  value={editingStatus.statusName}
                  onChange={handleEditChange}
                  placeholder="Name"
                  className="w-full rounded border px-2 py-1 md:w-1/2"
                />
                <button
                  onClick={handleUpdateStatus}
                  className="rounded bg-green-500 px-2 py-1 text-white hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingStatus(null)}
                  className="rounded bg-gray-300 px-2 py-1 text-gray-700 hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex w-full items-center justify-between">
                <span className="text-base font-medium">{st.statusName}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditStatus(st)}
                    className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteStatus(st._id)}
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

export default StudentStatuses;
