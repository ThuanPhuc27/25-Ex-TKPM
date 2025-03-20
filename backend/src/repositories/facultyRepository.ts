import Faculty, { IFaculty } from '../models/faculty';

export const createFaculty = async (name: string, code: string): Promise<IFaculty> => {
    return await Faculty.create({ name, code });
};

export const getAllFaculties = async (): Promise<IFaculty[]> => {
    return await Faculty.find();
};

export const updateFaculty = async (id: string, name: string, code: string): Promise<IFaculty | null> => {
    return await Faculty.findByIdAndUpdate(id, { name, code }, { new: true });
};

export const deleteFaculty = async (id: string): Promise<IFaculty | null> => {
    return await Faculty.findByIdAndDelete(id);
};
