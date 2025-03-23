import { Request, Response } from "express";
import {
  createStudentStatus,
  getAllStudentStatuses,
  updateStudentStatus,
  deleteStudentStatus,
} from "../repositories/studentStatusRepository";
import { http } from "../constants/httpStatusCodes";
import logger from "../logger";

export const addStudentStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(http.BAD_REQUEST).json({ message: "Name is required" });
      return;
    }

    const newStudentStatus = await createStudentStatus(name);
    res.status(http.CREATED).json(newStudentStatus);
  } catch (error: any) {
    logger.error(
      `[database]: Error creating student status - ${error.message ?? error}`
    );
    res.status(http.INTERNAL_SERVER_ERROR).json({
      message: `${error.message ?? error}`,
    });
  }
};

export const getAllStudentStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const studentStatuses = await getAllStudentStatuses();
    res.status(http.OK).json(studentStatuses);
  } catch (error: any) {
    logger.error(
      `[database]: Error fetching student statuses - ${error.message ?? error}`
    );
    res.status(http.INTERNAL_SERVER_ERROR).json({
      message: `${error.message ?? error}`,
    });
  }
};

export const editStudentStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const { statusId } = req.params;
    const { name } = req.body;
    if (!name) {
      res.status(http.BAD_REQUEST).json({ message: "Name is required" });
      return;
    }

    const updatedStudentStatus = await updateStudentStatus(statusId, name);
    if (!updatedStudentStatus) {
      res.status(http.NOT_FOUND).json({ message: "Student status not found" });
      return;
    }
    res.status(http.OK).json(updatedStudentStatus);
  } catch (error: any) {
    logger.error(
      `[database]: Error updating student status - ${error.message ?? error}`
    );
    res.status(http.INTERNAL_SERVER_ERROR).json({
      message: `${error.message ?? error}`,
    });
  }
};

export const deleteStudentStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const { statusId } = req.params;

    const deletedStudentStatus = await deleteStudentStatus(statusId);
    if (!deletedStudentStatus) {
      res.status(http.NOT_FOUND).json({ message: "Student status not found" });
      return;
    }
    res.status(http.OK).json({ message: "Student status deleted" });
  } catch (error: any) {
    logger.error(
      `[database]: Error deleting student status - ${error.message ?? error}`
    );
    res.status(http.INTERNAL_SERVER_ERROR).json({
      message: `${error.message ?? error}`,
    });
  }
};
