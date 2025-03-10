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
}

// Tạo dữ liệu sinh viên
const Students_data = [
  {
    student_id: 'S001',
    full_name: 'John Doe',
    birth_date: '2000-01-01', // Naive date format (YYYY-MM-DD)
    sex: Sex.MALE,
    faculty: 'Faculty of Computer Science',
    school_year: 2021,
    program: Program.UNDERGRADUATE,
    address: '123 Main Street, City, Country',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    status: StudentStatus.ACTIVE,
  },
  {
    student_id: 'S002',
    full_name: 'Jane Smith',
    birth_date: '1999-05-15',
    sex: Sex.FEMALE,
    faculty: 'Faculty of Engineering',
    school_year: 2020,
    program: Program.MASTER,
    address: '456 Oak Avenue, City, Country',
    email: 'jane.smith@example.com',
    phone: '987-654-3210',
    status: StudentStatus.GRADUATED,
  },
  {
    student_id: 'S003',
    full_name: 'Alex Taylor',
    birth_date: '2001-10-22',
    sex: Sex.OTHER,
    faculty: 'Faculty of Business',
    school_year: 2022,
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
