import Student, { IStudent, IStudentWithId } from "@models/student";

export const createStudent = async (
  studentData: IStudent
): Promise<IStudent> => {
  const student = new Student(studentData);
  return await student.save();
};

export const createStudents = async (
  studentsData: IStudent[]
): Promise<IStudent[]> => {
  const students = await Student.insertMany(studentsData);
  return students;
};

export const getStudentById = async (
  studentId: string
): Promise<IStudent | null> => {
  return await Student.findOne({ studentId }).exec();
};

export const getAllStudents = async (): Promise<IStudentWithId[]> => {
  return await Student.find().exec();
};

export const updateStudentById = async (
  studentId: string,
  updateData: Partial<IStudent>
): Promise<IStudent | null> => {
  return await Student.findOneAndUpdate({ studentId }, updateData, {
    returnDocument: "after",
    new: true,
    runValidators: true,
  });
};

export const deleteStudentById = async (
  studentId: string
): Promise<IStudent | null> => {
  return await Student.findOneAndDelete({ studentId }).exec();
};
