import { raw, Router } from "express";
import {
  addStudentController,
  addStudentsController,
  getStudentsController,
  getOneStudentController,
  updateStudentController,
  deleteStudentController,
} from "../controllers/studentController";
import {
  exportAllStudentsController,
  importStudentsController,
} from "@controllers/studentTransferingController";

const router = Router();

router.get("/export-all", exportAllStudentsController);
router.get("/:studentId", getOneStudentController);
router.get("/", getStudentsController);

router.post("/add-one", addStudentController);
router.post("/add-multi", addStudentsController);
router.post(
  "/import",
  raw({ type: "application/xml" }),
  importStudentsController
);

router.patch("/:studentId", updateStudentController);

router.delete("/:studentId", deleteStudentController);

export default router;
