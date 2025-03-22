import { Router } from "express";

import { getAllConfigsController } from "../controllers/configController";

const router = Router();

router.get("/", getAllConfigsController);

export default router;
