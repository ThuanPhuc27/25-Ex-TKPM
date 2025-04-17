import React, { useState, useEffect, useRef } from "react";
import config from "../config";
import Swal from "sweetalert2";
import Pagination from "../components/Pagination";
import CustomModal from "../components/CustomModal";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [newCourse, setNewCourse] = useState({
    courseCode: "",
    courseName: "",
    courseCredits: 0,
    courseDescription: "",
    managingFaculty: "",
    prerequisiteCourses: [],
  });

  const [editingCourse, setEditingCourse] = useState(null);

  // Ref to store original course data for diff
  const originalCourseRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.courses}`
      );
      if (!response.ok) throw new Error("Failed to fetch courses");
      const data = await response.json();
      setCourses(data);

      console.log("Courses:", data);

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
    fetchCourses();
  }, []);

  const handleChangeNew = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCourse = async () => {
    if (!newCourse.courseCode || !newCourse.courseName) {
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Course code and name are required.",
      });
      return false;
    }
    if (newCourse.courseCredits < 2) {
      await Swal.fire({
        icon: "error",
        title: "Invalid Credits",
        text: "Course must have at least 2 credits.",
      });
      return false;
    }

    const prereqInvalid = newCourse.prerequisiteCourses.some((id) => {
      const course = courses.find((c) => c._id === id);
      return course?.managingFaculty !== newCourse.managingFaculty;
    });

    if (prereqInvalid) {
      await Swal.fire({
        icon: "error",
        title: "Invalid Prerequisites",
        text: "All prerequisite courses must belong to the same faculty.",
      });
      return false;
    }

    const validCourseIds = courses.map((c) => c._id);
    const allExist = newCourse.prerequisiteCourses.every((id) =>
      validCourseIds.includes(id)
    );
    if (!allExist) {
      await Swal.fire({
        icon: "error",
        title: "Invalid Prerequisites",
        text: "Some prerequisite courses do not exist.",
      });
      return false;
    }

    try {
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.courses}/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCourse),
        }
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to add course");

      await fetchCourses();
      setNewCourse({
        courseCode: "",
        courseName: "",
        courseCredits: 0,
        courseDescription: "",
        managingFaculty: "",
        prerequisiteCourses: [],
      });
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Course added successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
      return true;
    } catch (err) {
      setError(err.message);
      await Swal.fire({ icon: "error", title: "Error!", text: err.message });
      return false;
    }
  };

  const handleDeleteCourse = async (id, courseName) => {
    try {
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.courses}/${id}/delete`,
        { method: "DELETE" }
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to delete course");

      await fetchCourses();
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `${courseName} has been deleted.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      setError(err.message);
      await Swal.fire({ icon: "error", title: "Error!", text: err.message });
    }
  };

  // Build diff object of only changed fields
  const buildDiff = (original, updated) => {
    const diff = {};
    Object.keys(updated).forEach((key) => {
      if (key === "_id") return;
      const origVal = original[key];
      const newVal = updated[key];
      if (Array.isArray(origVal) && Array.isArray(newVal)) {
        if (
          origVal.length !== newVal.length ||
          origVal.some((v, i) => v !== newVal[i])
        ) {
          diff[key] = newVal;
        }
      } else if (newVal !== origVal) {
        diff[key] = newVal;
      }
    });
    return diff;
  };
  const handleEditCourse = (course) => {
    setEditingCourse({ ...course });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse.courseCode || !editingCourse.courseName) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Course code and name are required.",
      });
    }

    const original = originalCourseRef.current;
    const updated = editingCourse;

    // const prereqInvalid = updated.prerequisiteCourses.some((id) => {
    //   const course = courses.find((c) => c._id === id);
    //   return course?.managingFaculty !== updated.managingFaculty;
    // });

    // if (prereqInvalid) {
    //   await Swal.fire({
    //     icon: "error",
    //     title: "Invalid Prerequisites",
    //     text: "All prerequisite courses must belong to the same faculty.",
    //   });
    //   return;
    // }

    const diffData = buildDiff(original, updated);
    if (Object.keys(diffData).length === 0) {
      Swal.fire({
        icon: "info",
        title: "No Changes",
        text: "No fields were modified.",
      });
      setIsEditModalOpen(false);
      return;
    }

    try {
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.courses}/${original._id}/edit`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(diffData),
        }
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to update course");

      await fetchCourses();
      setEditingCourse(null);
      setIsEditModalOpen(false);
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Course updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      setError(err.message);
      await Swal.fire({ icon: "error", title: "Error!", text: err.message });
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCourses = courses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(courses.length / itemsPerPage);

  return (
    <div className="container mx-auto p-2">
      {loading && <div className="text-center">Loading...</div>}
      {error && (
        <div className="mb-4 text-center text-red-500">Error: {error}</div>
      )}

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="mb-4 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        + Add New Course
      </button>

      <ul className="space-y-2">
        {currentCourses.map((course) => (
          <li key={course._id} className="rounded bg-white p-3 shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold">
                  {course.courseCode} - {course.courseName}
                </div>
                <div className="text-sm text-gray-600">
                  Credits: {course.courseCredits} | Faculty:{" "}
                  {course.managingFaculty}
                </div>
                <div className="text-sm">{course.courseDescription}</div>
              </div>
              {course.prerequisiteCourses?.length > 0 && (
                <div className="text-sm text-gray-500">
                  Prerequisites:{" "}
                  {course.prerequisiteCourses
                    .map((id) => {
                      const prereq = courses.find((c) => c._id === id);
                      return prereq ? prereq.courseCode : "Unknown";
                    })
                    .join(", ")}
                </div>
              )}
              <div className="mt-2 flex gap-2 md:mt-0">
                <button
                  onClick={() => handleEditCourse(course)}
                  className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    handleDeleteCourse(course._id, course.courseName)
                  }
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
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      <CustomModal
        isOpen={isAddModalOpen}
        title="Add New Course"
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={async () => {
          const success = await handleAddCourse();
          if (success) setIsAddModalOpen(false);
        }}
        confirmText="Add"
      >
        <CourseForm
          isEditModalOpen={isEditModalOpen}
          courses={courses}
          faculties={faculties}
          formData={newCourse}
          onChange={handleChangeNew}
          setFormData={setNewCourse}
        />
      </CustomModal>

      <CustomModal
        isOpen={isEditModalOpen}
        title="Edit Course"
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleUpdateCourse}
        confirmText="Save"
      >
        {editingCourse && (
          <CourseForm
            isEditModalOpen={isEditModalOpen}
            courses={courses}
            faculties={faculties}
            formData={editingCourse}
            onChange={handleEditChange}
            setFormData={setEditingCourse}
          />
        )}
      </CustomModal>
    </div>
  );
};

