import { Request, Response } from "express";
import * as enrollmentRepository from "../repositories/enrollmentRepository";
import { http } from "../constants/httpStatusCodes";
import logger from "../logger";

/**
 * Add a new enrollment.
 */
export const addEnrollmentController = async (req: Request, res: Response) => {
  try {
    const enrollmentData = req.body;
    const enrollment = await enrollmentRepository.addEnrollment(enrollmentData);
    res.status(http.CREATED).json(enrollment);
  } catch (error: any) {
    logger.error(
      `[database]: Error creating enrollment - ${error.message ?? error}`
    );
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: `${error.message ?? error}` });
  }
};

/**
 * Cancel an enrollment.
 */
export const cancelEnrollmentController = async (
  req: Request,
  res: Response
) => {
  try {
    const { enrollmentId } = req.params;
    const { cancellationReason } = req.body;
    const canceledEnrollment = await enrollmentRepository.cancelEnrollment(
      enrollmentId,
      cancellationReason
    );

    if (!canceledEnrollment) {
      res.status(http.NOT_FOUND).json({ message: "Enrollment not found" });
      return;
    }

    res.status(http.OK).json(canceledEnrollment);
  } catch (error: any) {
    logger.error(
      `[database]: Error canceling enrollment - ${error.message ?? error}`
    );
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: `${error.message ?? error}` });
  }
};

/**
 * Get all enrollments.
 */
export const getAllEnrollmentsController = async (
  _: Request,
  res: Response
) => {
  try {
    const enrollments = await enrollmentRepository.getAllEnrollments();
    res.status(http.OK).json(enrollments);
  } catch (error: any) {
    logger.error(
      `[database]: Error fetching enrollments - ${error.message ?? error}`
    );
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: `${error.message ?? error}` });
  }
};

/**
 * Get enrollments by student.
 */
export const getEnrollmentsByStudentController = async (
  req: Request,
  res: Response
) => {
  try {
    const { studentId } = req.params;
    const enrollments = await enrollmentRepository.getEnrollmentsByStudent(
      studentId
    );

    if (!enrollments.length) {
      res
        .status(http.NOT_FOUND)
        .json({ message: "No enrollments found for the student" });
      return;
    }

    res.status(http.OK).json(enrollments);
  } catch (error: any) {
    logger.error(
      `[database]: Error fetching enrollments by student - ${
        error.message ?? error
      }`
    );
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: `${error.message ?? error}` });
  }
};

/**
 * Get enrollments by class.
 */
export const getEnrollmentsByClassController = async (
  req: Request,
  res: Response
) => {
  try {
    const { classCode } = req.params;
    const enrollments = await enrollmentRepository.getEnrollmentsByClass(
      classCode
    );

    if (!enrollments.length) {
      res
        .status(http.NOT_FOUND)
        .json({ message: "No enrollments found for the class" });
      return;
    }

    res.status(http.OK).json(enrollments);
  } catch (error: any) {
    logger.error(
      `[database]: Error fetching enrollments by class - ${
        error.message ?? error
      }`
    );
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: `${error.message ?? error}` });
  }
};
