import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import config from "../config";
import { formatDateToInput } from "../utils/dateFormatter";
import { getFaculties } from "../utils/getFaculties";
import { getStudentStatuses } from "../utils/getStudentStatuses";
import { getPrograms } from "../utils/getPrograms";

const emailRegex = /^\S+@\S+\.\S+$/;
const phoneRegex = /^[0-9\s\-()]+$/;

const Edit = ({ students, selectedStudent, setStudents, setIsEditing }) => {
  const id = selectedStudent.studentId;
  // Chuyển đổi chuỗi ngày thành đối tượng Date khi khởi tạo state
  const [fullName, setFullName] = useState(selectedStudent.fullName);
  const [birthDate, setBirthDate] = useState(
    new Date(selectedStudent.birthDate)
  );
  const [sex, setSex] = useState(selectedStudent.sex);
  const [nationality, setNationality] = useState(selectedStudent.nationality);
  const [faculty, setFaculty] = useState(selectedStudent.faculty);
  const [schoolYear, setSchoolYear] = useState(selectedStudent.schoolYear);
  const [program, setProgram] = useState(selectedStudent.program);
  const [status, setStatus] = useState(selectedStudent.status);
  const [permanentAddress, setPermanentAddress] = useState(
    selectedStudent.permanentAddress
  );
  const [temporaryAddress, setTemporaryAddress] = useState(
    selectedStudent.temporaryAddress || {
      street: "",
      ward: "",
      district: "",
      city: "",
      country: "",
    }
  );
  const [mailingAddress, setMailingAddress] = useState(
    selectedStudent.mailingAddress || {
      street: "",
      ward: "",
      district: "",
      city: "",
      country: "",
    }
  );

  // State để lưu danh sách faculties, statuses, programs
  const [faculties, setFaculties] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [programs, setPrograms] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fac = await getFaculties();
        const sts = await getStudentStatuses();
        const pros = await getPrograms();
        setFaculties(fac);
        setStatuses(sts);
        setPrograms(pros);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  // Xử lý identityDocuments: chuyển đổi các trường ngày về Date nếu có dữ liệu
  const [identityDocument, setIdentityDocument] = useState(() => {
    if (
      selectedStudent.identityDocuments &&
      selectedStudent.identityDocuments.length > 0
    ) {
      const doc = selectedStudent.identityDocuments[0];
      return {
        ...doc,
        issueDate: doc.issueDate ? new Date(doc.issueDate) : "",
        expirationDate: doc.expirationDate ? new Date(doc.expirationDate) : "",
      };
    }
    return {
      type: "",
      number: "",
      issueDate: "",
      issuePlace: "",
      expirationDate: "",
    };
  });
  const [email, setEmail] = useState(selectedStudent.email);
  const [phone, setPhone] = useState(selectedStudent.phone);

  // Xử lý thay đổi cho địa chỉ
  const handleAddressChange = (e, addressType, field) => {
    const value = e.target.value;
    if (addressType === "permanentAddress") {
      setPermanentAddress({ ...permanentAddress, [field]: value });
    } else if (addressType === "temporaryAddress") {
      setTemporaryAddress({ ...temporaryAddress, [field]: value });
    } else if (addressType === "mailingAddress") {
      setMailingAddress({ ...mailingAddress, [field]: value });
    }
  };

  // Xử lý thay đổi cho identity document
  const handleIdentityDocChange = (e, field) => {
    const value = e.target.value;
    setIdentityDocument({ ...identityDocument, [field]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    if (
      !fullName ||
      !birthDate ||
      !sex ||
      !nationality ||
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

    if (!emailRegex.test(email)) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Invalid email format.",
        showConfirmButton: true,
      });
    }

    if (!phoneRegex.test(phone)) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Invalid phone number format.",
        showConfirmButton: true,
      });
    }

    // Tạo object cập nhật bao gồm tất cả các trường theo schema.
    // Nếu cần, chuyển đổi lại các đối tượng Date thành chuỗi (hoặc giữ nguyên nếu backend chấp nhận Date)
    const updatedStudent = {
      studentId: id,
      fullName,
      birthDate,
      sex,
      nationality,
      faculty,
      schoolYear,
      program,
      permanentAddress,
      temporaryAddress,
      mailingAddress,
      identityDocuments: [identityDocument],
      email,
      phone,
      status,
    };

    try {
      const response = await fetch(
        `${config.backendApiRoot}${config.apiPaths.students}/${updatedStudent.studentId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedStudent),
        }
      );
      if (!response.ok) throw new Error("Failed to update student");

      const returnedStudent = (await response.json()).newStudent;
      const updatedStudents = students.map((student) =>
        student.studentId === id ? returnedStudent : student
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

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block font-medium">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded border p-2"
          />
        </div>

        {/* Birth Date */}
        <div>
          <label htmlFor="birthDate" className="block font-medium">
            Birth Date
          </label>
          <input
            type="date"
            id="birthDate"
            value={formatDateToInput(birthDate)}
            onChange={(e) => setBirthDate(new Date(e.target.value))}
            className="w-full rounded border p-2"
          />
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="sex" className="block font-medium">
            Gender
          </label>
          <select
            id="sex"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            className="w-full rounded border p-2"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Nationality */}
        <div>
          <label htmlFor="nationality" className="block font-medium">
            Nationality
          </label>
          <input
            type="text"
            id="nationality"
            placeholder="Nationality"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            className="w-full rounded border p-2"
          />
        </div>

        {/* Faculty */}
        <div>
          <label htmlFor="faculty" className="block font-medium">
            Faculty
          </label>
          <select
            id="faculty"
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            className="w-full rounded border p-2"
          >
            <option value="">Select Faculty</option>
            {faculties.map((fac) => (
              <option key={fac._id} value={fac.name}>
                {fac.name}
              </option>
            ))}
          </select>
        </div>

        {/* Program */}
        <div>
          <label htmlFor="program" className="block font-medium">
            Program
          </label>
          <select
            id="program"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            className="w-full rounded border p-2"
          >
            <option value="">Select Program</option>
            {programs.map((pro) => (
              <option key={pro._id} value={pro.name}>
                {pro.name}
              </option>
            ))}
          </select>
        </div>

        {/* Program */}
        <div>
          <label htmlFor="status" className="block font-medium">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded border p-2"
          >
            <option value="">Select Status</option>
            {statuses.map((st) => (
              <option key={st._id} value={st.name}>
                {st.name}
              </option>
            ))}
          </select>
        </div>

        {/* School Year */}
        <div>
          <label htmlFor="schoolYear" className="block font-medium">
            School Year
          </label>
          <input
            type="number"
            id="schoolYear"
            placeholder="School Year"
            value={schoolYear}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value) && value > 0) {
                setSchoolYear(value);
              } else {
                setSchoolYear("");
              }
            }}
            className="w-full rounded border p-2"
          />
        </div>

        {/* Permanent Address */}
        <h3 className="mt-4 font-bold">Permanent Address</h3>
        <div>
          <label className="block font-medium">Street</label>
          <input
            type="text"
            placeholder="Street"
            value={permanentAddress.street}
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
            value={permanentAddress.ward}
            onChange={(e) => handleAddressChange(e, "permanentAddress", "ward")}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">District</label>
          <input
            type="text"
            placeholder="District"
            value={permanentAddress.district}
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
            value={permanentAddress.city}
            onChange={(e) => handleAddressChange(e, "permanentAddress", "city")}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Country</label>
          <input
            type="text"
            placeholder="Country"
            value={permanentAddress.country}
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
            value={temporaryAddress.street}
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
            value={temporaryAddress.ward}
            onChange={(e) => handleAddressChange(e, "temporaryAddress", "ward")}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">District</label>
          <input
            type="text"
            placeholder="District"
            value={temporaryAddress.district}
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
            value={temporaryAddress.city}
            onChange={(e) => handleAddressChange(e, "temporaryAddress", "city")}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Country</label>
          <input
            type="text"
            placeholder="Country"
            value={temporaryAddress.country}
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
            value={mailingAddress.street}
            onChange={(e) => handleAddressChange(e, "mailingAddress", "street")}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Ward</label>
          <input
            type="text"
            placeholder="Ward"
            value={mailingAddress.ward}
            onChange={(e) => handleAddressChange(e, "mailingAddress", "ward")}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">District</label>
          <input
            type="text"
            placeholder="District"
            value={mailingAddress.district}
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
            value={mailingAddress.city}
            onChange={(e) => handleAddressChange(e, "mailingAddress", "city")}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Country</label>
          <input
            type="text"
            placeholder="Country"
            value={mailingAddress.country}
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
            value={identityDocument.type}
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
            value={identityDocument.number}
            onChange={(e) => handleIdentityDocChange(e, "number")}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Issue Date</label>
          <input
            type="date"
            value={formatDateToInput(identityDocument.issueDate)}
            onChange={(e) => handleIdentityDocChange(e, "issueDate")}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Issue Place</label>
          <input
            type="text"
            placeholder="Issue Place"
            value={identityDocument.issuePlace}
            onChange={(e) => handleIdentityDocChange(e, "issuePlace")}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Expiration Date</label>
          <input
            type="date"
            value={formatDateToInput(identityDocument.expirationDate)}
            onChange={(e) => handleIdentityDocChange(e, "expirationDate")}
            className="w-full border p-2"
          />
        </div>

        {/* Nút điều khiển */}
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
