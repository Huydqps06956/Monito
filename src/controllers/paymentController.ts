// src/controllers/paymentController.ts
import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import Order from "../models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-08-16",
});

// Create payment intent
export const createPaymentIntent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.body;

    // Get order details
    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Check if order belongs to current user
    if (order.user.toString() !== req.user!.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to make payment for this order",
      });
    }

    // Check if order is already paid
    if (order.isPaid) {
      return res.status(400).json({
        success: false,
        message: "Order is already paid",
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // amount in cents
      currency: "usd",
      metadata: {
        orderId: order._id.toString(),
        userId: req.user!.id,
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
};

// Handle Stripe webhook
export const handleStripeWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const signature = req.headers["stripe-signature"] as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      // Update order
      const orderId = paymentIntent.metadata.orderId;
      const order = await Order.findById(orderId);

      if (order) {
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentResult = {
          id: paymentIntent.id,
          status: paymentIntent.status,
          updateTime: new Date().toISOString(),
        };

        await order.save();
      }

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.status(200).json({ received: true });
};
