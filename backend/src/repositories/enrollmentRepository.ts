import Enrollment, { IEnrollmentDocument } from "../models/enrollment";

/**
 * Add a new enrollment for a student in a class.
 * @param enrollmentData - The enrollment details to be added.
 * @returns The created enrollment document.
 */
export const addEnrollment = async (
  enrollmentData: Partial<IEnrollmentDocument>
): Promise<IEnrollmentDocument> => {
  return await Enrollment.create(enrollmentData);
};

/**
 * Cancel an enrollment for a student in a class.
 * @param enrollmentId - The ID of the enrollment to cancel.
 * @param cancellationReason - The reason for canceling the enrollment (optional).
 * @returns The updated enrollment document or null if not found.
 */
export const cancelEnrollment = async (
  enrollmentId: string,
  cancellationReason?: string
): Promise<IEnrollmentDocument | null> => {
  return await Enrollment.findByIdAndUpdate(
    enrollmentId,
    { isCanceled: true, ...(cancellationReason && { cancellationReason }) },
    { new: true }
  ).exec();
};

/**
 * Get all enrollments in the database.
 * @returns An array of enrollment documents.
 */
export const getAllEnrollments = async (): Promise<IEnrollmentDocument[]> => {
  return await Enrollment.find().exec();
};

/**
 * Get all enrollments for a specific student.
 * @param studentId - The ID of the student.
 * @returns An array of enrollment documents for the student.
 */
export const getEnrollmentsByStudent = async (
  studentId: string
): Promise<IEnrollmentDocument[]> => {
  return await Enrollment.find({ studentId }).exec();
};

/**
 * Get all enrollments for a specific class.
 * @param classCode - The code of the class.
 * @returns An array of enrollment documents for the class.
 */
export const getEnrollmentsByClass = async (
  classCode: string
): Promise<IEnrollmentDocument[]> => {
  return await Enrollment.find({ classCode }).exec();
};
