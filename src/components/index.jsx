import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

import Header from "./Header";
import Table from "./Table";
import Add from "./Add";
import Edit from "./Edit";

import { Students_data } from "../data/index.js";

const Dashboard = ({ setIsAuthenticated }) => {
  const [students, setStudents] = useState(Students_data);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("students_data"));
    if (data !== null && Object.keys(data).length !== 0) setStudents(data);
  }, []);

  const handleEdit = (id) => {
    const [student] = students.filter((student) => student.id === id);
    setSelectedStudent(student);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
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
          "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2", // Tailwind class cho nút xác nhận
        cancelButton: "bg-red-300 text-gray-800 hover:bg-red-400 py-2 px-7", // Tailwind class cho nút hủy
      },
    }).then((result) => {
      if (result.value) {
        const [student] = students.filter((student) => student.id === id);

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: `${student.firstName} ${student.lastName}'s data has been deleted.`,
          showConfirmButton: false,
          timer: 1500,
        });

        const studentsCopy = students.filter((student) => student.id !== id);
        localStorage.setItem("students_data", JSON.stringify(studentsCopy));
        setStudents(studentsCopy);
      }
    });
  };

  return (
    <div className="container mx-auto p-6">
      {!isAdding && !isEditing && (
        <>
          <Header
            setIsAdding={setIsAdding}
            setIsAuthenticated={setIsAuthenticated}
          />
          <div className="mt-6">
            <Table
              students={students}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          </div>
        </>
      )}
      {isAdding && (
        <div className="mt-6">
          <Add
            students={students}
            setStudents={setStudents}
            setIsAdding={setIsAdding}
          />
        </div>
      )}
      {isEditing && (
        <div className="mt-6">
          <Edit
            students={students}
            selectedStudent={selectedStudent}
            setStudents={setStudents}
            setIsEditing={setIsEditing}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
