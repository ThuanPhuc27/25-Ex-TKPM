import { Request, Response } from "express";
import {
  createStudent,
  createStudents,
  getAllStudents,
  getStudentById,
  updateStudentById,
  deleteStudentById,
  getAllStudentsWithPopulation,
  getStudentByIdWithPopulation,
} from "../repositories/studentRepository";

import { http } from "../constants/httpStatusCodes";
import logger from "../logger";
import { IStudent } from "@models/student";
import { Types } from "mongoose";

export const addStudentController = async (req: Request, res: Response) => {
  try {
    const {
      studentId,
      fullName,
      birthDate,
      sex,
      faculty,
      schoolYear,
      program,
      permanentAddress,
      temporaryAddress,
      mailingAddress,
      identityDocuments,
      nationality,
      email,
      phone,
      status,
    } = req.body;

    const newStudent: IStudent = {
      studentId,
      fullName,
      birthDate: birthDate ? new Date(birthDate) : new Date(),
      sex,
      faculty: Types.ObjectId.createFromHexString(faculty),
      schoolYear,
      program: Types.ObjectId.createFromHexString(program),
      permanentAddress,
      temporaryAddress,
      mailingAddress,
      identityDocuments,
      nationality,
      email,
      phone,
      status: Types.ObjectId.createFromHexString(status),
    };

    const result = await createStudent(newStudent);

    res.status(http.CREATED).json({ newStudent: result });
  } catch (error: any) {
    logger.error(`[database]: Cannot add student - ${error.message ?? error}`);
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .send({ message: `${error.message ?? error}` });
  }
};

// Currently not sure if "raw json" data can be put directly into mongoose's class
export const addStudentsController = async (req: Request, res: Response) => {
  try {
    const studentsData = req.body;

    if (!Array.isArray(studentsData) || studentsData.length === 0) {
      res
        .status(http.NOT_FOUND)
        .json({ message: "Invalid or empty student data" });
      return;
    }

    const addedStudents = await createStudents(studentsData);

    res.status(http.CREATED).json({ newStudents: addedStudents });
  } catch (error: any) {
    logger.error(
      `[database]: Error adding multiple students - ${error.message ?? error}`
    );
    res.status(http.INTERNAL_SERVER_ERROR).json({
      message: `${error.message ?? error}`,
    });
  }
};

export const getStudentsController = async (req: Request, res: Response) => {
  try {
    const populated = req.query.populated === "true";

    if (populated) {
      const students = await getAllStudentsWithPopulation();
      res.status(http.OK).json({ students });
    } else {
      const students = await getAllStudents();
      res.status(http.OK).json({ students });
    }
  } catch (error: any) {
    logger.error(`[database]: Cannot get students - ${error.message ?? error}`);
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .send({ message: `${error.message ?? error}` });
  }
};

export const getOneStudentController = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const populated = req.query.populated === "true";

    // Fetch student first
    let student: IStudent | null;

    if (populated) {
      student = await getStudentByIdWithPopulation(studentId);
    } else {
      student = await getStudentById(studentId);
    }

    // If student is not found, return 404
    if (!student) {
      res
        .status(http.NOT_FOUND)
        .send({ message: `Student with id "${studentId}" not found` });
      return;
    }

    res.status(http.OK).json({ student });
  } catch (error: any) {
    logger.error(`[database]: Cannot get student - ${error.message ?? error}`);
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .send({ message: `${error.message ?? error}` });
  }
};

export const deleteStudentController = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    const deletedStudent = await deleteStudentById(studentId);
    if (!deletedStudent) {
      res
        .status(http.NOT_FOUND)
        .send({ message: `Student with id "${studentId}" not found` });
      return;
    }

    res.status(http.OK).json({ acknowledged: true });
  } catch (error: any) {
    logger.error(
      `[database]: Cannot delete student - ${error.message ?? error}`
    );
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .send({ message: `${error.message ?? error}` });
  }
};

export const updateStudentController = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const {
      fullName,
      birthDate,
      sex,
      faculty,
      schoolYear,
      program,
      permanentAddress,
      temporaryAddress,
      mailingAddress,
      identityDocuments,
      nationality,
      email,
      phone,
      status,
    } = req.body;

    const student = await getStudentById(studentId);

    if (!student) {
      res.status(http.NOT_FOUND).send({ message: "Student not found" });
      return;
    }

    const updatedStudent: Omit<IStudent, "studentId"> = {
      fullName,
      birthDate: birthDate ? new Date(birthDate) : student.birthDate,
      sex,
      faculty: Types.ObjectId.createFromHexString(faculty),
      schoolYear,
      program: Types.ObjectId.createFromHexString(program),
      permanentAddress,
      temporaryAddress,
      mailingAddress,
      identityDocuments,
      nationality,
      email,
      phone,
      status: Types.ObjectId.createFromHexString(status),
    };

    const result = await updateStudentById(studentId, updatedStudent);

    res.status(http.OK).json({
      acknowledged: true,
      newStudent: result,
    });
  } catch (error: any) {
    logger.error(
      `[database]: Cannot update student - ${error.message ?? error}`
    );
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .send({ message: `${error.message ?? error}` });
  }
};
