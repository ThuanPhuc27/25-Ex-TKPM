// src/repositories/ruleRepository.ts

import fs from "fs";
import path from "path";

// Define the structure of transition rules
export interface TransitionRules {
  [key: string]: string[];
}

// Paths to transition-local.json and transition-init.json
const dataPath = path.join(__dirname, "../data/transition-local.json");
const initDataPath = path.join(__dirname, "../data/transition-init.json");

// Load rules from the file
export const getRules = (): TransitionRules => {
  try {
    const rawData = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(rawData) as TransitionRules;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      // If transition-local.json is not found, attempt to load transition-init.json
      try {
        const initRawData = fs.readFileSync(initDataPath, "utf8");
        const rules = JSON.parse(initRawData) as TransitionRules;
        // Write the initial data to transition-local.json
        fs.writeFileSync(dataPath, initRawData, "utf8");
        return rules;
      } catch (initError) {
        throw new Error("Error reading transition-init.json");
      }
    }
    throw new Error("Error reading transition-local.json");
  }
};

// Update rules in the file
export const updateRules = (newRules: TransitionRules): void => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(newRules, null, 2));
  } catch (error) {
    throw new Error("Error updating transition-local.json");
  }
};
