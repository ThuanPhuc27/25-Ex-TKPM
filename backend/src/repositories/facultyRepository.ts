import Faculty, { IFacultyDocument } from "../models/faculty";

export const createFaculty = async (
  name: string
): Promise<IFacultyDocument> => {
  return await Faculty.create({ facultyName: name });
};

export const getAllFaculties = async (): Promise<IFacultyDocument[]> => {
  return await Faculty.find().exec();
};

export const updateFaculty = async (
  id: string,
  newName: string
): Promise<IFacultyDocument | null> => {
  return await Faculty.findByIdAndUpdate(
    id,
    { facultyName: newName },
    { new: true }
  ).exec();
};

export const deleteFaculty = async (
  id: string
): Promise<IFacultyDocument | null> => {
  return await Faculty.findByIdAndDelete(id).exec();
};
