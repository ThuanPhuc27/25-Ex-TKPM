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

// Tạo dữ liệu sinh viên
const Students_data = [
  {
    studentId: 22120300,
    fullName: 'John Doe',
    birthDate: '2000-01-01', // Naive date format (YYYY-MM-DD)
    sex: Sex.MALE,
    faculty: Faculties.LAW,
    schoolYear: 2021,
    program: Program.UNDERGRADUATE,
    address: '123 Main Street, City, Country',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    status: StudentStatus.ACTIVE,
  },
  {
    studentId: 22120301,
    fullName: 'Jane Smith',
    birthDate: '1999-05-15',
    sex: Sex.FEMALE,
    faculty: Faculties.BUSINESS_ENGLISH,
    schoolYear: 2020,
    program: Program.MASTER,
    address: '456 Oak Avenue, City, Country',
    email: 'jane.smith@example.com',
    phone: '987-654-3210',
    status: StudentStatus.GRADUATED,
  },
  {
    studentId: 22120302,
    fullName: 'Alex Taylor',
    birthDate: '2001-10-22',
    sex: Sex.OTHER,
    faculty: Faculties.JAPANESE,
    schoolYear: 2022,
    program: Program.UNDERGRADUATE,
    address: '789 Pine Road, City, Country',
    email: 'alex.taylor@example.com',
    phone: '555-123-4567',
    status: StudentStatus.DROPPED_OUT,
  },
  {
    studentId: 22120303,
    fullName: 'John Doe',
    birthDate: '2000-01-01', // Naive date format (YYYY-MM-DD)
    sex: Sex.MALE,
    faculty: Faculties.LAW,
    schoolYear: 2021,
    program: Program.UNDERGRADUATE,
    address: '123 Main Street, City, Country',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    status: StudentStatus.ACTIVE,
  },
  {
    studentId: 221203004,
    fullName: 'Jane Smith',
    birthDate: '1999-05-15',
    sex: Sex.FEMALE,
    faculty: Faculties.BUSINESS_ENGLISH,
    schoolYear: 2020,
    program: Program.MASTER,
    address: '456 Oak Avenue, City, Country',
    email: 'jane.smith@example.com',
    phone: '987-654-3210',
    status: StudentStatus.GRADUATED,
  },
  {
    studentId: 22120305,
    fullName: 'Alex Taylor',
    birthDate: '2001-10-22',
    sex: Sex.OTHER,
    faculty: Faculties.JAPANESE,
    schoolYear: 2022,
    program: Program.UNDERGRADUATE,
    address: '789 Pine Road, City, Country',
    email: 'alex.taylor@example.com',
    phone: '555-123-4567',
    status: StudentStatus.DROPPED_OUT,
  },
  // Bạn có thể thêm nhiều đối tượng sinh viên ở đây
]

// In ra dữ liệu sinh viên trong console
console.log(Students_data)

export { Students_data } // Xuất dữ liệu sinh viên để sử dụng ở nơi khác nếu cần
