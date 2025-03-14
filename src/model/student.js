// Định nghĩa Enum cho các trường
const Sex = {
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other',
}

const Program = {
  UNDERGRADUATE: 'Undergraduate',
  MASTER: 'Master',
  DOCTORAL: 'Doctoral',
}

const StudentStatus = {
  ACTIVE: 'Active',
  GRADUATED: 'Graduated',
  DROPPED_OUT: 'Dropped Out',
  PAUSED: 'Paused',
}

const Faculties = {
  LAW: 'Faculty of Law',
  BUSINESS_ENGLISH: 'Faculty of Business English',
  JAPANESE: 'Faculty of Japanese',
  FRENCH: 'Faculty of French',
}

// Định nghĩa class Student
class Student {
  constructor(
    studentId,
    fullName,
    birthDate,
    sex,
    faculty,
    schoolYear,
    program,
    address,
    email,
    phone,
    status,
  ) {
    this.studentId = studentId
    this.fullName = fullName
    this.birthDate = birthDate
    this.sex = sex
    this.faculty = faculty
    this.schoolYear = schoolYear
    this.program = program
    this.address = address
    this.email = email
    this.phone = phone
    this.status = status
  }

  // Phương thức lấy thông tin sinh viên
  getInfo() {
    return `ID: ${this.studentId}, Name: ${this.fullName}, Faculty: ${this.faculty}, Status: ${this.status}`
  }
}

// Tạo danh sách sinh viên
const Students_data = [
  new Student(
    22120300,
    'John Doe',
    '2000-01-01',
    Sex.MALE,
    Faculties.LAW,
    2021,
    Program.UNDERGRADUATE,
    '123 Main Street, City, Country',
    'john.doe@example.com',
    '123-456-7890',
    StudentStatus.ACTIVE,
  ),
  new Student(
    22120301,
    'Jane Smith',
    '1999-05-15',
    Sex.FEMALE,
    Faculties.BUSINESS_ENGLISH,
    2020,
    Program.MASTER,
    '456 Oak Avenue, City, Country',
    'jane.smith@example.com',
    '987-654-3210',
    StudentStatus.GRADUATED,
  ),
  new Student(
    22120302,
    'Alex Taylor',
    '2001-10-22',
    Sex.OTHER,
    Faculties.JAPANESE,
    2022,
    Program.UNDERGRADUATE,
    '789 Pine Road, City, Country',
    'alex.taylor@example.com',
    '555-123-4567',
    StudentStatus.DROPPED_OUT,
  ),
]

// In danh sách sinh viên
Students_data.forEach((student) => console.log(student.getInfo()))

export { Students_data }
