import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import config from "../config";

const Table = ({ students, handleEdit, handleDelete }) => {
  const navigate = useNavigate();

  // Hàm gọi API xóa sinh viên
  const deleteStudent = (studentId) => {
    fetch(`${config.backendApiRoot}${config.apiPaths.students}/${studentId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete student");
        }
        if (handleDelete) {
          handleDelete(studentId);
        }
      })
      .catch((error) => {
        console.log(`Error deleting student with id ${studentId}: ${err}`);
      });
  };

  // Hàm xác nhận xóa bằng SweetAlert2
  const confirmDelete = (studentId) => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      buttonsStyling: false, // Tắt styling mặc định của SweetAlert2 để dễ dàng tùy chỉnh
      customClass: {
        confirmButton:
          "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
        cancelButton: "bg-red-300 text-gray-800 hover:bg-red-400 py-2 px-7",
      },
    }).then((result) => {
      if (result.value) {
        deleteStudent(studentId);
      }
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Student ID</th>
            <th className="border border-gray-300 px-4 py-2">Full Name</th>
            <th className="border border-gray-300 px-4 py-2">Faculty</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th
              colSpan={3}
              className="border border-gray-300 px-4 py-2 text-center"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr
                key={student.studentId}
                className="text-center odd:bg-white even:bg-gray-100"
              >
                <td className="border border-gray-300 px-4 py-2">
                  {student.studentId}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.fullName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.faculty.facultyName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.status.statusName}
                </td>
                <td className="border border-gray-300 py-2 text-center">
                  <button
                    onClick={() => {
                      navigate(`/students/${student.studentId}`, {
                        state: { student },
                      });
                    }}
                    className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-700"
                  >
                    View
                  </button>
                </td>
                <td className="border border-gray-300 py-2 text-center">
                  <button
                    onClick={() => handleEdit(student.studentId)}
                    className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-700"
                  >
                    Edit
                  </button>
                </td>
                <td className="border border-gray-300 py-2 text-center">
                  <button
                    onClick={() => confirmDelete(student.studentId)}
                    className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={7}
                className="border border-gray-300 px-4 py-2 text-center"
              >
                No students
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
