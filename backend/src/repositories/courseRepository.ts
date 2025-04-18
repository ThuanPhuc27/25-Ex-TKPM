import Course, { ICourseDocument } from "../models/course";

/**
 * Add a new course to the database.
 * @param courseData - The course details to be added.
 * @returns The created course document.
 */
export const addCourse = async (
  courseData: Partial<ICourseDocument>
): Promise<ICourseDocument> => {
  return await Course.create(courseData);
};

/**
 * Retrieve all courses from the database.
 * @returns An array of course documents.
 */
export const getAllCourses = async (): Promise<ICourseDocument[]> => {
  return await Course.find().exec();
};

/**
 * Delete a course from the database.
 * @param courseId - The ID of the course to delete.
 * @returns The deleted course document or null if not found.
 */
export const deleteCourse = async (
  courseId: string
): Promise<ICourseDocument | null> => {
  return await Course.findByIdAndDelete(courseId).exec();
};

/**
 * Update a course in the database.
 * @param courseId - The ID of the course to update.
 * @param updateData - The fields to update.
 * @returns The updated course document or null if not found.
 */
export const updateCourse = async (
  courseId: string,
  updateData: Partial<ICourseDocument>
): Promise<ICourseDocument | null> => {
  return await Course.findByIdAndUpdate(courseId, updateData, {
    new: true,
    runValidators: true,
  }).exec();
};
