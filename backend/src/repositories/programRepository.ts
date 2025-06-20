import Student from "@models/student";
import Program, { IProgramDocument } from "../models/program";

export const createProgram = async (
  name: string
): Promise<IProgramDocument> => {
  return await Program.create({ programName: name });
};

export const getProgramById = async (
  id: string
): Promise<IProgramDocument | null> => {
  return await Program.findById(id).exec();
};

export const getAllPrograms = async (): Promise<IProgramDocument[]> => {
  return await Program.find().exec();
};

export const updateProgram = async (
  id: string,
  newName: string
): Promise<IProgramDocument | null> => {
  return await Program.findByIdAndUpdate(
    id,
    { programName: newName },
    { new: true }
  ).exec();
};

export const deleteProgram = async (
  id: string
): Promise<IProgramDocument | null> => {
  // Check if there are any students associated with this program
  const studentCount = await Student.countDocuments({ program: id }).exec();
  if (studentCount > 0) {
    const currentProgram = await getProgramById(id);
    throw new Error(
      `Cannot delete program "${currentProgram?.programName}" because it is referenced by ${studentCount} student(s).`
    );
  }

  return await Program.findByIdAndDelete(id).exec();
};
