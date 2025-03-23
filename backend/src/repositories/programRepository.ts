import Program, { IProgramDocument } from "../models/program";

export const createProgram = async (
  name: string
): Promise<IProgramDocument> => {
  return await Program.create({ programName: name });
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
  return await Program.findByIdAndDelete(id).exec();
};
