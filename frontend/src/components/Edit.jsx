import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import config from "../config";
import { formatDateToInput } from "../utils/dateFormatter";
import { getFaculties } from "../utils/getFaculties";
import { getStudentStatuses } from "../utils/getStudentStatuses";
import { getPrograms } from "../utils/getPrograms";
import { isValidEmail, isValidPhoneNumber } from "../utils/validation";

const emailRegex = /^\S+@\S+\.\S+$/;
const phoneRegex = /^[0-9\s\-()]+$/;

const validTransitions = {
  Active: ["Paused", "Graduated", "Dropped Out"],
  Paused: ["Active", "Dropped Out"],
  "Dropped Out": [],
  Graduated: [],
};

const Edit = ({ students, selectedStudent, setStudents, setIsEditing }) => {
  // Lấy danh sách từ backend
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

  const id = selectedStudent.studentId;
  // Khởi tạo state từ dữ liệu của student được chọn
  const [fullName, setFullName] = useState(selectedStudent.fullName);
  const [birthDate, setBirthDate] = useState(
    new Date(selectedStudent.birthDate)
  );
  const [sex, setSex] = useState(selectedStudent.sex);
  const [nationality, setNationality] = useState(selectedStudent.nationality);

  // Sử dụng _id (hoặc code) để khớp với các option trong select
  const [faculty, setFaculty] = useState(selectedStudent.faculty._id);
  const [schoolYear, setSchoolYear] = useState(selectedStudent.schoolYear);
  const [program, setProgram] = useState(selectedStudent.program._id);
  const [status, setStatus] = useState(selectedStudent.status._id);

  const [email, setEmail] = useState(selectedStudent.email);
  const [phone, setPhone] = useState(selectedStudent.phone);
  const [originStatus, setOriginStatus] = useState(null);

  // Các địa chỉ: ban đầu luôn hiển thị (nếu không có dữ liệu, để rỗng)
  const [permanentAddress, setPermanentAddress] = useState(
    selectedStudent.permanentAddress || {
      street: "",
      ward: "",
      district: "",
      city: "",
      country: "",
    }
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

  // Thêm state để ẩn/hiện các phần địa chỉ
  const [showPermanent, setShowPermanent] = useState(true);
  const [showTemporary, setShowTemporary] = useState(true);
  const [showMailing, setShowMailing] = useState(true);

  // Identity Document
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
      hasChip: false,
      issueCountry: "",
      notes: "",
    };
  });

  useEffect(() => {
    const initialStatus = statuses.find((st) => st._id === status);
    if (initialStatus) {
      setOriginStatus(initialStatus);
    }
  }, [statuses]);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    const newStatusObj = statuses.find((st) => st._id === newStatus);

    if (
      validTransitions[originStatus.statusName]?.includes(
        newStatusObj.statusName
      )
    ) {
      setStatus(newStatus);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Cannot change status",
        showConfirmButton: true,
        customClass: {
          confirmButton:
            "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
        },
      });
    }
  };

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

    // Kiểm tra các trường cơ bản bắt buộc
    if (
      !fullName.trim() ||
      !birthDate ||
      !sex.trim() ||
      !nationality.trim() ||
      !faculty.trim() ||
      !schoolYear ||
      !program.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !status.trim()
    ) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "All basic fields are required.",
        showConfirmButton: true,
        customClass: {
          confirmButton:
            "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
        },
      });
    }

    if (!isValidEmail(email)) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Invalid Email!",
        showConfirmButton: true,
        customClass: {
          confirmButton:
            "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
        },
      });
    }

    if (!isValidPhoneNumber(nationality, phone)) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Invalid Phone number!",
        showConfirmButton: true,
        customClass: {
          confirmButton:
            "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
        },
      });
    }

    // Validate address nếu được chọn
    if (showPermanent) {
      const { street, ward, district, city, country } = permanentAddress;
      if (
        !street.trim() ||
        !ward.trim() ||
        !district.trim() ||
        !city.trim() ||
        !country.trim()
      ) {
        return Swal.fire({
          icon: "error",
          title: "Error!",
          text: "All fields in Permanent Address are required.",
          showConfirmButton: true,
          customClass: {
            confirmButton:
              "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
          },
        });
      }
    }
    if (showTemporary) {
      const { street, ward, district, city, country } = temporaryAddress;
      if (
        !street.trim() ||
        !ward.trim() ||
        !district.trim() ||
        !city.trim() ||
        !country.trim()
      ) {
        return Swal.fire({
          icon: "error",
          title: "Error!",
          text: "All fields in Temporary Address are required.",
          showConfirmButton: true,
          customClass: {
            confirmButton:
              "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
          },
        });
      }
    }
    if (showMailing) {
      const { street, ward, district, city, country } = mailingAddress;
      if (
        !street.trim() ||
        !ward.trim() ||
        !district.trim() ||
        !city.trim() ||
        !country.trim()
      ) {
        return Swal.fire({
          icon: "error",
          title: "Error!",
          text: "All fields in Mailing Address are required.",
          showConfirmButton: true,
          customClass: {
            confirmButton:
              "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
          },
        });
      }
    }

    // Tạo object cập nhật student. Nếu checkbox ẩn thì loại bỏ các trường địa chỉ đó.
    const updatedStudent = {
      studentId: id,
      fullName,
      birthDate,
      sex,
      nationality,
      faculty,
      schoolYear,
      program,
      email,
      phone,
      status,
      identityDocuments: [identityDocument],
    };

    if (showPermanent) {
      updatedStudent.permanentAddress = permanentAddress;
    } else {
      // xóa trường pernementAddress của selectedStudent
      updatedStudent.permanentAddress = null;
    }

    if (showTemporary) {
      updatedStudent.temporaryAddress = temporaryAddress;
    } else {
      updatedStudent.temporaryAddress = null;
    }
    if (showMailing) {
      updatedStudent.mailingAddress = mailingAddress;
    } else {
      updatedStudent.mailingAddress = null;
    }

    // Validate các trường bắt buộc của Identity Document
    if (
      !identityDocument.type.trim() ||
      !identityDocument.number.trim() ||
      !identityDocument.issueDate ||
      !identityDocument.issuePlace.trim() ||
      !identityDocument.expirationDate
    ) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "All common fields in Identity Document are required.",
        showConfirmButton: true,
        customClass: {
          confirmButton:
            "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
        },
      });
    }

    // Validate các trường bổ sung dựa trên type
    if (identityDocument.type === "CCCD") {
      // Với CCCD, trường hasChip cần có giá trị (chú ý: false là hợp lệ nên không dùng !)
      if (
        identityDocument.hasChip === "" ||
        identityDocument.hasChip === null ||
        identityDocument.hasChip === undefined
      ) {
        return Swal.fire({
          icon: "error",
          title: "Error!",
          text: "The 'Has Chip' field is required for CCCD.",
          showConfirmButton: true,
          customClass: {
            confirmButton:
              "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
          },
        });
      }
    }

    if (identityDocument.type === "passport") {
      if (
        !identityDocument.issueCountry.trim() ||
        !identityDocument.notes.trim()
      ) {
        return Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Issue Country and Notes are required for passport.",
          showConfirmButton: true,
          customClass: {
            confirmButton:
              "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
          },
        });
      }
    }

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
        customClass: {
          confirmButton:
            "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
        },
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message,
        showConfirmButton: true,
        customClass: {
          confirmButton:
            "bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 mr-2",
        },
      });
    }
  };

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg">
      <h1 className="mb-4 text-center text-2xl font-bold text-gray-700">
        Edit Student
      </h1>
      <form
        onSubmit={handleUpdate}
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        {/* PHẦN 1: Basic Information */}
        <div className="space-y-4">
          <h2 className="mb-2 text-xl font-semibold">Basic Information</h2>
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
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
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
                <option key={fac._id} value={fac._id}>
                  {fac.facultyName}
                </option>
              ))}
            </select>
          </div>
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
                <option key={pro._id} value={pro._id}>
                  {pro.programName}
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
              value={status}
              onChange={handleStatusChange}
              className="w-full rounded border p-2"
            >
              <option value="">Select Status</option>
              {statuses.map((st) => (
                <option key={st._id} value={st._id}>
                  {st.statusName}
                </option>
              ))}
            </select>
          </div>
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
          <div>
            <label htmlFor="email" className="block font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border p-2"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block font-medium">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded border p-2"
            />
          </div>
        </div>

        {/* PHẦN 2: Address & Identity */}
        <div className="space-y-4">
          <h2 className="mb-2 text-xl font-semibold">Address & Identity</h2>

          {/* Checkbox điều khiển hiển thị địa chỉ */}
          <div className="space-y-2">
            <div>
              <input
                type="checkbox"
                id="showPermanent"
                checked={showPermanent}
                onChange={() => setShowPermanent((prev) => !prev)}
              />
              <label htmlFor="showPermanent" className="ml-2 font-medium">
                Include Permanent Address
              </label>
            </div>
            {showPermanent && (
              <div className="border p-2">
                <h3 className="mb-2 font-semibold">Permanent Address</h3>
                {["street", "ward", "district", "city", "country"].map(
                  (field) => (
                    <div key={field} className="mb-2">
                      <label className="block font-medium capitalize">
                        {field}
                      </label>
                      <input
                        type="text"
                        placeholder={field}
                        value={permanentAddress[field]}
                        onChange={(e) =>
                          handleAddressChange(e, "permanentAddress", field)
                        }
                        className="w-full border p-2"
                      />
                    </div>
                  )
                )}
              </div>
            )}

            <div>
              <input
                type="checkbox"
                id="showTemporary"
                checked={showTemporary}
                onChange={() => setShowTemporary((prev) => !prev)}
              />
              <label htmlFor="showTemporary" className="ml-2 font-medium">
                Include Temporary Address
              </label>
            </div>
            {showTemporary && (
              <div className="border p-2">
                <h3 className="mb-2 font-semibold">
                  Temporary Address (Optional)
                </h3>
                {["street", "ward", "district", "city", "country"].map(
                  (field) => (
                    <div key={field} className="mb-2">
                      <label className="block font-medium capitalize">
                        {field}
                      </label>
                      <input
                        type="text"
                        placeholder={field}
                        value={temporaryAddress[field]}
                        onChange={(e) =>
                          handleAddressChange(e, "temporaryAddress", field)
                        }
                        className="w-full border p-2"
                      />
                    </div>
                  )
                )}
              </div>
            )}

            <div>
              <input
                type="checkbox"
                id="showMailing"
                checked={showMailing}
                onChange={() => setShowMailing((prev) => !prev)}
              />
              <label htmlFor="showMailing" className="ml-2 font-medium">
                Include Mailing Address
              </label>
            </div>
            {showMailing && (
              <div className="border p-2">
                <h3 className="mb-2 font-semibold">
                  Mailing Address (Optional)
                </h3>
                {["street", "ward", "district", "city", "country"].map(
                  (field) => (
                    <div key={field} className="mb-2">
                      <label className="block font-medium capitalize">
                        {field}
                      </label>
                      <input
                        type="text"
                        placeholder={field}
                        value={mailingAddress[field]}
                        onChange={(e) =>
                          handleAddressChange(e, "mailingAddress", field)
                        }
                        className="w-full border p-2"
                      />
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Identity Document */}
          <div className="border p-2">
            <h3 className="mb-2 font-semibold">Identity Document</h3>
            <div className="mb-2">
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
            <div className="mb-2">
              <label className="block font-medium">Document Number</label>
              <input
                type="text"
                placeholder="Document Number"
                value={identityDocument.number}
                onChange={(e) => handleIdentityDocChange(e, "number")}
                className="w-full border p-2"
              />
            </div>
            <div className="mb-2">
              <label className="block font-medium">Issue Date</label>
              <input
                type="date"
                value={formatDateToInput(identityDocument.issueDate)}
                onChange={(e) => handleIdentityDocChange(e, "issueDate")}
                className="w-full border p-2"
              />
            </div>
            <div className="mb-2">
              <label className="block font-medium">Issue Place</label>
              <input
                type="text"
                placeholder="Issue Place"
                value={identityDocument.issuePlace}
                onChange={(e) => handleIdentityDocChange(e, "issuePlace")}
                className="w-full border p-2"
              />
            </div>
            <div className="mb-2">
              <label className="block font-medium">Expiration Date</label>
              <input
                type="date"
                value={formatDateToInput(identityDocument.expirationDate)}
                onChange={(e) => handleIdentityDocChange(e, "expirationDate")}
                className="w-full border p-2"
              />
            </div>
            {/* Nếu type là CCCD hoặc passport, hiển thị các trường bổ sung */}
            {identityDocument.type === "CCCD" && (
              <div className="mb-2">
                <label className="block font-medium">Has Chip?</label>
                <select
                  value={identityDocument.hasChip}
                  onChange={(e) => handleIdentityDocChange(e, "hasChip")}
                  className="w-full border p-2"
                >
                  <option value="">Select Option</option>
                  <option value={true}>True</option>
                  <option value={false}>False</option>
                </select>
              </div>
            )}
            {identityDocument.type === "passport" && (
              <>
                <div className="mb-2">
                  <label className="block font-medium">Issue Country</label>
                  <input
                    type="text"
                    placeholder="Issue Country"
                    value={identityDocument.issueCountry}
                    onChange={(e) => handleIdentityDocChange(e, "issueCountry")}
                    className="w-full border p-2"
                  />
                </div>
                <div className="mb-2">
                  <label className="block font-medium">Notes</label>
                  <textarea
                    placeholder="Notes"
                    value={identityDocument.notes}
                    onChange={(e) => handleIdentityDocChange(e, "notes")}
                    className="w-full border p-2"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Nút điều khiển */}
        <div className="col-span-1 md:col-span-2">
          <button
            type="submit"
            className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="mt-2 w-full rounded bg-gray-400 p-2 text-white hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edit;