const CourseForm = ({
  courses,
  faculties,
  formData,
  onChange,
  setFormData,
  isEditModalOpen,
}) => {
  // Xử lý toggle checkbox
  const handlePrerequisiteChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const next = checked
        ? // thêm vào nếu checked
          [...prev.prerequisiteCourses, value]
        : // xóa đi nếu unchecked
          prev.prerequisiteCourses.filter((id) => id !== value);
      return { ...prev, prerequisiteCourses: next };
    });
  };

  return (
    <div className="space-y-3">
      {isEditModalOpen === false && (
        <div>
          <label className="block text-sm font-medium">Course Code</label>
          <input
            type="text"
            name="courseCode"
            value={formData.courseCode}
            onChange={onChange}
            className="w-full rounded border p-2"
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium">Course Name</label>
        <input
          type="text"
          name="courseName"
          value={formData.courseName}
          onChange={onChange}
          className="w-full rounded border p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Credits</label>
        <input
          type="number"
          name="courseCredits"
          value={formData.courseCredits}
          onChange={onChange}
          className="w-full rounded border p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Managing Faculty</label>
        <select
          value={formData.managingFaculty}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              managingFaculty: e.target.value,
            }))
          }
          className="w-full rounded border p-2"
        >
          <option value="">Select Faculty</option>
          {faculties.map((faculty) => (
            <option key={faculty._id} value={faculty._id}>
              {faculty.facultyName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="courseDescription"
          rows="3"
          value={formData.courseDescription}
          onChange={onChange}
          className="w-full rounded border p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">
          Prerequisite Courses
        </label>

        {isEditModalOpen ? (
          // EDIT MODE: chỉ xem
          formData.prerequisiteCourses?.length > 0 ? (
            <div className="mt-1 text-sm text-gray-700">
              {formData.prerequisiteCourses
                .map((id) => {
                  const c = courses.find((c) => c._id === id);
                  return c ? `${c.courseCode} - ${c.courseName}` : "Unknown";
                })
                .join(", ")}
            </div>
          ) : (
            <div className="mt-1 text-sm italic text-gray-500">
              Khóa học này không có môn tiên quyết.
            </div>
          )
        ) : formData.managingFaculty ? (
          // ADD MODE: cho chọn checkbox
          courses.filter((c) => c.managingFaculty === formData.managingFaculty)
            .length > 0 ? (
            <div className="space-y-2 pl-2">
              {courses
                .filter((c) => c.managingFaculty === formData.managingFaculty)
                .map((c) => (
                  <label
                    key={c._id}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      value={c._id}
                      checked={formData.prerequisiteCourses.includes(c._id)}
                      onChange={handlePrerequisiteChange}
                      className="form-checkbox h-4 w-4"
                    />
                    <span>
                      {c.courseCode} - {c.courseName}
                    </span>
                  </label>
                ))}
            </div>
          ) : (
            <div className="mt-1 text-sm italic text-gray-500">
              Không có môn học nào thuộc khoa này.
            </div>
          )
        ) : (
          <div className="mt-1 text-sm italic text-gray-500">
            Vui lòng chọn khoa trước.
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
