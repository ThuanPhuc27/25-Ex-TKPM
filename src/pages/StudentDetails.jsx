import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const StudentDetails = () => {
  const { id } = useParams(); // Lấy id sinh viên từ URL
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dữ liệu ảo dùng làm fallback nếu không lấy được dữ liệu từ API
  const fakeStudent = {
    fullName: "John Doe",
    birthDate: "1990-01-01",
    sex: "Male",
    faculty: "Engineering",
    schoolYear: "2010-2014",
    program: "Computer Science",
    address: "123 Fake Street",
    email: "johndoe@example.com",
    phone: "123456789",
    status: "Active",
  };

  useEffect(() => {
    // Gọi API lấy thông tin sinh viên
    fetch(`http://localhost:5000/api/students/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Không tìm thấy sinh viên!");
        }
        return res.json();
      })
      .then((data) => {
        setStudent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching student:", err);
        // Nếu có lỗi, sử dụng dữ liệu ảo
        setStudent(fakeStudent);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error && !student) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Student Details</h2>
      <div className="space-y-2">
        <p>
          <strong>Full Name:</strong> {student.fullName}
        </p>
        <p>
          <strong>Birth Date:</strong> {student.birthDate}
        </p>
        <p>
          <strong>Sex:</strong> {student.sex}
        </p>
        <p>
          <strong>Faculty:</strong> {student.faculty}
        </p>
        <p>
          <strong>School Year:</strong> {student.schoolYear}
        </p>
        <p>
          <strong>Program:</strong> {student.program}
        </p>
        <p>
          <strong>Address:</strong> {student.address}
        </p>
        <p>
          <strong>Email:</strong> {student.email}
        </p>
        <p>
          <strong>Phone:</strong> {student.phone}
        </p>
        <p>
          <strong>Status:</strong> {student.status}
        </p>
      </div>
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>
    </div>
  );
};

export default StudentDetails;
