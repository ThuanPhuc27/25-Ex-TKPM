// src/controllers/ruleController.ts

import { Request, Response } from "express";
import { getRules, updateRules, TransitionRules } from "../repositories/ruleRepository";

// Get all transition rules
export const getAllRules = (req: Request, res: Response): void => {
  try {
    const rules = getRules();
    res.status(200).json(rules);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transition rules" });
  }
};

// Update transition rules
export const updateAllRules = (req: Request, res: Response): void => {
  try {
    const newRules: TransitionRules = req.body;
    updateRules(newRules);
    res.status(200).json({ message: "Transition rules updated successfully", newRules });
  } catch (error) {
    res.status(500).json({ error: "Failed to update transition rules" });
  }
};
