import { Request, Response, NextFunction } from "express";
import Cart from "../models/Cart";
import Product from "../models/Product";

// Get user cart
export const getUserCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let cart = await Cart.findOne({ user: req.user!.id }).populate({
      path: "items.product",
      select: "name price images",
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user!.id,
        items: [],
        totalPrice: 0,
      });
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};
// Add item to cart
export const addItemToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, quantity } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Check if product is in stock
    if (product.countInStock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough product in stock",
      });
    }

    // Get user cart
    let cart = await Cart.findOne({ user: req.user!.id });

    if (!cart) {
      // Create new cart if it doesn't exist
      cart = await Cart.create({
        user: req.user!.id,
        items: [{ product: productId, quantity, price: product.price }],
        totalPrice: product.price * quantity,
      });
    } else {
      // Check if product already in cart
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingItemIndex > -1) {
        // Update quantity if product already in cart
        cart.items[existingItemIndex].quantity = quantity;
      } else {
        // Add new item to cart
        cart.items.push({
          product: productId as any,
          quantity,
          price: product.price,
        });
      }

      // Recalculate total price
      cart.totalPrice = cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      // Save updated cart
      await cart.save();
    }

    // Return cart with populated product info
    cart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select: "name price images",
    });

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// Remove item from cart
export const removeCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;

    // Get user cart
    let cart = await Cart.findOne({ user: req.user!.id });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // Filter out the item
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    // Recalculate total price
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // Save updated cart
    await cart.save();

    // Return cart with populated product info
    cart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select: "name price images",
    });

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};
// Clear cart
export const clearCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cart = await Cart.findOne({ user: req.user!.id });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};
