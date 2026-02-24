import { Router } from "express";
import uploadDataRoute from "./module/uploadData/upload.route.js"
import ragRoute from "./module/rag/rag.route.js"
import authRoute from "./module/auth/auth.route.js"
import userRoute from "./module/user/user.route.js"
import categoryRoute from "./module/category/category.route.js"
import complaintRoute from "./module/complaint/complaint.route.js"

const router = Router()

router.use("/upload", uploadDataRoute)
router.use("/query", ragRoute)
router.use("/auth", authRoute)
router.use("/users", userRoute)
router.use("/categories", categoryRoute)
router.use("/complaints", complaintRoute)

export default router
