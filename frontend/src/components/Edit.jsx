import React, { useState } from "react";
import Swal from "sweetalert2";
import config from "../config";
import { Student } from "../model/student";
import { formatDateToInput } from "../utils/dateFormatter";

const validFaculties = [
  "Faculty of Law",
  "Faculty of Business English",
  "Faculty of Japanese",
  "Faculty of French",
];

const validStatuses = ["Active", "Graduated", "Dropped Out", "Paused"];

// Regex kiểm tra định dạng email
const emailRegex = /^\S+@\S+\.\S+$/;

// Regex kiểm tra số điện thoại (cho phép số, dấu cách, dấu gạch ngang, dấu ngoặc)
const phoneRegex = /^[0-9\s\-()]+$/;

const Edit = ({ students, selectedStudent, setStudents, setIsEditing }) => {
  // const id = selectedStudent.id;
  const id = selectedStudent["studentId"];

  const [fullName, setFullName] = useState(selectedStudent.fullName);
  const [birthDate, setBirthDate] = useState(selectedStudent.birthDate);
  const [sex, setSex] = useState(selectedStudent.sex);
  const [faculty, setFaculty] = useState(selectedStudent.faculty);
  const [schoolYear, setSchoolYear] = useState(selectedStudent.schoolYear);
  const [program, setProgram] = useState(selectedStudent.program);
  const [address, setAddress] = useState(selectedStudent.address);
  const [email, setEmail] = useState(selectedStudent.email);
  const [phone, setPhone] = useState(selectedStudent.phone);
  const [status, setStatus] = useState(selectedStudent.status);

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    if (
      !fullName ||
      !birthDate ||
      !sex ||
      !faculty ||
      !schoolYear ||
      !program ||
      !email ||
      !phone ||
      !status
    ) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "All fields are required.",
        showConfirmButton: true,
      });
    }

    // Kiểm tra định dạng email
    if (!emailRegex.test(email)) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Invalid email format.",
        showConfirmButton: true,
      });
    }

    // Kiểm tra số điện thoại
    if (!phoneRegex.test(phone)) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Invalid phone number format.",
        showConfirmButton: true,
      });
    }

    // Kiểm tra tên khoa hợp lệ
    if (!validFaculties.includes(faculty)) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Invalid faculty name.",
        showConfirmButton: true,
      });
    }

    // Kiểm tra tình trạng sinh viên hợp lệ
    if (!validStatuses.includes(status)) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Invalid student status.",
        showConfirmButton: true,
      });
    }

    const updatedStudent = {
      studentId: id,
      fullName,
      birthDate,
      sex,
      faculty,
      schoolYear,
      program,
      address,
      email,
      phone,
      status,
    };

    try {
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.students}/${updatedStudent.studentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedStudent),
        }
      );
      if (!response.ok) throw new Error("Failed to update student");

      const returnedStudent = (await response.json()).newStudent;
      const updatedStudents = students.map((student) =>
        student.studentId === id ? Student.from(returnedStudent) : student
      );
      setStudents(updatedStudents);
      setIsEditing(false);

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `${fullName}'s data has been updated successfully.`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message,
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-lg bg-white p-6 shadow-lg">
      <form onSubmit={handleUpdate} className="space-y-4">
        <h1 className="mb-6 text-2xl font-semibold">Edit Student</h1>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded border p-2"
        />
        <input
          type="date"
          value={formatDateToInput(birthDate)}
          onChange={(e) => setBirthDate(new Date(e.target.value))}
          className="w-full rounded border p-2"
        />
        <select
          value={sex}
          onChange={(e) => setSex(e.target.value)}
          className="w-full rounded border p-2"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <select
          value={faculty}
          onChange={(e) => setFaculty(e.target.value)}
          className="w-full rounded border p-2"
        >
          <option value="">Select Faculty</option>
          <option value="Faculty of Law">Faculty of Law</option>
          <option value="Faculty of Business English">
            Faculty of Business English
          </option>
          <option value="Faculty of Japanese">Faculty of Japanese</option>
          <option value="Faculty of French">Faculty of French</option>
        </select>
        <input
          type="number"
          placeholder="School Year"
          value={schoolYear}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (!isNaN(value) && value > 0) {
              setSchoolYear(value);
            } else {
              setSchoolYear(""); // Nếu nhập giá trị không hợp lệ, đặt lại thành rỗng
            }
          }}
          className="w-full rounded border p-2"
        />
        <input
          type="text"
          placeholder="Program"
          value={program}
          onChange={(e) => setProgram(e.target.value)}
          className="w-full rounded border p-2"
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full rounded border p-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border p-2"
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded border p-2"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded border p-2"
        >
          <option value="">Select Status</option>
          <option value="Active">Active</option>
          <option value="Graduated">Graduated</option>
          <option value="Dropped Out">Dropped Out</option>
          <option value="Paused">Paused</option>
        </select>
        <div className="mt-4 flex justify-between">
          <button
            type="submit"
            className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="ml-2 w-full rounded bg-gray-400 p-2 text-white hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edit;
