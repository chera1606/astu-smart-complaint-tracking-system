import { Router } from "express";
import { ragController } from "./rag.controller.js";

const router = Router();

router.post("/", ragController.handleQuery);

export default router;
