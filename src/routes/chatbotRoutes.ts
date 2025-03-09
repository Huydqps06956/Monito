import express from "express";
import { getChatbotResponse } from "../controllers/chatbotController";

const router = express.Router();

// Public route for chatbot
router.post("/message", getChatbotResponse);

export default router;
