import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const StudentDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const student = location.state.student;
  console.log("student in detail", student);

  // Chuyển đổi birthDate nếu cần
  const birthDate = new Date(student.birthDate).toLocaleDateString();

  // Hàm chuyển đổi địa chỉ thành chuỗi hiển thị
  const formatAddress = (address) => {
    const { street, ward, district, city, country } = address;
    return `${street}, ${ward}, ${district}, ${city}, ${country}`;
  };

  // Hàm kiểm tra địa chỉ rỗng (tất cả các trường đều trống hoặc chỉ chứa khoảng trắng)
  const isAddressEmpty = (address) => {
    if (!address) return true;
    return Object.values(address).every((val) => !val || val.trim() === "");
  };

  // Hiển thị thông tin của identityDocuments (chỉ hiện phần tử đầu tiên)
  const identityDoc =
    student.identityDocuments && student.identityDocuments.length > 0
      ? student.identityDocuments[0]
      : null;

  return (
    <div className="mx-auto mt-6 max-w-xl rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-semibold text-gray-700">
        Student Details
      </h2>
      <div className="space-y-2">
        <p>
          <strong>Student ID:</strong> {student.studentId}
        </p>
        <p>
          <strong>Full Name:</strong> {student.fullName}
        </p>
        <p>
          <strong>Birth Date:</strong> {birthDate}
        </p>
        <p>
          <strong>Gender:</strong> {student.sex}
        </p>
        <p>
          <strong>Nationality:</strong> {student.nationality}
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
        {/* Hiển thị Permanent Address nếu có và không trống */}
        {student.permanentAddress &&
          !isAddressEmpty(student.permanentAddress) && (
            <p>
              <strong>Permanent Address:</strong>{" "}
              {formatAddress(student.permanentAddress)}
            </p>
          )}
        {/* Hiển thị Temporary Address nếu có và không trống */}
        {student.temporaryAddress &&
          !isAddressEmpty(student.temporaryAddress) && (
            <p>
              <strong>Temporary Address:</strong>{" "}
              {formatAddress(student.temporaryAddress)}
            </p>
          )}
        {/* Hiển thị Mailing Address nếu có và không trống */}
        {student.mailingAddress && !isAddressEmpty(student.mailingAddress) && (
          <p>
            <strong>Mailing Address:</strong>{" "}
            {formatAddress(student.mailingAddress)}
          </p>
        )}
        {/* Identity Document */}
        {identityDoc && (
          <>
            <p>
              <strong>Document Type:</strong> {identityDoc.type}
            </p>
            <p>
              <strong>Document Number:</strong> {identityDoc.number}
            </p>
            <p>
              <strong>Issue Date:</strong>{" "}
              {new Date(identityDoc.issueDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Issue Place:</strong> {identityDoc.issuePlace}
            </p>
            <p>
              <strong>Expiration Date:</strong>{" "}
              {new Date(identityDoc.expirationDate).toLocaleDateString()}
            </p>
          </>
        )}
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
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>
    </div>
  );
};

export default StudentDetails;
