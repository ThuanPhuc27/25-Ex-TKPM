import { Router } from "express";
import { getDomainList, updateDomainList } from "../controllers/domainController";

const router = Router();

// Lấy danh sách email domains
router.get("/", getDomainList);

// Cập nhật danh sách email domains
router.post("/", updateDomainList);

export default router;
