import Faculty, { IFacultyDocument } from "../models/faculty";

export const createFaculty = async (
  name: string,
  code: string
): Promise<IFacultyDocument> => {
  return await Faculty.create({ name, code });
};

export const getAllFaculties = async (): Promise<IFacultyDocument[]> => {
  return await Faculty.find().exec();
};

export const updateFaculty = async (
  id: string,
  name: string,
  code: string
): Promise<IFacultyDocument | null> => {
  return await Faculty.findByIdAndUpdate(
    id,
    { name, code },
    { new: true }
  ).exec();
};

export const deleteFaculty = async (
  id: string
): Promise<IFacultyDocument | null> => {
  return await Faculty.findByIdAndDelete(id).exec();
};

export const getFacultyByCode = async (code: string) => {
  return await Faculty.findOne({ code }).exec(); // Find faculty by code
};
