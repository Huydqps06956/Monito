import { Request, Response, NextFunction } from "express";
import Product from "../models/Product";

// Get chatbot response
export const getChatbotResponse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { message } = req.body;

    // Simple keyword-based responses
    const lowerMessage = message.toLowerCase();

    // Handle product inquiries
    if (
      lowerMessage.includes("dog") ||
      lowerMessage.includes("pet") ||
      lowerMessage.includes("accessory")
    ) {
      // Search for related products
      const products = await Product.find({
        $text: { $search: lowerMessage },
      }).limit(3);

      if (products.length > 0) {
        return res.status(200).json({
          success: true,
          data: {
            message: "I found some products you might be interested in:",
            products: products.map((p) => ({
              id: p._id,
              name: p.name,
              price: p.price,
              image: p.images[0],
            })),
          },
        });
      }
    }

    // Order status inquiries
    if (lowerMessage.includes("order") && lowerMessage.includes("status")) {
      return res.status(200).json({
        success: true,
        data: {
          message:
            "To check your order status, please go to the Orders section in your account dashboard. If you need further assistance, contact our customer support.",
        },
      });
    }

    // Shipping inquiries
    if (
      lowerMessage.includes("shipping") ||
      lowerMessage.includes("delivery")
    ) {
      return res.status(200).json({
        success: true,
        data: {
          message:
            "We offer standard shipping (3-5 business days) and express shipping (1-2 business days). Free shipping on orders over $50.",
        },
      });
    }

    // Return policy
    if (lowerMessage.includes("return") || lowerMessage.includes("refund")) {
      return res.status(200).json({
        success: true,
        data: {
          message:
            "We accept returns within 30 days of purchase. Items must be in original condition. Please contact customer service to initiate a return.",
        },
      });
    }

    // Default response
    return res.status(200).json({
      success: true,
      data: {
        message:
          "Thank you for your message. How can I help you with our pet shop services today? I can assist with product information, order status, shipping, or returns.",
      },
    });
  } catch (error) {
    next(error);
  }
};
