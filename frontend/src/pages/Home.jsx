import React, { useState, useEffect } from "react";
import Table from "../components/Table.jsx";
import Add from "../components/Add.jsx";
import Edit from "../components/Edit.jsx";
import Search from "../components/Search.jsx";
import Pagination from "../components/Pagination.jsx";
import config from "../config.js";
import ImportExport from "../components/ImportExport.jsx";
import { getFaculties } from "../utils/getFaculties.js";
import Swal from "sweetalert2";

const LOCAL_STORAGE_KEY = "ALLOWED_EMAIL_DOMAINS";
const RULES_KEY = "STUDENT_STATUS_RULES";

const Home = ({ setIsAuthenticated }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [faculties, setFaculties] = useState([]);

  // State cho search và pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchDomainsAndRules = async () => {
    try {
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.domains}/`
      );
      if (!response.ok) throw new Error("Error call API");
      const data = await response.json();

      const backendDomains = data.ALLOWED_EMAIL_DOMAINS || [];

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(backendDomains));
      console.log(backendDomains);

      const response2 = await fetch(
        `${config.backendApiRoot}${config.apiPaths.rules}/`
      );

      if (!response2.ok) {
        throw new Error("Failed to fetch rules from the backend");
      }

      const rules = await response2.json();

      localStorage.setItem(RULES_KEY, JSON.stringify(rules));

      console.log("Fetched rules:", rules);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Cannot load domain from server.",
        showConfirmButton: true,
        customClass: {
          confirmButton:
            "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
        },
      });
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchDomainsAndRules();
  }, []);

  // Hàm refresh lấy danh sách sinh viên từ API
  const refreshStudents = () => {
    fetch(
      `${config.backendApiRoot}${config.apiPaths.students}?populated=${true}`
    )
      .then((res) => res.json())
      .then((data) => {
        setStudents(data.students);

        // Tính lại số trang sau khi fetch dữ liệu mới
        const newTotalPages = Math.ceil(data.length / itemsPerPage);
        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages);
        }
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
  }, [isAdding, isEditing]);

  useEffect(() => {
    getAllFaculties();
  }, []);

  // Lọc sinh viên theo tên (searchQuery) và khoa (facultyFilter)
  const filteredStudents = students.filter((student) => {
    const searchLower = searchQuery.toLowerCase();
    const matchName = student.fullName.toLowerCase().includes(searchLower);
    const matchId = student.studentId.toLowerCase().includes(searchLower);
    const matchFaculty =
      facultyFilter === "" || student.faculty.facultyName === facultyFilter;
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

export default Home;
