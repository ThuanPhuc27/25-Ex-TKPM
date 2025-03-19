import { Request, Response } from 'express';
import { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent } from '../repositories/studentRepository';
import { http } from '../constants/httpStatusCodes';
import logger from '../logger';

// Thêm sinh viên mới
export const addStudent = async (req: Request, res: Response) => {
  try {
    const {
      studentId,
      fullName,
      birthDate,
      sex,
      faculty,
      schoolYear,
      program,
      address,
      email,
      phone,
      status,
    } = req.body;

    const newStudent = {
      studentId,
      fullName,
      birthDate: birthDate ? new Date(birthDate) : new Date(),
      sex,
      faculty,
      schoolYear,
      program,
      address,
      email,
      phone,
      status,
    };

    const result = await createStudent(newStudent);

    res.status(http.CREATED).json({ newStudent: result });
  } catch (error) {
    logger.error(`[database]: Cannot add student - ${error}`);
    res.status(http.INTERNAL_SERVER_ERROR).send({ reason: 'Cannot add student' });
  }
};

// Lấy tất cả sinh viên
export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await getAllStudents();
    res.status(http.OK).json({ students });
  } catch (error) {
    logger.error(`[database]: Cannot get students - ${error}`);
    res.status(http.INTERNAL_SERVER_ERROR).send({ reason: 'Cannot get students' });
  }
};

// Lấy sinh viên theo studentId
export const getStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    const student = await getStudentById(studentId);

    if (!student) {
      return res.status(http.NOT_FOUND).send({ reason: `Student with id "${studentId}" not found` });
    }

    res.status(http.OK).json({ student });
  } catch (error) {
    logger.error(`[database]: Cannot get student - ${error}`);
    res.status(http.INTERNAL_SERVER_ERROR).send({ reason: 'Cannot get student' });
  }
};

// Xóa sinh viên theo studentId
export const deleteStudentById = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const student = await getStudentById(studentId);

    if (!student) {
      return res.status(http.NOT_FOUND).send({ reason: `Student with id "${studentId}" not found` });
    }

    const result = await deleteStudent(studentId);

    res.status(http.OK).json({ acknowledged: result?.acknowledged });
  } catch (error) {
    logger.error(`[database]: Cannot delete student - ${error}`);
    res.status(http.INTERNAL_SERVER_ERROR).send({ reason: 'Cannot delete student' });
  }
};

// Cập nhật thông tin sinh viên
export const updateStudentById = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const { fullName, birthDate, sex, faculty, schoolYear, program, address, email, phone, status } = req.body;

    const student = await getStudentById(studentId);

    if (!student) {
      return res.status(http.NOT_FOUND).send({ reason: 'Student not found' });
    }

    const updatedStudent = {
      fullName,
      birthDate: birthDate ? new Date(birthDate) : student.birthDate,
      sex,
      faculty,
      schoolYear,
      program,
      address,
      email,
      phone,
      status,
    };

    const result = await updateStudent(studentId, updatedStudent);

    res.status(http.OK).json({
      acknowledged: result?.acknowledged,
      updatedStudent: result,
    });
  } catch (error) {
    logger.error(`[database]: Cannot update student - ${error}`);
    res.status(http.INTERNAL_SERVER_ERROR).send({ reason: 'Cannot update student' });
  }
};
