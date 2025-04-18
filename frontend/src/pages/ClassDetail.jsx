import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import config from "../config";

const ClassDetail = () => {
  const { state } = useLocation();
  const classData = state?.cls;

  const [enrollments, setEnrollments] = useState([]); // Mỗi enrollment: { _id, student: { studentId, fullName }, class: {} }
  const [newStudentId, setNewStudentId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (classData?.classCode) {
      fetchEnrollments();
    }
  }, [classData]);

  const fetchEnrollments = async () => {
    try {
      const res = await fetch(
        `${config.backendApiRoot}${config.apiPaths.enrollments}/class/${classData.classCode}`
      );
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Failed to fetch enrollments");

      setEnrollments(result); // Expecting: [{ _id, student: { studentId, fullName } }, ...]
      setError("");
    } catch (err) {
      console.error("Error fetching enrollments:", err.message);
      setEnrollments([]); // Gracefully handle empty state
    }
  };

  const handleAddStudent = async () => {
    const trimmedId = newStudentId.trim();
    if (!trimmedId) {
      setError("Student ID cannot be empty.");
      return;
    }

    try {
      const res = await fetch(
        `${config.backendApiRoot}${config.apiPaths.enrollments}/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: trimmedId,
            classCode: classData.classCode,
          }),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to add student");

      await fetchEnrollments();
      setNewStudentId("");
      setError("");

      Swal.fire({
        icon: "success",
        title: "Student added",
        text: `Student ${trimmedId} was added successfully`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      setError(err.message);
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    }
  };


  const handleRemoveStudent = async (enrollmentId, studentId) => {
    console.log("eid: ", enrollmentId )
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: `Remove student ${studentId} from this class?`,
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#e3342f",
      confirmButtonText: "Yes, remove",
    });

    if (!confirm.isConfirmed) return;

    try {
      
      const res = await fetch(
        `${config.backendApiRoot}${config.apiPaths.enrollments}/${enrollmentId}/cancel`,
        { method: "DELETE" }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to remove student");


          // Lưu lịch sử hủy đăng ký vào localStorage
      const cancelHistory = JSON.parse(localStorage.getItem("cancelHistory")) || [];

      cancelHistory.push({
        studentId,
        classCode: classData.classCode,
        canceledAt: new Date().toISOString(),
        reason: "No reason provided", // Lý do có thể là tùy chọn
      });

      localStorage.setItem("cancelHistory", JSON.stringify(cancelHistory));

      await fetchEnrollments();
      console.log ("es", enrollments)
      Swal.fire({
        icon: "success",
        title: "Removed",
        text: `Student ${studentId} has been removed.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded-md max-w-3xl">
      {classData ? (
        <>
          <h2 className="text-3xl font-semibold text-center mb-4 text-gray-800">
            Class Details: {classData.classCode}
          </h2>

          {/* Info */}
          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              Course Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <p><strong>Course Code:</strong> {classData.courseCode}</p>
              <p><strong>Academic Year:</strong> {classData.academicYear}</p>
              <p><strong>Semester:</strong> {classData.semester}</p>
              <p><strong>Schedule:</strong> {classData.schedule}</p>
              <p><strong>Classroom:</strong> {classData.classroom}</p>
              <p><strong>Max Students:</strong> {classData.maxStudents}</p>
              <p><strong>Deactivated:</strong> {classData.deactivated ? "Yes" : "No"}</p>
            </div>
          </div>

          {/* Add student */}
          <div className="bg-gray-50 p-4 rounded-md shadow-sm mt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              Add Student
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                className="w-full sm:w-auto flex-1 p-2 border border-gray-300 rounded-md"
                placeholder="Enter Student ID"
                value={newStudentId}
                onChange={(e) => setNewStudentId(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleAddStudent}
              >
                Add
              </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          {/* Students List */}
          <div className="bg-gray-50 p-4 rounded-md shadow-sm mt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              Enrolled Students
            </h3>
            {enrollments.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {enrollments
                  .filter((enrollment) => !enrollment.isCanceled) // Lọc ra sinh viên không bị hủy
                  .map((enrollment) => (
                    <li
                      key={enrollment._id}
                      className="flex justify-between items-center py-2"
                    >
                      <span>
                        {enrollment.student?.studentId} - {enrollment.student?.fullName}
                      </span>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                        onClick={() => handleRemoveStudent(enrollment._id, enrollment.student?.studentId)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-gray-500">No students enrolled yet.</p>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-red-500 font-semibold">
          Class data is unavailable.
        </p>
      )}
    </div>
  );
};

export default ClassDetail;
