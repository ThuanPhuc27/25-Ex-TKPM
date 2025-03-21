import { Request, Response } from "express";
import * as facultyRepository from "../repositories/facultyRepository";

// Tạo mới khoa
export const createFaculty = async (req: Request, res: Response) => {
  try {
    const { name, code } = req.body;
    const faculty = await facultyRepository.createFaculty(name, code);
    res.status(201).json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Error creating faculty", error });
  }
};

// Lấy tất cả các khoa
export const getAllFaculties = async (req: Request, res: Response) => {
  try {
    const faculties = await facultyRepository.getAllFaculties();
    res.status(200).json(faculties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching faculties", error });
  }
};

// Cập nhật thông tin khoa
export const updateFaculty = async (req: Request, res: Response) => {
  try {
    const { facultyId } = req.params;
    const { name, code } = req.body;
    const updatedFaculty = await facultyRepository.updateFaculty(
      facultyId,
      name,
      code
    );

    if (!updatedFaculty) {
      res.status(404).json({ message: "Faculty not found" });
    }

    res.status(200).json(updatedFaculty);
  } catch (error) {
    res.status(500).json({ message: "Error updating faculty", error });
  }
};

// Xóa khoa
export const deleteFaculty = async (req: Request, res: Response) => {
  try {
    const { facultyId } = req.params;
    const deletedFaculty = await facultyRepository.deleteFaculty(facultyId);

    if (!deletedFaculty) {
      res.status(404).json({ message: "Faculty not found" });
    }

    res.status(200).json({ message: "Faculty deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting faculty", error });
  }
};
