import { ObjectId } from "mongodb";

class Student {
  _id?: ObjectId;
  studentId: string;
  fullName: string;
  birthDate: Date;
  sex: string;
  faculty: string;
  schoolYear: number;
  program: string;
  address: string;
  email: string;
  phone: string;
  status: string;

  constructor(
    studentId?: string | null,
    fullName?: string | null,
    birthDate?: Date | null,
    sex?: string | null,
    faculty?: string | null,
    schoolYear?: number | null,
    program?: string | null,
    address?: string | null,
    email?: string | null,
    phone?: string | null,
    status?: string | null
  ) {
    this.studentId = studentId || "";
    this.fullName = fullName || "";
    this.birthDate = birthDate ? new Date(birthDate) : new Date();
    this.sex = sex || "other";
    this.faculty = faculty || "";
    this.schoolYear = schoolYear || 1900;
    this.program = program || "";
    this.address = address || "";
    this.email = email || "";
    this.phone = phone || "";
    this.status = status || "active";
  }

  static from(student: Student) {
    let newly_created_student = new Student(
      student.studentId,
      student.fullName,
      student.birthDate,
      student.sex,
      student.faculty,
      student.schoolYear,
      student.program,
      student.address,
      student.email,
      student.phone,
      student.status
    );
    newly_created_student._id = student._id;
    return newly_created_student;
  }

  update(
    studentId?: string | null,
    fullName?: string | null,
    birthDate?: Date | null,
    sex?: string | null,
    faculty?: string | null,
    schoolYear?: number | null,
    program?: string | null,
    address?: string | null,
    email?: string | null,
    phone?: string | null,
    status?: string | null
  ) {
    if (studentId) this.studentId = studentId;
    if (fullName) this.fullName = fullName;
    if (birthDate) this.birthDate = new Date(birthDate);
    if (sex) this.sex = sex;
    if (faculty) this.faculty = faculty;
    if (schoolYear) this.schoolYear = schoolYear;
    if (program) this.program = program;
    if (address) this.address = address;
    if (email) this.email = email;
    if (phone) this.phone = phone;
    if (status) this.status = status;
    return this;
  }
}

export { Student };
