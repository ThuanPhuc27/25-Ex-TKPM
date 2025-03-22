import StudentStatus, { IStudentStatusDocument } from "../models/studentStatus";

export const createStudentStatus = async (
  name: string
): Promise<IStudentStatusDocument> => {
  return await StudentStatus.create({ name });
};

export const getAllStudentStatuses = async (): Promise<
  IStudentStatusDocument[]
> => {
  return await StudentStatus.find().exec();
};

export const updateStudentStatus = async (
  id: string,
  name: string
): Promise<IStudentStatusDocument | null> => {
  return await StudentStatus.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  ).exec();
};

export const deleteStudentStatus = async (
  id: string
): Promise<IStudentStatusDocument | null> => {
  return await StudentStatus.findByIdAndDelete(id).exec();
};
