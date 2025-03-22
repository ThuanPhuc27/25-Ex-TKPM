import { Request, Response } from "express";
import * as programRepository from "../repositories/programRepository";
import { http } from "../constants/httpStatusCodes";

export const addProgramController = async (req: Request, res: Response) => {
  try {
    const { name, code } = req.body;
    const program = await programRepository.createProgram(name, code);
    res.status(http.CREATED).json(program);
  } catch (error) {
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: "Error creating program", error });
  }
};

export const getAllProgramsController = async (req: Request, res: Response) => {
  try {
    const programs = await programRepository.getAllPrograms();
    res.status(http.OK).json(programs);
  } catch (error) {
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching programs", error });
  }
};

export const updateProgramController = async (req: Request, res: Response) => {
  try {
    const { programId } = req.params;
    const { name, code } = req.body;
    const updatedProgram = await programRepository.updateProgram(
      programId,
      name,
      code
    );

    if (!updatedProgram) {
      res.status(http.NOT_FOUND).json({ message: "Program not found" });
    }

    res.status(http.OK).json(updatedProgram);
  } catch (error) {
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: "Error updating program", error });
  }
};

export const deleteProgramController = async (req: Request, res: Response) => {
  try {
    const { programId } = req.params;
    const deletedProgram = await programRepository.deleteProgram(programId);

    if (!deletedProgram) {
      res.status(http.NOT_FOUND).json({ message: "Program not found" });
    }

    res.status(http.OK).json({ message: "Program deleted successfully" });
  } catch (error) {
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: "Error deleting program", error });
  }
};
