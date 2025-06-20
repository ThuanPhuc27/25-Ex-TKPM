import StudentStatus, { IStudentStatusDocument } from "../models/studentStatus";
import Student from "../models/student";

export const createStudentStatus = async (
  name: string
): Promise<IStudentStatusDocument> => {
  return await StudentStatus.create({ statusName: name });
};

export const getStudentStatusById = async (
  id: string
): Promise<IStudentStatusDocument | null> => {
  return await StudentStatus.findById(id).exec();
};

export const getAllStudentStatuses = async (): Promise<
  IStudentStatusDocument[]
> => {
  return await StudentStatus.find().exec();
};

export const updateStudentStatus = async (
  id: string,
  newName: string
): Promise<IStudentStatusDocument | null> => {
  return await StudentStatus.findByIdAndUpdate(
    id,
    { statusName: newName },
    { new: true }
  ).exec();
};

export const deleteStudentStatus = async (
  id: string
): Promise<IStudentStatusDocument | null> => {
  // Check if there are any students associated with this student status
  const studentCount = await Student.countDocuments({ status: id }).exec();
  if (studentCount > 0) {
    const currentStatus = await getStudentStatusById(id);
    throw new Error(
      `Cannot delete student status "${currentStatus?.statusName}" because it is referenced by ${studentCount} student(s).`
    );
  }

  return await StudentStatus.findByIdAndDelete(id).exec();
};
