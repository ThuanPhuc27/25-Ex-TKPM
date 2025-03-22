import Program, { IProgramDocument } from "../models/program";

export const createProgram = async (
  name: string,
  code: string
): Promise<IProgramDocument> => {
  return await Program.create({ name, code });
};

export const getAllPrograms = async (): Promise<IProgramDocument[]> => {
  return await Program.find().exec();
};

export const updateProgram = async (
  id: string,
  name: string,
  code: string
): Promise<IProgramDocument | null> => {
  return await Program.findByIdAndUpdate(
    id,
    { name, code },
    { new: true }
  ).exec();
};

export const deleteProgram = async (
  id: string
): Promise<IProgramDocument | null> => {
  return await Program.findByIdAndDelete(id).exec();
};

export const getProgramByCode = async (code: string) => {
  return await Program.findOne({ code }).exec();
};
