import { Router } from "express";

import {
  addCourseController,
  getAllCoursesController,
  updateCourseController,
  deleteCourseController,
} from "../controllers/courseController";

const router = Router();

// Get all courses
router.get("/", getAllCoursesController);

// Add a new course
router.post("/add", addCourseController);

// Update a course
router.patch("/:courseId/edit", updateCourseController);

// Delete a course
router.delete("/:courseId/delete", deleteCourseController);

export default router;
