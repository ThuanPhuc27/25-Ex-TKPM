import { Request, Response } from "express";
import {
  createStudent,
  createStudents,
  getAllStudents,
  getStudentById,
  updateStudentById,
  deleteStudentById,

} from "../repositories/studentRepository";
import {getFacultyByCode} from "../repositories/facultyRepository"
import {getProgramByCode} from "../repositories/programRepository"

import { http } from "../constants/httpStatusCodes";
import logger from "../logger";
import { IStudent } from "@models/student";

// Thêm sinh viên mới
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
    };

    const result = await createStudent(newStudent);

    res.status(http.CREATED).json({ newStudent: result });
  } catch (error) {
    logger.error(`[database]: Cannot add student - ${error}`);
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .send({ reason: `Cannot add student - ${error}` });
  }
};

export const addStudentsController = async (req: Request, res: Response) => {
  try {
    const studentsData = req.body;

    if (!Array.isArray(studentsData) || studentsData.length === 0) {
      res.status(http.NOT_FOUND).json({ message: "Invalid or empty student data" });
    }

    const addedStudents = await createStudents(studentsData);

    res.status(http.CREATED).json({newStudents: addedStudents });
  } catch (error) {
    logger.error(`Error adding multiple students:  ${error}`);
    res.status(http.INTERNAL_SERVER_ERROR).json({ message: `An error occurred while adding students:  ${error}`});
  }
};


// Lấy tất cả sinh viên
export const getStudentsController = async (req: Request, res: Response) => {
  try {
    const students = await getAllStudents();

    // Use for...of instead of forEach to handle async await properly
    for (const student of students) {
      const faculty = await getFacultyByCode(student.faculty);
      student.faculty = faculty ? faculty.name : "Unknown Faculty";
      const program = await getProgramByCode(student.program);
      student.program = program ? program.name : "Unknown Program"; 
    }

    res.status(http.OK).json({ students });
  } catch (error) {
    logger.error(`[database]: Cannot get students - ${error}`);
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .send({ reason: "Cannot get students" });
  }
};


// Lấy sinh viên theo studentId
export const getOneStudentController = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    // Fetch student first
    let student = await getStudentById(studentId);

    // If student is not found, return 404
    if (!student) {
      res
        .status(http.NOT_FOUND)
        .send({ reason: `Student with id "${studentId}" not found` });
      return;
    }

    // Fetch faculty only if student exists
    const faculty = await getFacultyByCode(student.faculty);
    student.faculty = faculty ? faculty.name : "Unknown Faculty";

    const program = await getProgramByCode(student.program);
    student.program = program ? program.name : "Unknown Program"; 

    res.status(http.OK).json({ student });
  } catch (error) {
    logger.error(`[database]: Cannot get student - ${error}`);
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .send({ reason: "Cannot get student" });
  }
};


// Xóa sinh viên theo studentId
export const deleteStudentController = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    const deletedStudent = await deleteStudentById(studentId);
    if (!deletedStudent) {
      res
        .status(http.NOT_FOUND)
        .send({ reason: `Student with id "${studentId}" not found` });
      return;
    }

    res.status(http.OK).json({ acknowledged: true });
  } catch (error) {
    logger.error(`[database]: Cannot delete student - ${error}`);
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .send({ reason: "Cannot delete student" });
  }
};

// Cập nhật thông tin sinh viên
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
      res.status(http.NOT_FOUND).send({ reason: "Student not found" });
      return;
    }

    const updatedStudent: Omit<IStudent, "studentId"> = {
      fullName,
      birthDate: birthDate ? new Date(birthDate) : student.birthDate,
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
    };

    const result = await updateStudentById(studentId, updatedStudent);

    res.status(http.OK).json({
      acknowledged: true,
      newStudent: result,
    });
  } catch (error) {
    logger.error(`[database]: Cannot update student - ${error}`);
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .send({ reason: "Cannot update student" });
  }
};