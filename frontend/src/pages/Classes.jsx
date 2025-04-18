import React, { useState, useEffect, useRef } from "react";
import config from "../config";
import Swal from "sweetalert2";
import Pagination from "../components/Pagination";
import CustomModal from "../components/CustomModal";
import { Link } from "react-router-dom";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [newClass, setNewClass] = useState({
    classCode: "",
    courseCode: "",
    academicYear: new Date().getFullYear(),
    semester: "I",
    lecturers: [],
    maxStudents: 30,
    schedule: "",
    classroom: "",
  });

  const [editingClass, setEditingClass] = useState(null);
  const originalClassRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch all classes
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${config.backendApiRoot}${config.apiPaths.classes}`
      );
      if (!res.ok) throw new Error("Failed to fetch classes");
      const data = await res.json();
      setClasses(data);
      // Adjust page if needed
      const totalPages = Math.ceil(data.length / itemsPerPage);
      if (currentPage > totalPages) setCurrentPage(totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses for selection
  const fetchCourses = async () => {
    try {
      const res = await fetch(
        `${config.backendApiRoot}${config.apiPaths.courses}`
      );
      if (!res.ok) throw new Error("Failed to fetch courses");
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchClasses();
  }, []);

  // Helpers
  const handleChangeNew = (e) => {
    const { name, value } = e.target;
    setNewClass((prev) => ({
      ...prev,
      [name]:
        name === "maxStudents" || name === "academicYear"
          ? Number(value)
          : value,
    }));
  };

  const buildDiff = (orig, updated) => {
    const diff = {};
    Object.keys(updated).forEach((key) => {
      if (key === "_id") return;
      const a = orig[key];
      const b = updated[key];
      if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length || a.some((v, i) => v !== b[i]))
          diff[key] = b;
      } else if (a !== b) diff[key] = b;
    });
    return diff;
  };

  // Add
  const handleAddClass = async () => {
    // Basic validation
    if (!newClass.classCode || !newClass.courseCode) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Class code and course are required.",
      });
    }
    try {
      const res = await fetch(
        `${config.backendApiRoot}${config.apiPaths.classes}/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newClass),
        }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to add class");
      await fetchClasses();
      setCurrentPage(1);
      setNewClass({
        classCode: "",
        courseCode: "",
        academicYear: new Date().getFullYear(),
        semester: "I",
        lecturers: [],
        maxStudents: 30,
        schedule: "",
        classroom: "",
      });
      Swal.fire({
        icon: "success",
        title: "Created!",
        text: "Class created successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
      return true;
    } catch (err) {
      setError(err.message);
      Swal.fire({ icon: "error", title: "Error!", text: err.message });
      return false;
    }
  };

  // Delete
  const handleDeleteClass = async (id, code) => {
    try {
      const res = await fetch(
        `${config.backendApiRoot}${config.apiPaths.classes}/${id}/delete`,
        { method: "DELETE" }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to delete class");
      await fetchClasses();
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `${code} deleted.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      setError(err.message);
      Swal.fire({ icon: "error", title: "Error!", text: err.message });
    }
  };

  // Edit
  const handleEditClass = (cls) => {
    setEditingClass({ ...cls });
    originalClassRef.current = cls;
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingClass((prev) => ({
      ...prev,
      [name]:
        name === "maxStudents" || name === "academicYear"
          ? Number(value)
          : value,
    }));
  };

  const handleUpdateClass = async () => {
    const orig = originalClassRef.current;
    const updated = editingClass;
    const diff = buildDiff(orig, updated);
    if (Object.keys(diff).length === 0) {
      Swal.fire({
        icon: "info",
        title: "No Changes",
        text: "No fields modified.",
      });
      setIsEditModalOpen(false);
      return;
    }
    try {
      const res = await fetch(
        `${config.backendApiRoot}${config.apiPaths.classes}/${orig._id}/edit`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(diff),
        }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to update class");
      await fetchClasses();
      setIsEditModalOpen(false);
      setEditingClass(null);
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Class updated.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      setError(err.message);
      Swal.fire({ icon: "error", title: "Error!", text: err.message });
    }
  };

  // Pagination slicing
  const last = currentPage * itemsPerPage;
  const first = last - itemsPerPage;
  const currentList = classes.slice(first, last);
  const totalPages = Math.ceil(classes.length / itemsPerPage);

  return (
    <div className="container mx-auto p-4">
      {loading && <div className="text-center">Loading...</div>}
      {error && (
        <div className="mb-4 text-center text-red-500">Error: {error}</div>
      )}

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="mb-4 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        + Add New Class
      </button>

      <ul className="space-y-2">
        {currentList.map((cls) => (
          <li key={cls._id} className="rounded bg-white p-3 shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <Link
                  to={`/classes/${cls._id}`}
                  state={{ cls }}
                  className="font-semibold text-blue-600 hover:underline"
                >
                {cls.classCode}
                </Link>   
                <div className="text-sm text-gray-600">
                  Course: {cls.courseCode} | Year: {cls.academicYear} | Sem:{" "}
                  {cls.semester}
                </div>
                <div className="text-sm">
                  {cls.schedule} @ {cls.classroom}
                </div>
              </div>
              <div className="mt-2 flex gap-2 md:mt-0">
                <button
                  onClick={() => handleEditClass(cls)}
                  className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClass(cls._id, cls.classCode)}
                  className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Add Modal */}
      <CustomModal
        isOpen={isAddModalOpen}
        title="Add New Class"
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={async () => {
          const ok = await handleAddClass();
          if (ok) setIsAddModalOpen(false);
        }}
        confirmText="Create"
      >
        <ClassForm
          courses={courses}
          formData={newClass}
          onChange={handleChangeNew}
          isEdit={false}
        />
      </CustomModal>

      {/* Edit Modal */}
      <CustomModal
        isOpen={isEditModalOpen}
        title="Edit Class"
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleUpdateClass}
        confirmText="Save"
      >
        {editingClass && (
          <ClassForm
            courses={courses}
            formData={editingClass}
            onChange={handleEditChange}
            isEdit={true}
          />
        )}
      </CustomModal>
    </div>
  );
};

const ClassForm = ({ courses, formData, onChange, isEdit }) => {
  const semesters = ["I", "II", "III"];
  return (
    <div className="space-y-3">
      {!isEdit && (
        <div>
          <label className="block text-sm font-medium">Class Code</label>
          <input
            type="text"
            name="classCode"
            value={formData.classCode}
            onChange={onChange}
            className="w-full rounded border p-2"
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium">Course</label>
        <select
          name="courseCode"
          value={formData.courseCode}
          onChange={onChange}
          className="w-full rounded border p-2"
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c._id} value={c.courseCode}>
              {c.courseCode} - {c.courseName}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Academic Year</label>
          <input
            type="number"
            name="academicYear"
            value={formData.academicYear}
            onChange={onChange}
            className="w-full rounded border p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Semester</label>
          <select
            name="semester"
            value={formData.semester}
            onChange={onChange}
            className="w-full rounded border p-2"
          >
            {semesters.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Max Students</label>
        <input
          type="number"
          name="maxStudents"
          min={1}
          value={formData.maxStudents}
          onChange={onChange}
          className="w-full rounded border p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Schedule</label>
        <input
          type="text"
          name="schedule"
          value={formData.schedule}
          onChange={onChange}
          placeholder="e.g. Mon-Wed 9:00-11:00"
          className="w-full rounded border p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Classroom</label>
        <input
          type="text"
          name="classroom"
          value={formData.classroom}
          onChange={onChange}
          className="w-full rounded border p-2"
        />
      </div>
    </div>
  );
};

export default Classes;
