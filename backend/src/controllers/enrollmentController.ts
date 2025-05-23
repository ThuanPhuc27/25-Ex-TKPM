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
 * Update enrollment score.
 */
export const updateEnrollmentScoreController = async (
  req: Request,
  res: Response
) => {
  try {
    const { enrollmentId } = req.params;
    const { score } = req.body;

    if (score < 0 || score > 10) {
      res
        .status(http.BAD_REQUEST)
        .json({ message: "Score must be between 0 and 10" });
      return;
    }

    const updatedEnrollment = await enrollmentRepository.updateEnrollmentScore(
      enrollmentId,
      score
    );

    if (!updatedEnrollment) {
      res.status(http.NOT_FOUND).json({ message: "Enrollment not found" });
      return;
    }

    res.status(http.OK).json(updatedEnrollment);
  } catch (error: any) {
    logger.error(
      `[database]: Error updating enrollment score - ${error.message ?? error}`
    );
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: `${error.message ?? error}` });
  }
};

/**
 * Get student scoreboard.
 */
export const getScoreboardByStudentController = async (
  req: Request,
  res: Response
) => {
  try {
    const { studentId } = req.params;

    const enrollments = await enrollmentRepository.getStudentScoreboard(
      studentId
    );

    if (!enrollments.length) {
      res
        .status(http.NOT_FOUND)
        .json({ message: "No enrollments found for the student" });
      return;
    }

    const scoreboard = enrollments.map((enrollment) => ({
      classCode: enrollment.classCode,
      score: enrollment.score,
    }));

    res.status(http.OK).json(scoreboard);
  } catch (error: any) {
    logger.error(
      `[database]: Error fetching scoreboard - ${error.message ?? error}`
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
