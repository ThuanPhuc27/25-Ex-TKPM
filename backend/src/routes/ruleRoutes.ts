// src/routes/ruleRoutes.ts

import express from "express";
import { getAllRules, updateAllRules } from "../controllers/ruleController";

const router = express.Router();

// Route to get transition rules
router.get("/", getAllRules);

// Route to update transition rules
router.post("/", updateAllRules);

export default router;
