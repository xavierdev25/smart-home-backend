import { Router } from "express";
import { getChat, postChat } from "../controllers/chatController.js";

const router = Router();

router.get("/", getChat);
router.post("/", postChat);

export default router;
