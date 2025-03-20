import React, { useState } from "react";
import Swal from "sweetalert2";
import config from "../config";

const validFaculties = [
  "Faculty of Law",
  "Faculty of Business English",
  "Faculty of Japanese",
  "Faculty of French",
];

const validStatuses = ["Active", "Graduated", "Dropped Out", "Paused"];

// Regex kiểm tra định dạng email đơn giản
const emailRegex = /^\S+@\S+\.\S+$/;

// Regex kiểm tra số điện thoại (cho phép chữ số, dấu cách, dấu gạch ngang, dấu ngoặc)
const phoneRegex = /^[0-9\s\-()]+$/;

const Add = ({ students, setStudents, setIsAdding }) => {
  const [formData, setFormData] = useState({
    studentId: "",
    fullName: "",
    birthDate: "",
    sex: "",
    faculty: "",
    schoolYear: "",
    program: "",
    nationality: "",
    email: "",
    phone: "",
    status: "",
    permanentAddress: {
      street: "",
      ward: "",
      district: "",
      city: "",
      country: "",
    },
    temporaryAddress: {
      street: "",
      ward: "",
      district: "",
      city: "",
      country: "",
    },
    mailingAddress: {
      street: "",
      ward: "",
      district: "",
      city: "",
      country: "",
    },
    identityDocuments: [
      {
        type: "",
        number: "",
        issueDate: "",
        issuePlace: "",
        expirationDate: "",
      },
    ],
  });

  // Xử lý thay đổi cho các trường cơ bản
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý thay đổi cho các trường địa chỉ
  const handleAddressChange = (e, addressType, field) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [addressType]: { ...prev[addressType], [field]: value },
    }));
  };

  // Xử lý thay đổi cho giấy tờ tùy thân (ở đây chỉ cập nhật identityDocuments[0])
  const handleIdentityDocChange = (e, field) => {
    const value = e.target.value;
    setFormData((prev) => {
      const newDocs = [...prev.identityDocuments];
      newDocs[0] = { ...newDocs[0], [field]: value };
      return { ...prev, identityDocuments: newDocs };
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const { email, phone, faculty, status, studentId } = formData;

    // Kiểm tra định dạng email và phone
    if (!emailRegex.test(email) || !phoneRegex.test(phone)) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Invalid email or phone number format.",
        showConfirmButton: true,
      });
    }

    // Kiểm tra faculty và status hợp lệ
    if (!validFaculties.includes(faculty) || !validStatuses.includes(status)) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Invalid faculty or status.",
        showConfirmButton: true,
      });
    }

    // Kiểm tra trùng studentId
    if (students.some((student) => student.studentId === studentId)) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Student ID is duplicate.",
        showConfirmButton: true,
      });
    }

    try {
      // Chuyển schoolYear sang kiểu Number nếu cần
      const dataToSend = {
        ...formData,
        schoolYear: Number(formData.schoolYear),
      };

      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.students}/add-one`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) throw new Error("Failed to add student");
      const addedStudent = (await response.json()).newStudent;
      setStudents([...students, addedStudent]);
      setIsAdding(false);

      Swal.fire({
        icon: "success",
        title: "Added!",
        text: `${formData.fullName}'s data has been added successfully.`,
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
    <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-lg">
      <h1 className="mb-4 text-center text-2xl font-bold text-gray-700">
        Add Student
      </h1>
      <form onSubmit={handleAdd} className="space-y-4">
        {/* Thông tin cơ bản */}
        <div>
          <label htmlFor="studentId" className="block font-medium">
            Student ID
          </label>
          <input
            type="text"
            id="studentId"
            name="studentId"
            placeholder="Student ID"
            value={formData.studentId}
            onChange={handleChange}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label htmlFor="fullName" className="block font-medium">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label htmlFor="birthDate" className="block font-medium">
            Birth Date
          </label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label htmlFor="sex" className="block font-medium">
            Gender
          </label>
          <select
            id="sex"
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            className="w-full border p-2"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="nationality" className="block font-medium">
            Nationality
          </label>
          <input
            type="text"
            id="nationality"
            name="nationality"
            placeholder="Nationality"
            value={formData.nationality}
            onChange={handleChange}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block font-medium">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label htmlFor="faculty" className="block font-medium">
            Faculty
          </label>
          <select
            id="faculty"
            name="faculty"
            value={formData.faculty}
            onChange={handleChange}
            className="w-full border p-2"
          >
            <option value="">Select Faculty</option>
            {validFaculties.map((fac) => (
              <option key={fac} value={fac}>
                {fac}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border p-2"
          >
            <option value="">Select Status</option>
            {validStatuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="program" className="block font-medium">
            Program
          </label>
          <input
            type="text"
            id="program"
            name="program"
            placeholder="Program"
            value={formData.program}
            onChange={handleChange}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label htmlFor="schoolYear" className="block font-medium">
            School Year
          </label>
          <input
            type="number"
            id="schoolYear"
            name="schoolYear"
            placeholder="School Year"
            value={formData.schoolYear}
            onChange={handleChange}
            className="w-full border p-2"
          />
        </div>

        {/* Permanent Address */}
        <h3 className="mt-4 font-bold">Permanent Address</h3>
        <div>
          <label className="block font-medium">Street</label>
          <input
            type="text"
            placeholder="Street"
            value={formData.permanentAddress.street}
            onChange={(e) =>
              handleAddressChange(e, "permanentAddress", "street")
            }
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Ward</label>
          <input
            type="text"
            placeholder="Ward"
            value={formData.permanentAddress.ward}
            onChange={(e) => handleAddressChange(e, "permanentAddress", "ward")}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">District</label>
          <input
            type="text"
            placeholder="District"
            value={formData.permanentAddress.district}
            onChange={(e) =>
              handleAddressChange(e, "permanentAddress", "district")
            }
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">City</label>
          <input
            type="text"
            placeholder="City"
            value={formData.permanentAddress.city}
            onChange={(e) => handleAddressChange(e, "permanentAddress", "city")}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Country</label>
          <input
            type="text"
            placeholder="Country"
            value={formData.permanentAddress.country}
            onChange={(e) =>
              handleAddressChange(e, "permanentAddress", "country")
            }
            className="w-full border p-2"
          />
        </div>

        {/* Temporary Address (Optional) */}
        <h3 className="mt-4 font-bold">Temporary Address (Optional)</h3>
        <div>
          <label className="block font-medium">Street</label>
          <input
            type="text"
            placeholder="Street"
            value={formData.temporaryAddress.street}
            onChange={(e) =>
              handleAddressChange(e, "temporaryAddress", "street")
            }
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Ward</label>
          <input
            type="text"
            placeholder="Ward"
            value={formData.temporaryAddress.ward}
            onChange={(e) => handleAddressChange(e, "temporaryAddress", "ward")}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">District</label>
          <input
            type="text"
            placeholder="District"
            value={formData.temporaryAddress.district}
            onChange={(e) =>
              handleAddressChange(e, "temporaryAddress", "district")
            }
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">City</label>
          <input
            type="text"
            placeholder="City"
            value={formData.temporaryAddress.city}
            onChange={(e) => handleAddressChange(e, "temporaryAddress", "city")}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Country</label>
          <input
            type="text"
            placeholder="Country"
            value={formData.temporaryAddress.country}
            onChange={(e) =>
              handleAddressChange(e, "temporaryAddress", "country")
            }
            className="w-full border p-2"
          />
        </div>

        {/* Mailing Address (Optional) */}
        <h3 className="mt-4 font-bold">Mailing Address (Optional)</h3>
        <div>
          <label className="block font-medium">Street</label>
          <input
            type="text"
            placeholder="Street"
            value={formData.mailingAddress.street}
            onChange={(e) => handleAddressChange(e, "mailingAddress", "street")}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Ward</label>
          <input
            type="text"
            placeholder="Ward"
            value={formData.mailingAddress.ward}
            onChange={(e) => handleAddressChange(e, "mailingAddress", "ward")}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">District</label>
          <input
            type="text"
            placeholder="District"
            value={formData.mailingAddress.district}
            onChange={(e) =>
              handleAddressChange(e, "mailingAddress", "district")
            }
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">City</label>
          <input
            type="text"
            placeholder="City"
            value={formData.mailingAddress.city}
            onChange={(e) => handleAddressChange(e, "mailingAddress", "city")}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Country</label>
          <input
            type="text"
            placeholder="Country"
            value={formData.mailingAddress.country}
            onChange={(e) =>
              handleAddressChange(e, "mailingAddress", "country")
            }
            className="w-full border p-2"
          />
        </div>

        {/* Identity Document */}
        <h3 className="mt-4 font-bold">Identity Document</h3>
        <div>
          <label className="block font-medium">Document Type</label>
          <select
            value={formData.identityDocuments[0].type}
            onChange={(e) => handleIdentityDocChange(e, "type")}
            className="w-full border p-2"
          >
            <option value="">Select Document Type</option>
            <option value="CMND">CMND</option>
            <option value="CCCD">CCCD</option>
            <option value="passport">Passport</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">Document Number</label>
          <input
            type="text"
            placeholder="Document Number"
            value={formData.identityDocuments[0].number}
            onChange={(e) => handleIdentityDocChange(e, "number")}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Issue Date</label>
          <input
            type="date"
            placeholder="Issue Date"
            value={formData.identityDocuments[0].issueDate}
            onChange={(e) => handleIdentityDocChange(e, "issueDate")}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Issue Place</label>
          <input
            type="text"
            placeholder="Issue Place"
            value={formData.identityDocuments[0].issuePlace}
            onChange={(e) => handleIdentityDocChange(e, "issuePlace")}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Expiration Date</label>
          <input
            type="date"
            placeholder="Expiration Date"
            value={formData.identityDocuments[0].expirationDate}
            onChange={(e) => handleIdentityDocChange(e, "expirationDate")}
            className="w-full border p-2"
          />
        </div>

        {/* Các nút điều khiển */}
        <button
          type="submit"
          className="w-full rounded bg-blue-500 p-2 text-white"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => setIsAdding(false)}
          className="mt-2 w-full rounded bg-gray-400 p-2 text-white"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default Add;
