import {
  addStudent,
  deleteStudent,
  getStudents,
  updateStudent,
} from "@controller/students.controller";
import { Router } from "express";

const router = Router();

router.get("/", getStudents);
router.post("/add-one", addStudent);
router.delete("/:studentId", deleteStudent);
router.patch("/:studentId", updateStudent);

export default router;
