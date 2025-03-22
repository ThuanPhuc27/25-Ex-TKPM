import { Router } from "express";

import {
  addFacultyController,
  getAllFacultiesController,
  updateFacultyController,
  deleteFacultyController,
} from "../controllers/facultyController";

const router = Router();

router.get("/", getAllFacultiesController);

router.post("/add", addFacultyController);

router.patch("/:facultyId/edit", updateFacultyController);

router.delete("/:facultyId/delete", deleteFacultyController);

export default router;
