import Class, { IClassDocument } from "../models/class";

/**
 * Create a new class.
 * @param classData - The class details to be added.
 * @returns The created class document.
 */
export const createClass = async (
  classData: Partial<IClassDocument>
): Promise<IClassDocument> => {
  return await Class.create(classData);
};

/**
 * Get all classes in the database.
 * @returns An array of class documents.
 */
export const getAllClasses = async (): Promise<IClassDocument[]> => {
  return await Class.find().exec();
};

/**
 * Update a class in the database.
 * @param classId - The ID of the class to update.
 * @param updateData - The fields to update.
 * @returns The updated class document or null if not found.
 */
export const updateClass = async (
  classId: string,
  updateData: Partial<IClassDocument>
): Promise<IClassDocument | null> => {
  return await Class.findByIdAndUpdate(classId, updateData, {
    new: true,
  }).exec();
};

/**
 * Delete a class from the database.
 * @param classId - The ID of the class to delete.
 * @returns The deleted class document or null if not found.
 */
export const deleteClass = async (
  classId: string
): Promise<IClassDocument | null> => {
  return await Class.findByIdAndDelete(classId).exec();
};
