import { Router } from "express";
import { getChat, postChat, onLED, offLED } from "../controllers/chatController.js";

const router = Router();

router.get("/", getChat);
router.post("/", postChat);

router.get("/led/:num/on", onLED);

router.get("/led/:num/off", offLED);

export default router;
