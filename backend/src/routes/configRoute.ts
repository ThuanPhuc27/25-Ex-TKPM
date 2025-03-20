import { raw, Router } from "express";

import { getAllConfigs } from "../controllers/configController"

const router = Router();

router.get("/", getAllConfigs);

export default router;
