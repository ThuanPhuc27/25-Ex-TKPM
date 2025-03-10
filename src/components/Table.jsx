import React from "react";

const Table = ({ students, handleEdit, handleDelete }) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: null,
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Birthday</th>
            <th className="border border-gray-300 px-4 py-2">Gender</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Phone</th>
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
                key={student.student_id}
                className="text-center odd:bg-white even:bg-gray-100"
              >
                <td className="border border-gray-300 px-4 py-2">
                  {student.student_id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.full_name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.birth_date}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.sex}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.phone}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.status}
                </td>
                <td className="border border-gray-300 py-2 text-center">
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-700"
                  >
                    View
                  </button>
                </td>
                <td className="border border-gray-300 py-2 text-center">
                  <button
                    onClick={() => handleEdit(student.id)}
                    className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-700"
                  >
                    Edit
                  </button>
                </td>
                <td className="border border-gray-300 py-2 text-center">
                  <button
                    onClick={() => handleDelete(student.id)}
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
