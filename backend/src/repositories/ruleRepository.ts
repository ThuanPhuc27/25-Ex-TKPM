// src/repositories/ruleRepository.ts

import fs from "fs";
import path from "path";

// Define the structure of transition rules
export interface TransitionRules {
  [key: string]: string[];
}

// Path to transitions.json
const dataPath = path.join(__dirname, "../data/transitions.json");

// Load rules from the file
export const getRules = (): TransitionRules => {
  const rawData = fs.readFileSync(dataPath, "utf8");
  return JSON.parse(rawData) as TransitionRules;
};

// Update rules in the file
export const updateRules = (newRules: TransitionRules): void => {
  fs.writeFileSync(dataPath, JSON.stringify(newRules, null, 2));
};
