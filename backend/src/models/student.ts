import { ObjectId } from "mongodb";

class Student {
  _id?: ObjectId;
  studentId: string;
  fullName: string;
  birthDate: Date;
  sex: String;
  faculty: String;
  schoolYear: Number;
  program: String;
  address: String;
  email: String;
  phone: String;
  status: String;

  constructor(
    studentId: string,
    fullName: string,
    birthDate: Date,
    sex: String,
    faculty: String,
    schoolYear: Number,
    program: String,
    address: String,
    email: String,
    phone: String,
    status: String
  ) {
    this.studentId = studentId;
    this.fullName = fullName;
    this.birthDate = new Date(birthDate);
    this.sex = sex;
    this.faculty = faculty;
    this.schoolYear = schoolYear;
    this.program = program;
    this.address = address;
    this.email = email;
    this.phone = phone;
    this.status = status;
  }
}

export { Student };
