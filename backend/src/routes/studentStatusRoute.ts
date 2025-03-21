import { raw, Router } from "express";

import {
  create,
  getAll,
  update,
  remove,
} from "../controllers/studentStatusController";

const router = Router();

router.get("/", getAll);

router.post("/add", create);

router.patch("/:statusId/edit", update);

router.delete("/:statusId/delete", remove);
export default router;
