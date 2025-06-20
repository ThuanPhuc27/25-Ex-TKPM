import { Request, Response } from "express";
import * as classRepository from "../repositories/classRepository";
import { http } from "../constants/httpStatusCodes";
import logger from "../logger";
import { IntentionalError } from "@utils/intentionalError";

/**
 * Add a new class.
 */
export const addClassController = async (req: Request, res: Response) => {
  try {
    const classData = req.body;
    const newClass = await classRepository.createClass(classData);
    res.status(http.CREATED).json(newClass);
  } catch (error: any) {
    if (error.name === "MongoServerError" && error.code === 11000) {
      const duplicateKey = Object.keys(error.keyValue)[0];
      res.status(http.BAD_REQUEST).json({
        message: `Class with ${duplicateKey} '${error.keyValue[duplicateKey]}' already existed`,
      });
    } else {
      logger.error(
        `[database]: Error creating class - ${error.message ?? error}`
      );
      res
        .status(http.INTERNAL_SERVER_ERROR)
        .json({ message: `${error.message ?? error}` });
    }
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
      res
        .status(http.NOT_FOUND)
        .json({ message: `Class with id ${classId} not found` });
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
      res.status(http.OK).json({
        message: `Class with id "${classId}" deactivated successfully ?!`,
      });
      return;
    }

    res.status(http.OK).json({
      message: `Class with code "${deletedClass.classCode}" have been deleted successfully`,
    });
  } catch (error: any) {
    if (error instanceof IntentionalError) {
      logger.warn(`[intentional]: ${error.message}`);
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    logger.error(
      `[database]: Error deleting class - ${error.message ?? error}`
    );
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: `${error.message ?? error}` });
  }
};
