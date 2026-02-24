import { Router } from "express";
import { uploadDataController } from "./upload.controller.js";

const router = Router()

router.post("/", uploadDataController.uploadData)

export default router
