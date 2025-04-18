import { Request, Response } from "express";
import * as classRepository from "../repositories/classRepository";
import { http } from "../constants/httpStatusCodes";
import logger from "../logger";

/**
 * Add a new class.
 */
export const addClassController = async (req: Request, res: Response) => {
  try {
    const classData = req.body;
    const newClass = await classRepository.createClass(classData);
    res.status(http.CREATED).json(newClass);
  } catch (error: any) {
    logger.error(
      `[database]: Error creating class - ${error.message ?? error}`
    );
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: `${error.message ?? error}` });
  }
};

/**
 * Get all classes.
 */
export const getAllClassesController = async (_: Request, res: Response) => {
  try {
    const classes = await classRepository.getAllClasses();
    res.status(http.OK).json(classes);
  } catch (error: any) {
    logger.error(
      `[database]: Error fetching classes - ${error.message ?? error}`
    );
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: `${error.message ?? error}` });
  }
};

/**
 * Update a class.
 */
export const updateClassController = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;
    const updateData = req.body;
    const updatedClass = await classRepository.updateClass(classId, updateData);

    if (!updatedClass) {
      res.status(http.NOT_FOUND).json({ message: "Class not found" });
      return;
    }

    res.status(http.OK).json(updatedClass);
  } catch (error: any) {
    logger.error(
      `[database]: Error updating class - ${error.message ?? error}`
    );
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: `${error.message ?? error}` });
  }
};

/**
 * Delete a class.
 */
export const deleteClassController = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;
    const deletedClass = await classRepository.deleteClass(classId);

    if (!deletedClass) {
      res.status(http.OK).json({ message: "Class deactivated successfully" });
      return;
    }

    res.status(http.OK).json({ message: "Class deleted successfully" });
  } catch (error: any) {
    logger.error(
      `[database]: Error deleting class - ${error.message ?? error}`
    );
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: `${error.message ?? error}` });
  }
};
