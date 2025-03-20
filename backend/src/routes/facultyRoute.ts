import { raw, Router } from "express";

import { createFaculty, getAllFaculties, updateFaculty, deleteFaculty } from "../controllers/facultyController"

const router = Router();

router.get("/", getAllFaculties);

router.post("/add", createFaculty);

router.patch("/:studentId", updateFaculty);

router.delete("/:studentId", deleteFaculty);
export default router;
