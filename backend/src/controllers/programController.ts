import { Request, Response } from "express";
import * as programRepository from "../repositories/programRepository";
import { http } from "../constants/httpStatusCodes";
import logger from "../logger";

export const addProgramController = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const program = await programRepository.createProgram(name);
    res.status(http.CREATED).json(program);
  } catch (error: any) {
    logger.error(
      `[database]: Error creating program - ${error.message ?? error}`
    );
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: `${error.message ?? error}` });
  }
};

export const getAllProgramsController = async (_: Request, res: Response) => {
  try {
    const programs = await programRepository.getAllPrograms();
    res.status(http.OK).json(programs);
  } catch (error: any) {
    logger.error(
      `[database]: Error fetching programs - ${error.message ?? error}`
    );
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: `${error.message ?? error}` });
  }
};

export const updateProgramController = async (req: Request, res: Response) => {
  try {
    const { programId } = req.params;
    const { name } = req.body;
    const updatedProgram = await programRepository.updateProgram(
      programId,
      name
    );

    if (!updatedProgram) {
      res.status(http.NOT_FOUND).json({ message: "Program not found" });
      return;
    }

    res.status(http.OK).json(updatedProgram);
  } catch (error: any) {
    logger.error(
      `[database]: Error updating program - ${error.message ?? error}`
    );
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: `${error.message ?? error}` });
  }
};

export const deleteProgramController = async (req: Request, res: Response) => {
  try {
    const { programId } = req.params;
    const deletedProgram = await programRepository.deleteProgram(programId);

    if (!deletedProgram) {
      res.status(http.NOT_FOUND).json({ message: "Program not found" });
      return;
    }

    res.status(http.OK).json({ message: "Program deleted successfully" });
  } catch (error: any) {
    logger.error(
      `[database]: Error deleting program - ${error.message ?? error}`
    );
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: `${error.message ?? error}` });
  }
};
