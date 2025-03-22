import { Request, Response } from "express";
import * as facultyRepository from "../repositories/facultyRepository";
import { http } from "../constants/httpStatusCodes";

export const addFacultyController = async (req: Request, res: Response) => {
  try {
    const { name, code } = req.body;
    const faculty = await facultyRepository.createFaculty(name, code);
    res.status(http.CREATED).json(faculty);
  } catch (error) {
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: "Error creating faculty", error });
  }
};

export const getAllFacultiesController = async (
  req: Request,
  res: Response
) => {
  try {
    const faculties = await facultyRepository.getAllFaculties();
    res.status(http.OK).json(faculties);
  } catch (error) {
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching faculties", error });
  }
};

export const updateFacultyController = async (req: Request, res: Response) => {
  try {
    const { facultyId } = req.params;
    const { name, code } = req.body;
    const updatedFaculty = await facultyRepository.updateFaculty(
      facultyId,
      name,
      code
    );

    if (!updatedFaculty) {
      res.status(http.NOT_FOUND).json({ message: "Faculty not found" });
    }

    res.status(http.OK).json(updatedFaculty);
  } catch (error) {
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: "Error updating faculty", error });
  }
};

export const deleteFacultyController = async (req: Request, res: Response) => {
  try {
    const { facultyId } = req.params;
    const deletedFaculty = await facultyRepository.deleteFaculty(facultyId);

    if (!deletedFaculty) {
      res.status(http.NOT_FOUND).json({ message: "Faculty not found" });
    }

    res.status(http.OK).json({ message: "Faculty deleted successfully" });
  } catch (error) {
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .json({ message: "Error deleting faculty", error });
  }
};
