import { Request, Response } from "express";
import {
  createStudentStatus,
  getAllStudentStatuses,
  updateStudentStatus,
  deleteStudentStatus,
} from "../repositories/studentStatusRepository";
import { http } from "../constants/httpStatusCodes";

export const addStudentStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(http.BAD_REQUEST).json({ message: "Name is required" });
    }

    const newStudentStatus = await createStudentStatus(name);
    res.status(http.CREATED).json(newStudentStatus);
  } catch (error) {
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: "Error creating student status" });
  }
};

export const getAllStudentStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const studentStatuses = await getAllStudentStatuses();
    res.status(http.OK).json(studentStatuses);
  } catch (error) {
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching student statuses" });
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
    }

    const updatedStudentStatus = await updateStudentStatus(statusId, name);
    if (!updatedStudentStatus) {
      res.status(http.NOT_FOUND).json({ message: "Student status not found" });
    }
    res.status(http.OK).json(updatedStudentStatus);
  } catch (error) {
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: "Error updating student status" });
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
    }
    res.status(http.OK).json({ message: "Student status deleted" });
  } catch (error) {
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: "Error deleting student status" });
  }
};
