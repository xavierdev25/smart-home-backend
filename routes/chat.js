import { Router } from "express";
import {
  getChat,
  postChat,
  onLED,
  offLED,
} from "../controllers/chatController.js";

const router = Router();

router.get("/", getChat);
router.post("/", postChat);

router.post("/led/:num/on", onLED);

router.post("/led/:num/off", offLED);

export default router;
