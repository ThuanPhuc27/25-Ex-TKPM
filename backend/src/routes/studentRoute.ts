import { Router } from "express";
import {
  addStudentController,
  addStudentsController,
  getStudentsController,
  getOneStudentController,
  updateStudentController,
  deleteStudentController,
  
} from "../controllers/studentController";

const router = Router();

router.post("/add-one", addStudentController);

router.post("/add-multi", addStudentsController);

router.get("/", getStudentsController);

router.get("/:studentId", getOneStudentController);

router.patch("/:studentId", updateStudentController);

router.delete("/:studentId", deleteStudentController);

export default router;
