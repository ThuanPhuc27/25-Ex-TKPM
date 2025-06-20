import Student from "@models/student";
import Faculty, { IFacultyDocument } from "../models/faculty";

export const createFaculty = async (
  name: string
): Promise<IFacultyDocument> => {
  return await Faculty.create({ facultyName: name });
};

export const getFacultyById = async (
  id: string
): Promise<IFacultyDocument | null> => {
  return await Faculty.findById(id).exec();
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
  // Check if there are any students associated with this faculty
  const studentCount = await Student.countDocuments({ faculty: id }).exec();
  if (studentCount > 0) {
    const currentFaculty = await getFacultyById(id);
    throw new Error(
      `Cannot delete faculty "${currentFaculty?.facultyName}" because it is referenced by ${studentCount} student(s).`
    );
  }

  return await Faculty.findByIdAndDelete(id).exec();
};
