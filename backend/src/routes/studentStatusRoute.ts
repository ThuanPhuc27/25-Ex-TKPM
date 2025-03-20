import { raw, Router } from "express";

import { create, getAll, update,remove } from "../controllers/studentStatusController"

const router = Router();

router.get("/", getAll);

router.post("/add", create);

router.patch("/:studentId", update);

router.delete("/:studentId", remove);
export default router;
