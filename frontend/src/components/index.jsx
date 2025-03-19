import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "./Header";
import Table from "./Table";
import Add from "./Add";
import Edit from "./Edit";
import Search from "./Search";
import Pagination from "./Pagination.jsx";

// Dữ liệu dự phòng (fallback) nếu API không trả về dữ liệu
// import { Students_data } from "../data/index.js";
import { Student, Students_data } from "../model/student.js";

import {
  fetchAllStudents,
  removeStudentById,
} from "../service/studentProvider";
import config from "../config.js";

const Dashboard = ({ setIsAuthenticated }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // State cho search và pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // số lượng sinh viên hiển thị trên mỗi trang

  // Hàm refresh lấy danh sách sinh viên từ API
  const refreshStudents = () => {
    fetch(`${config.backendApiRoot}${config.apiPaths.students}`)
      .then((res) => res.json())
      .then((data) => {
        setStudents(data.students.map((student) => Student.from(student)));
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        // Nếu có lỗi, sử dụng dữ liệu dự phòng từ file JSON
        // setStudents(Students_data);
      });
  };

  // const refreshStudentsLocally = () => {
  //   fetchAllStudents()
  //     .then((data) => {
  //       setStudents(data);
  //     })
  //     .catch((err) => {
  //       console.error(`Error fetching students: ${err}`);
  //     });
  // };

  useEffect(() => {
    refreshStudents();
  }, []);

  const filteredStudents = students.filter(
    (student) =>
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Tính số trang và danh sách sinh viên ở trang hiện tại
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleEdit = (id) => {
    const [student] = students.filter((student) => student.studentId === id);
    setSelectedStudent(student);
    setIsEditing(true);
  };

  // Sau khi xóa từ API, ta refresh lại danh sách student
  const handleDelete = (id) => {
    refreshStudents();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleView = (id, student) => {
    navigate(`/students/${id}`, {
      state: { student },
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
          <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <div className="mt-6">
            <Table
              students={currentStudents}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleView={handleView}
              refreshStudents={refreshStudents}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
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
