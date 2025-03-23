import { Request, Response } from "express";
import { getAllStudentStatuses } from "../repositories/studentStatusRepository";
import { getAllFaculties } from "../repositories/facultyRepository";
import { getAllPrograms } from "../repositories/programRepository";
import { http } from "../constants/httpStatusCodes";
import logger from "../logger";

export const getAllConfigsController = async (req: Request, res: Response) => {
  try {
    const [studentStatuses, faculties, programs] = await Promise.all([
      getAllStudentStatuses(),
      getAllFaculties(),
      getAllPrograms(),
    ]);

    res.status(http.OK).json({
      studentStatuses,
      faculties,
      programs,
    });
  } catch (error: any) {
    logger.error(
      `[database]: Error fetching configurations - ${error.message ?? error}`
    );
    res.status(http.INTERNAL_SERVER_ERROR).json({
      message: `${error.message ?? error}`,
    });
  }
};
