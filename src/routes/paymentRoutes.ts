import express from "express";
import {
  createPaymentIntent,
  handleStripeWebhook,
} from "../controllers/paymentController";
import { protect } from "../middlewares/auth";

const router = express.Router();

// Create payment intent (requires authentication)
router.post("/create-payment-intent", protect, createPaymentIntent);

// Stripe webhook (doesn't require authentication)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

export default router;
