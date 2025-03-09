import express from "express";
import {
  getUserCart,
  addItemToCart,
  removeCartItem,
  clearCart,
} from "../controllers/cartController";
import { protect } from "../middlewares/auth";

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router.get("/", getUserCart);
router.post("/add", addItemToCart);
router.delete("/item/:productId", removeCartItem);
router.delete("/clear", clearCart);

export default router;
