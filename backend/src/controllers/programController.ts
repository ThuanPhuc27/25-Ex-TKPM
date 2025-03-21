import { Request, Response } from "express";
import * as programRepository from "../repositories/programRepository";

// Tạo mới chương trình
export const createProgram = async (req: Request, res: Response) => {
  try {
    const { name, code } = req.body;
    const program = await programRepository.createProgram(name, code);
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ message: "Error creating program", error });
  }
};

// Lấy tất cả các chương trình
export const getAllPrograms = async (req: Request, res: Response) => {
  try {
    const programs = await programRepository.getAllPrograms();
    res.status(200).json(programs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching programs", error });
  }
};

// Cập nhật thông tin chương trình
export const updateProgram = async (req: Request, res: Response) => {
  try {
    const { programId } = req.params;
    const { name, code } = req.body;
    const updatedProgram = await programRepository.updateProgram(
      programId,
      name,
      code
    );

    if (!updatedProgram) {
      res.status(404).json({ message: "Program not found" });
    }

    res.status(200).json(updatedProgram);
  } catch (error) {
    res.status(500).json({ message: "Error updating program", error });
  }
};

// Xóa chương trình
export const deleteProgram = async (req: Request, res: Response) => {
  try {
    const { programId } = req.params;
    const deletedProgram = await programRepository.deleteProgram(programId);

    if (!deletedProgram) {
      res.status(404).json({ message: "Program not found" });
    }

    res.status(200).json({ message: "Program deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting program", error });
  }
};
