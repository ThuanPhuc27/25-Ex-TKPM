import Student, { IStudent } from '../models/Student';

export const createStudent = async (studentData: IStudent): Promise<IStudent> => {
  const student = new Student(studentData);
  return await student.save();
};

export const getStudentById = async (studentId: string): Promise<IStudent | null> => {
  return await Student.findOne({ studentId });
};

export const getAllStudents = async (): Promise<IStudent[]> => {
  return await Student.find();
};

export const updateStudent = async (id: string, updateData: Partial<IStudent>): Promise<IStudent | null> => {
  return await Student.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

export const deleteStudent = async (id: string): Promise<IStudent | null> => {
  return await Student.findByIdAndDelete(id);
};
