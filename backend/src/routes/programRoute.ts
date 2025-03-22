import { Router } from "express";

import {
  addProgramController,
  getAllProgramsController,
  updateProgramController,
  deleteProgramController,
} from "../controllers/programController";

const router = Router();

router.get("/", getAllProgramsController);

router.post("/add", addProgramController);

router.patch("/:programId/edit", updateProgramController);

router.delete("/:programId/delete", deleteProgramController);

export default router;
