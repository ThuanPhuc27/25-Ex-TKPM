import { Request, Response } from "express";
import * as facultyRepository from "../repositories/facultyRepository";
import { http } from "../constants/httpStatusCodes";
import logger from "../logger";

export const addFacultyController = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const faculty = await facultyRepository.createFaculty(name);
    res.status(http.CREATED).json(faculty);
  } catch (error: any) {
    logger.error(
      `[database]: Error creating faculty - ${error.message ?? error}`
    );
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: `Error creating faculty - ${error.message ?? error}` });
  }
};

export const getAllFacultiesController = async (_: Request, res: Response) => {
  try {
    const faculties = await facultyRepository.getAllFaculties();
    res.status(http.OK).json(faculties);
  } catch (error: any) {
    logger.error(
      `[database]: Error fetching faculties - ${error.message ?? error}`
    );
    res.status(http.INTERNAL_SERVER_ERROR).json({
      message: `Error fetching faculties - ${error.message ?? error}`,
    });
  }
};

export const updateFacultyController = async (req: Request, res: Response) => {
  try {
    const { facultyId } = req.params;
    const { name } = req.body;
    const updatedFaculty = await facultyRepository.updateFaculty(
      facultyId,
      name
    );

    if (!updatedFaculty) {
      res.status(http.NOT_FOUND).json({ message: "Faculty not found" });
      return;
    }

    res.status(http.OK).json(updatedFaculty);
  } catch (error: any) {
    logger.error(
      `[database]: Error updating faculty - ${error.message ?? error}`
    );
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: `Error updating faculty - ${error.message ?? error}` });
  }
};

export const deleteFacultyController = async (req: Request, res: Response) => {
  try {
    const { facultyId } = req.params;
    const deletedFaculty = await facultyRepository.deleteFaculty(facultyId);

    if (!deletedFaculty) {
      res.status(http.NOT_FOUND).json({ message: "Faculty not found" });
      return;
    }

    res.status(http.OK).json({ message: "Faculty deleted successfully" });
  } catch (error: any) {
    logger.error(
      `[database]: Error deleting faculty - ${error.message ?? error}`
    );
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: `Error deleting faculty - ${error.message ?? error}` });
  }
};
