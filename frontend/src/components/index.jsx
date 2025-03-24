import React, { useState, useEffect } from "react";
import Header from "./Header";
import Table from "./Table";
import Add from "./Add";
import Edit from "./Edit";
import Search from "./Search";
import Pagination from "./Pagination.jsx";

import config from "../config.js";
import ImportExport from "./ImportExport.jsx";
import { getFaculties } from "../utils/getFaculties";

const Dashboard = ({ setIsAuthenticated }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [faculties, setFaculties] = useState([]);

  // State cho search và pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // số lượng sinh viên hiển thị trên mỗi trang

  // Hàm refresh lấy danh sách sinh viên từ API
  const refreshStudents = () => {
    fetch(
      `${config.backendApiRoot}${config.apiPaths.students}?populated=${true}`
    )
      .then((res) => res.json())
      .then((data) => {
        setStudents(data.students);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
      });
  };

  const getAllFaculties = async () => {
    try {
      const fac = await getFaculties();
      setFaculties(fac);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    refreshStudents();
    getAllFaculties();
  }, []);

  // Lọc sinh viên theo tên (searchQuery) và khoa (facultyFilter)
  const filteredStudents = students.filter((student) => {
    const searchLower = searchQuery.toLowerCase();
    const matchName = student.fullName.toLowerCase().includes(searchLower);
    const matchId = student.studentId.toLowerCase().includes(searchLower);
    const matchFaculty =
      facultyFilter === "" || student.faculty === facultyFilter;
    return (matchName || matchId) && matchFaculty;
  });

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

  // Sau khi xóa từ API, refresh lại danh sách student
  const handleDelete = (id) => {
    refreshStudents();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-6">
      {!isAdding && !isEditing && (
        <>
          <ImportExport
            refreshStudents={refreshStudents}
            setIsAdding={setIsAdding}
          />
          <Search
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            facultyFilter={facultyFilter}
            setFacultyFilter={setFacultyFilter}
            faculties={faculties}
          />
          <div className="mt-6">
            <Table
              students={currentStudents}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
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
