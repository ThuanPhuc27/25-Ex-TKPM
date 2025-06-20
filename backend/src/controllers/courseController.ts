import { Request, Response } from "express";
import * as courseRepository from "../repositories/courseRepository";
import { http } from "../constants/httpStatusCodes";
import logger from "../logger";
import { IntentionalError } from "@utils/intentionalError";

/**
 * Add a new course.
 */
export const addCourseController = async (req: Request, res: Response) => {
  try {
    const courseData = req.body;
    const course = await courseRepository.addCourse(courseData);
    res.status(http.CREATED).json(course);
  } catch (error: any) {
    logger.error(
      `[database]: Error creating course - ${error.message ?? error}`
    );
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: `${error.message ?? error}` });
  }
};

/**
 * Get all courses.
 */
export const getAllCoursesController = async (_: Request, res: Response) => {
  try {
    const courses = await courseRepository.getAllCourses();
    res.status(http.OK).json(courses);
  } catch (error: any) {
    logger.error(
      `[database]: Error fetching courses - ${error.message ?? error}`
    );
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: `${error.message ?? error}` });
  }
};

/**
 * Update a course.
 */
export const updateCourseController = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const updateData = req.body;
    const updatedCourse = await courseRepository.updateCourse(
      courseId,
      updateData
    );

    if (!updatedCourse) {
      res
        .status(http.NOT_FOUND)
        .json({ message: `Course with id "${courseId}" not found` });
      return;
    }

    res.status(http.OK).json(updatedCourse);
  } catch (error: any) {
    if (error.name === "MongoServerError" && error.code === 11000) {
      // MongoDB duplicate key error code
      logger.warn(
        `[validation]: Course with id "${req.params.courseId}" already exists`
      );
      res.status(http.BAD_REQUEST).json({
        message: `Course with id "${req.params.courseId}" already existed`,
      });
      return;
    }

    logger.error(
      `[database]: Error updating course - ${error.message ?? error}`
    );
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: `${error.message ?? error}` });
  }
};

/**
 * Delete a course.
 */
export const deleteCourseController = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const deletingCourse = await courseRepository.getCourseById(courseId);
    const deletedCourse = await courseRepository.deleteCourse(courseId);

    if (!deletedCourse) {
      res.status(http.OK).json({
        message: `Course "${deletingCourse?.courseName}" has been deactivated successfully`,
      });
      return;
    }

    res.status(http.OK).json({
      message: `Course "${deletingCourse?.courseName}" has been deleted successfully`,
    });
  } catch (error: any) {
    if (error instanceof IntentionalError) {
      logger.warn(`[intentional]: ${error.message}`);
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    logger.error(
      `[database]: Error deleting course - ${error.message ?? error}`
    );
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: `${error.message ?? error}` });
  }
};
