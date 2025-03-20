import StudentStatus, { IStudentStatus } from '../models/studentStatus';

export const createStudentStatus = async (name: string): Promise<IStudentStatus> => {
    return await StudentStatus.create({ name });
};

export const getAllStudentStatuses = async (): Promise<IStudentStatus[]> => {
    return await StudentStatus.find();
};

export const updateStudentStatus = async (id: string, name: string): Promise<IStudentStatus | null> => {
    return await StudentStatus.findByIdAndUpdate(id, { name }, { new: true });
};

export const deleteStudentStatus = async (id: string): Promise<IStudentStatus | null> => {
    return await StudentStatus.findByIdAndDelete(id);
};
