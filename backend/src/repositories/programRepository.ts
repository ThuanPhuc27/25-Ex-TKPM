import Program, { IProgram } from '../models/program';

export const createProgram = async (name: string, code: string): Promise<IProgram> => {
    return await Program.create({ name, code });
};

export const getAllPrograms = async (): Promise<IProgram[]> => {
    return await Program.find();
};

export const updateProgram = async (id: string, name: string, code: string): Promise<IProgram | null> => {
    return await Program.findByIdAndUpdate(id, { name, code }, { new: true });
};

export const deleteProgram = async (id: string): Promise<IProgram | null> => {
    return await Program.findByIdAndDelete(id);
};

export const getProgramByCode = async (code: string) => {
    return await Program.findOne({ code }); 
};