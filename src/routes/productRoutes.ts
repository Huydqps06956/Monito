import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { protect, authorize } from "../middlewares/auth";
import { cacheMiddleware } from "../middlewares/redisCache";

const router = express.Router();

// Public routes with cache
router.get("/", cacheMiddleware(300), getProducts);
router.get("/:id", cacheMiddleware(600), getProduct);

// Admin routes
router.post("/", protect, authorize("admin"), createProduct);
router.put("/:id", protect, authorize("admin"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

export default router;
