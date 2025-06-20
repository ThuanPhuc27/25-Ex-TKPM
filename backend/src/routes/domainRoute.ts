import { Router } from "express";
import {
  getDomainList,
  updateDomainList,
} from "../controllers/domainController";

const router = Router();

// Get email domains
router.get("/", getDomainList);

// Edit email domains
router.post("/", updateDomainList);

export default router;
