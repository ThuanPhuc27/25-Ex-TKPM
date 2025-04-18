import { Router } from "express";

import {
  addEnrollmentController,
  cancelEnrollmentController,
  updateEnrollmentScoreController,
  getAllEnrollmentsController,
  getEnrollmentsByStudentController,
  getEnrollmentsByClassController,
  getScoreboardByStudentController,
} from "../controllers/enrollmentController";

const router = Router();

// Get all enrollments
router.get("/", getAllEnrollmentsController);

// Add a new enrollment
router.post("/add", addEnrollmentController);

// Cancel an enrollment
router.delete("/:enrollmentId/cancel", cancelEnrollmentController);
// Update enrollment score
router.patch("/:enrollmentId/score", updateEnrollmentScoreController);

// Get the scoreboard for a student
router.get("/student/:studentId/scoreboard", getScoreboardByStudentController);
// Get enrollments by student
router.get("/student/:studentId", getEnrollmentsByStudentController);
// Get enrollments by class
router.get("/class/:classCode", getEnrollmentsByClassController);

export default router;
