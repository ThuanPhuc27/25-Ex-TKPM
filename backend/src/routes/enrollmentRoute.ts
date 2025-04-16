import { Router } from "express";

import {
  addEnrollmentController,
  cancelEnrollmentController,
  getAllEnrollmentsController,
  getEnrollmentsByStudentController,
  getEnrollmentsByClassController,
} from "../controllers/enrollmentController";

const router = Router();

// Get all enrollments
router.get("/", getAllEnrollmentsController);

// Add a new enrollment
router.post("/add", addEnrollmentController);

// Cancel an enrollment
router.patch("/:enrollmentId/cancel", cancelEnrollmentController);

// Get enrollments by student
router.get("/student/:studentId", getEnrollmentsByStudentController);

// Get enrollments by class
router.get("/class/:classCode", getEnrollmentsByClassController);

export default router;
