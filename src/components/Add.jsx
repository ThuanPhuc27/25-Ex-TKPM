import React, { useState } from "react";
import Swal from "sweetalert2";

const Add = ({ students, setStudents, setIsAdding }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [salary, setSalary] = useState("");
  const [date, setDate] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !salary || !date) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "All fields are required.",
        showConfirmButton: true,
      });
    }

    const id = students.length + 1;
    const newEmployee = { id, firstName, lastName, email, salary, date };

    const updatedStudents = [...students, newEmployee];
    localStorage.setItem("students_data", JSON.stringify(updatedStudents));
    setStudents(updatedStudents);
    setIsAdding(false);

    Swal.fire({
      icon: "success",
      title: "Added!",
      text: `${firstName} ${lastName}'s data has been added.`,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-lg">
      <h1 className="mb-4 text-center text-2xl font-bold text-gray-700">
        Add Employee
      </h1>
      <form onSubmit={handleAdd} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-gray-600">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-gray-600">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-gray-600">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2"
          />
        </div>

        <div>
          <label htmlFor="salary" className="block text-gray-600">
            Salary ($)
          </label>
          <input
            id="salary"
            type="number"
            name="salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-gray-600">
            Date
          </label>
          <input
            id="date"
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2"
          />
        </div>

        <div className="mt-4 flex justify-between">
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-500 py-2 px-4 text-white transition hover:bg-blue-600"
          >
            Add
          </button>
          <button
            type="button"
            className="ml-2 w-full rounded-lg bg-gray-400 py-2 px-4 text-white transition hover:bg-gray-500"
            onClick={() => setIsAdding(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;
