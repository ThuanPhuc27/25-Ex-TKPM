import React, { useState } from "react";
import Swal from "sweetalert2";

const Edit = ({ students, selectedStudent, setStudents, setIsEditing }) => {
  const id = selectedStudent.id;

  const [firstName, setFirstName] = useState(selectedStudent.firstName);
  const [lastName, setLastName] = useState(selectedStudent.lastName);
  const [email, setEmail] = useState(selectedStudent.email);
  const [salary, setSalary] = useState(selectedStudent.salary);
  const [date, setDate] = useState(selectedStudent.date);

  const handleUpdate = (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !salary || !date) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "All fields are required.",
        showConfirmButton: true,
      });
    }

    const updatedEmployee = {
      id,
      firstName,
      lastName,
      email,
      salary,
      date,
    };

    const updatedStudents = students.map((emp) =>
      emp.id === id ? updatedEmployee : emp
    );

    localStorage.setItem("students_data", JSON.stringify(updatedStudents));
    setStudents(updatedStudents);
    setIsEditing(false);

    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: `${updatedEmployee.firstName} ${updatedEmployee.lastName}'s data has been updated.`,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <div className="mx-auto max-w-xl rounded-lg bg-white p-6 shadow-lg">
      <form onSubmit={handleUpdate}>
        <h1 className="mb-6 text-2xl font-semibold">Edit Employee</h1>
        <div className="mb-4">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="salary"
            className="block text-sm font-medium text-gray-700"
          >
            Salary ($)
          </label>
          <input
            id="salary"
            type="number"
            name="salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <input
            id="date"
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-6 py-2 text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="rounded-md bg-gray-500 px-6 py-2 text-white shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edit;
