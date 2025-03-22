import { Router } from "express";

import {
  addStudentStatusController,
  getAllStudentStatusController,
  editStudentStatusController,
  deleteStudentStatusController,
} from "../controllers/studentStatusController";

const router = Router();

router.get("/", getAllStudentStatusController);

router.post("/add", addStudentStatusController);

router.patch("/:statusId/edit", editStudentStatusController);

router.delete("/:statusId/delete", deleteStudentStatusController);

export default router;
