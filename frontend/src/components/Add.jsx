import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import config from "../config";
import { getFaculties } from "../utils/getFaculties";
import { getStudentStatuses } from "../utils/getStudentStatuses";
import { getPrograms } from "../utils/getPrograms";

const emailRegex = /^\S+@\S+\.\S+$/;
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
    // Mặc định để Address rỗng (và chỉ hiển thị khi checkbox được tích)
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
    // Thêm các field cho identityDocuments bổ sung nếu cần
    identityDocuments: [
      {
        type: "",
        number: "",
        issueDate: "",
        issuePlace: "",
        expirationDate: "",
        hasChip: false, // chỉ dùng nếu type là CCCD
        issueCountry: "", // chỉ dùng nếu type là passport
        notes: "", // chỉ dùng nếu type là passport
      },
    ],
  });

  const [faculties, setFaculties] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [programs, setPrograms] = useState([]);

  // State để kiểm soát hiển thị các phần Address
  const [showPermanent, setShowPermanent] = useState(false);
  const [showTemporary, setShowTemporary] = useState(false);
  const [showMailing, setShowMailing] = useState(false);

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

  // Xử lý thay đổi cho giấy tờ tùy thân
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
    // Kiểm tra các trường thông tin cơ bản không được trống
    const {
      studentId,
      fullName,
      birthDate,
      sex,
      nationality,
      email,
      phone,
      faculty,
      status,
      program,
      schoolYear,
    } = formData;

    if (
      !studentId.trim() ||
      !fullName.trim() ||
      !birthDate.trim() ||
      !sex.trim() ||
      !nationality.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !faculty.trim() ||
      !status.trim() ||
      !program.trim() ||
      !String(schoolYear).trim()
    ) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Please fill in all required basic fields.",
        showConfirmButton: true,
      });
    }

    if (!emailRegex.test(email) || !phoneRegex.test(phone)) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Invalid email or phone number format.",
        showConfirmButton: true,
      });
    }

    if (students.some((student) => student.studentId === studentId)) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Student ID is duplicate.",
        showConfirmButton: true,
      });
    }

    // Validate address nếu được chọn
    if (showPermanent) {
      const { street, ward, district, city, country } =
        formData.permanentAddress;
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
        });
      }
    }
    if (showTemporary) {
      const { street, ward, district, city, country } =
        formData.temporaryAddress;
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
        });
      }
    }
    if (showMailing) {
      const { street, ward, district, city, country } = formData.mailingAddress;
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
        });
      }
    }

    // Validate các trường Identity Document không được để trống
    const identityDoc = formData.identityDocuments[0];
    if (
      !identityDoc.type.trim() ||
      !identityDoc.number.trim() ||
      !identityDoc.issueDate ||
      !identityDoc.issuePlace.trim() ||
      !identityDoc.expirationDate
    ) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "All fields in Identity Document are required.",
        showConfirmButton: true,
      });
    }

    // Validate các trường bổ sung dựa theo type
    if (identityDoc.type === "CCCD") {
      // Kiểm tra hasChip: nếu giá trị là chuỗi rỗng thì coi như chưa chọn
      if (
        identityDoc.hasChip === "" ||
        identityDoc.hasChip === null ||
        identityDoc.hasChip === undefined
      ) {
        return Swal.fire({
          icon: "error",
          title: "Error!",
          text: "The 'Has Chip' field is required for CCCD.",
          showConfirmButton: true,
        });
      }
    }

    if (identityDoc.type === "passport") {
      if (!identityDoc.issueCountry.trim() || !identityDoc.notes.trim()) {
        return Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Issue Country and Notes are required for passport.",
          showConfirmButton: true,
        });
      }
    }

    try {
      const dataToSend = {
        ...formData,
        schoolYear: Number(formData.schoolYear),
      };
      //.log("data to send", dataToSend);

      if (!showPermanent) delete dataToSend.permanentAddress;
      if (!showTemporary) delete dataToSend.temporaryAddress;
      if (!showMailing) delete dataToSend.mailingAddress;

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
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg">
      <h1 className="mb-4 text-center text-2xl font-bold text-gray-700">
        Add Student
      </h1>
      <form
        onSubmit={handleAdd}
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        {/* PHẦN 1: Basic Information */}
        <div className="space-y-4">
          <h2 className="mb-2 text-xl font-semibold">Basic Information</h2>
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
              {faculties.map((fac) => (
                <option key={fac._id} value={fac._id}>
                  {fac.facultyName}
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
              {statuses.map((st) => (
                <option key={st._id} value={st._id}>
                  {st.statusName}
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
              name="program"
              value={formData.program}
              onChange={handleChange}
              className="w-full border p-2"
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
        </div>

        {/* PHẦN 2: Address & Identity */}
        <div className="space-y-4">
          <h2 className="mb-2 text-xl font-semibold">Address & Identity</h2>

          {/* Checkbox để hiển thị Address */}
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
                        value={formData.permanentAddress[field]}
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
                <h3 className="mb-2 font-semibold">Temporary Address</h3>
                {["street", "ward", "district", "city", "country"].map(
                  (field) => (
                    <div key={field} className="mb-2">
                      <label className="block font-medium capitalize">
                        {field}
                      </label>
                      <input
                        type="text"
                        placeholder={field}
                        value={formData.temporaryAddress[field]}
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
                <h3 className="mb-2 font-semibold">Mailing Address</h3>
                {["street", "ward", "district", "city", "country"].map(
                  (field) => (
                    <div key={field} className="mb-2">
                      <label className="block font-medium capitalize">
                        {field}
                      </label>
                      <input
                        type="text"
                        placeholder={field}
                        value={formData.mailingAddress[field]}
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
            <div className="mb-2">
              <label className="block font-medium">Document Number</label>
              <input
                type="text"
                placeholder="Document Number"
                value={formData.identityDocuments[0].number}
                onChange={(e) => handleIdentityDocChange(e, "number")}
                className="w-full border p-2"
              />
            </div>
            <div className="mb-2">
              <label className="block font-medium">Issue Date</label>
              <input
                type="date"
                value={formData.identityDocuments[0].issueDate}
                onChange={(e) => handleIdentityDocChange(e, "issueDate")}
                className="w-full border p-2"
              />
            </div>
            <div className="mb-2">
              <label className="block font-medium">Issue Place</label>
              <input
                type="text"
                placeholder="Issue Place"
                value={formData.identityDocuments[0].issuePlace}
                onChange={(e) => handleIdentityDocChange(e, "issuePlace")}
                className="w-full border p-2"
              />
            </div>
            <div className="mb-2">
              <label className="block font-medium">Expiration Date</label>
              <input
                type="date"
                value={formData.identityDocuments[0].expirationDate}
                onChange={(e) => handleIdentityDocChange(e, "expirationDate")}
                className="w-full border p-2"
              />
            </div>
            {/* Các trường bổ sung cho identityDocuments */}
            {formData.identityDocuments[0].type === "CCCD" && (
              <div className="mb-2">
                <label className="block font-medium">Has Chip?</label>
                <select
                  value={formData.identityDocuments[0].hasChip}
                  onChange={(e) => handleIdentityDocChange(e, "hasChip")}
                  className="w-full border p-2"
                >
                  <option value="">Select Option</option>
                  <option value={true}>True</option>
                  <option value={false}>False</option>
                </select>
              </div>
            )}
            {formData.identityDocuments[0].type === "passport" && (
              <>
                <div className="mb-2">
                  <label className="block font-medium">Issue Country</label>
                  <input
                    type="text"
                    placeholder="Issue Country"
                    value={formData.identityDocuments[0].issueCountry}
                    onChange={(e) => handleIdentityDocChange(e, "issueCountry")}
                    className="w-full border p-2"
                  />
                </div>
                <div className="mb-2">
                  <label className="block font-medium">Notes</label>
                  <textarea
                    placeholder="Notes"
                    value={formData.identityDocuments[0].notes}
                    onChange={(e) => handleIdentityDocChange(e, "notes")}
                    className="w-full border p-2"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Các nút điều khiển cho toàn bộ form */}
        <div className="col-span-1 md:col-span-2">
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
        </div>
      </form>
    </div>
  );
};

export default Add;
