import Student, { IStudent, IStudentWithId } from "@models/student";

export const createStudent = async (
  studentData: IStudent
): Promise<IStudent> => {
  const student = new Student(studentData);
  return await student.save();
};

export const getStudentById = async (
  studentId: string
): Promise<IStudent | null> => {
  return await Student.findOne({ studentId }).exec();
};

export const getAllStudents = async (): Promise<IStudent[]> => {
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
  }).exec();
};

export const deleteStudentById = async (
  studentId: string
): Promise<IStudent | null> => {
  return await Student.findOneAndDelete({ studentId }).exec();
};

export const importStudent = async (
  student: IStudent
): Promise<IStudentWithId | null> => {
  const existingStudent = await Student.findOneAndUpdate(
    { studentId: student.studentId },
    student,
    {
      upsert: true,
      returnDocument: "before",
      runValidators: true,
    }
  ).exec();
  return existingStudent;
};

// Why `.exec()`?: [https://mongoosejs.com/docs/promises.html#should-you-use-exec-with-await]
