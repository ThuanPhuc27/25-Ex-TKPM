import { raw, Router } from "express";

import {
  createProgram,
  getAllPrograms,
  updateProgram,
  deleteProgram,
} from "../controllers/programController";

const router = Router();

router.get("/", getAllPrograms);

router.post("/add", createProgram);

router.patch("/:programId/edit", updateProgram);

router.delete("/:programId/delete", deleteProgram);
export default router;
