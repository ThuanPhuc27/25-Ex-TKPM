const Sex = Object.freeze({
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other',
})

const Program = Object.freeze({
  UNDERGRADUATE: 'Undergraduate',
  MASTER: 'Master',
  DOCTORAL: 'Doctoral',
})

const StudentStatus = Object.freeze({
  ACTIVE: 'Active',
  GRADUATED: 'Graduated',
  DROPPED_OUT: 'Dropped Out',
  PAUSED: 'Paused',
})

const Faculties = Object.freeze({
  LAW: 'Faculty of Law',
  BUSINESS_ENGLISH: 'Faculty of Business English',
  JAPANESE: 'Faculty of Japanese',
  FRENCH: 'Faculty of French',
})

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
    this.birthDate = new Date(birthDate)
    this.sex = sex
    this.faculty = faculty
    this.schoolYear = schoolYear
    this.program = program
    this.address = address
    this.email = email
    this.phone = phone
    this.status = status
  }

  static from(obj) {
    return new Student(
      obj.studentId.toString(),
      obj.fullName,
      new Date(obj.birthDate),
      obj.sex,
      obj.faculty,
      obj.schoolYear,
      obj.program,
      obj.address,
      obj.email,
      obj.phone,
      obj.status
    );
  }

  getInfo() {
    return `ID: ${this.studentId}, Name: ${this.fullName}, Faculty: ${this.faculty}, Status: ${this.status}`
  }

  getAge() {
    const today = new Date()
    let age = today.getFullYear() - this.birthDate.getFullYear()
    const monthDiff = today.getMonth() - this.birthDate.getMonth()
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < this.birthDate.getDate())
    ) {
      age--
    }
    return age
  }

  updateStatus(newStatus) {
    if (!Object.values(StudentStatus).includes(newStatus)) {
      throw new Error('Invalid status')
    }
    this.status = newStatus
  }
}

// Danh sách 10 sinh viên
const Students_data = [
  new Student(
    22120300,
    'John Doe',
    '2000-01-01',
    Sex.MALE,
    Faculties.LAW,
    2021,
    Program.UNDERGRADUATE,
    '123 Main St',
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
    '456 Oak Ave',
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
    '789 Pine Rd',
    'alex.taylor@example.com',
    '555-123-4567',
    StudentStatus.DROPPED_OUT,
  ),
  new Student(
    22120303,
    'Emily Johnson',
    '2000-03-10',
    Sex.FEMALE,
    Faculties.FRENCH,
    2021,
    Program.UNDERGRADUATE,
    '321 Elm St',
    'emily.johnson@example.com',
    '111-222-3333',
    StudentStatus.ACTIVE,
  ),
  new Student(
    22120304,
    'Michael Brown',
    '1998-07-08',
    Sex.MALE,
    Faculties.LAW,
    2019,
    Program.DOCTORAL,
    '567 Birch Ave',
    'michael.brown@example.com',
    '444-555-6666',
    StudentStatus.GRADUATED,
  ),
  new Student(
    22120305,
    'Sarah Wilson',
    '1997-11-25',
    Sex.FEMALE,
    Faculties.BUSINESS_ENGLISH,
    2018,
    Program.MASTER,
    '789 Maple Dr',
    'sarah.wilson@example.com',
    '777-888-9999',
    StudentStatus.DROPPED_OUT,
  ),
  new Student(
    22120306,
    'David Martinez',
    '2002-04-14',
    Sex.MALE,
    Faculties.JAPANESE,
    2023,
    Program.UNDERGRADUATE,
    '123 Cedar Ln',
    'david.martinez@example.com',
    '333-444-5555',
    StudentStatus.ACTIVE,
  ),
  new Student(
    22120307,
    'Sophia Anderson',
    '2001-12-30',
    Sex.FEMALE,
    Faculties.FRENCH,
    2022,
    Program.UNDERGRADUATE,
    '456 Willow Rd',
    'sophia.anderson@example.com',
    '666-777-8888',
    StudentStatus.PAUSED,
  ),
  new Student(
    22120308,
    'James Thomas',
    '1999-09-18',
    Sex.MALE,
    Faculties.LAW,
    2020,
    Program.MASTER,
    '789 Spruce St',
    'james.thomas@example.com',
    '999-000-1111',
    StudentStatus.ACTIVE,
  ),
  new Student(
    22120309,
    'Olivia Garcia',
    '2003-06-05',
    Sex.FEMALE,
    Faculties.BUSINESS_ENGLISH,
    2024,
    Program.UNDERGRADUATE,
    '321 Oak Ct',
    'olivia.garcia@example.com',
    '222-333-4444',
    StudentStatus.ACTIVE,
  ),
]

// In danh sách sinh viên
Students_data.forEach((student) => console.log(student.getInfo()))

export { Student, Students_data }
