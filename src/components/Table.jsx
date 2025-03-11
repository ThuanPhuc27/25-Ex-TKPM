import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Table = ({ students, handleEdit, handleDelete, handleView, refreshStudents }) => {
  const navigate = useNavigate();

  // Hàm gọi API xóa sinh viên
  const deleteStudent = (studentId) => {
    fetch(`http://localhost:5000/students/${studentId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete student");
        }
        return res.json();
      })
      .then(() => {
        // Sau khi xóa thành công, gọi hàm refresh để cập nhật lại danh sách (nếu được truyền vào)
        if (refreshStudents) {
          refreshStudents();
        }
        // Hoặc gọi callback handleDelete nếu bạn muốn xử lý tại component cha
        if (handleDelete) {
          handleDelete(studentId);
        }
      })
      .catch((error) => {
        console.error("Error deleting student:", error);
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
        confirmButton: "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
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
            <th colSpan={3} className="border border-gray-300 px-4 py-2 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student.student_id} className="text-center odd:bg-white even:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{student.student_id}</td>
                <td className="border border-gray-300 px-4 py-2">{student.full_name}</td>
                <td className="border border-gray-300 px-4 py-2">{student.faculty}</td>
                <td className="border border-gray-300 px-4 py-2">{student.status}</td>
                <td className="border border-gray-300 py-2 text-center">
                  <button
                    onClick={() => {
                      if (handleView) {
                        handleView(student.student_id);
                      } else {
                        navigate(`/students/${student.student_id}`);
                      }
                    }}
                    className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-700"
                  >
                    View
                  </button>
                </td>
                <td className="border border-gray-300 py-2 text-center">
                  <button
                    onClick={() => handleEdit(student.student_id)}
                    className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-700"
                  >
                    Edit
                  </button>
                </td>
                <td className="border border-gray-300 py-2 text-center">
                  <button
                    onClick={() => confirmDelete(student.student_id)}
                    className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="border border-gray-300 px-4 py-2 text-center">
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
