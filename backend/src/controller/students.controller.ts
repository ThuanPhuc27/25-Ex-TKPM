import { Student } from "@models/student";
import { collections } from "@service/database.service";
import { Request, Response } from "express";
import { http } from "../constants/httpStatusCodes";

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
    const newStudent = new Student(
      studentId,
      fullName,
      birthDate ? new Date(birthDate) : new Date(),
      sex,
      faculty,
      schoolYear,
      program,
      address,
      email,
      phone,
      status
    );
    const result = await collections.students?.insertOne(newStudent, {
      forceServerObjectId: false,
    });
    console.log(`[database]: Added a student with id "${result?.insertedId}"`);
    delete newStudent._id;
    res.status(http.CREATED).json({ newStudent: newStudent });
  } catch (error) {
    console.error(`[database]: Cannot add student - ${error}`);
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .send({ reason: "Cannot add student" });
  }
};

export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await collections.students
      ?.aggregate([
        {
          $project: {
            _id: 0,
          },
        },
      ])
      .toArray();
    res.status(http.OK).json({ students: students });
  } catch (error) {
    console.error(`[database]: Cannot get students - ${error}`);
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .send({ reason: "Cannot get students" });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId;

    const existingStudent = await collections.students?.findOne({ studentId });
    if (!existingStudent) {
      res
        .status(http.NOT_FOUND)
        .send({ reason: `Student with id "${studentId}" not found` });
      return;
    }

    const result = await collections.students?.deleteOne({ studentId });
    console.log(`[database]: Deleted a student with id "${studentId}"`);
    res.status(http.OK).json({ acknowledged: result?.acknowledged });
  } catch (error) {
    console.error(`[database]: Cannot delete student - ${error}`);
    res
      .status(http.INTERNAL_SERVER_ERROR)
      .send({ reason: "Cannot delete student" });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId;
    const {
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
    const student = await collections.students?.findOne({ studentId });
    if (!student) {
      res.status(http.NOT_FOUND).send({ reason: "Student not found" });
      return;
    }
    const constructedStudent = Student.from(student).update(
      studentId,
      fullName,
      birthDate ? new Date(birthDate) : new Date(),
      sex,
      faculty,
      schoolYear,
      program,
      address,
      email,
      phone,
      status
    );
    const result = await collections.students?.replaceOne(
      { studentId },
      constructedStudent
    );
    console.log(`[database]: Updated a student with id "${studentId}"`);
    res.status(http.OK).json({
      acknowledged: result?.acknowledged,
      newStudent: constructedStudent,
    });
  } catch (error) {
    console.error(`[database]: Cannot update student - ${error}`);
    res.status(http.INTERNAL_SERVER_ERROR).send("Cannot update student");
  }
};
