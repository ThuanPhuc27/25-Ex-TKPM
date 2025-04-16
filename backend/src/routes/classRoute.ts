import { Router } from "express";

import {
  addClassController,
  getAllClassesController,
  updateClassController,
  deleteClassController,
} from "../controllers/classController";

const router = Router();

// Get all classes
router.get("/", getAllClassesController);

// Add a new class
router.post("/add", addClassController);

// Update a class
router.patch("/:classId/edit", updateClassController);

// Delete a class
router.delete("/:classId/delete", deleteClassController);

export default router;
