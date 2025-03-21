import { raw, Router } from "express";

import {
  createFaculty,
  getAllFaculties,
  updateFaculty,
  deleteFaculty,
} from "../controllers/facultyController";

const router = Router();

router.get("/", getAllFaculties);

router.post("/add", createFaculty);

router.patch("/:facultyId/edit", updateFaculty);

router.delete("/:facultyId/delete", deleteFaculty);
export default router;
