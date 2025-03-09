import { Request, Response, NextFunction } from "express";
import Order from "../models/Order";
import Cart from "../models/Cart";
import Product from "../models/Product";

// Create new order
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // Get user cart
    const cart = await Cart.findOne({ user: req.user!.id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty. Cannot create order.",
      });
    }

    // Check if all products are in stock
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product || product.countInStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Product ${
            product ? product.name : "Unknown"
          } is out of stock or not available in the requested quantity`,
        });
      }
    }

    // Create order
    const order = await Order.create({
      user: req.user!.id,
      orderItems: cart.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress,
      paymentMethod,
      totalPrice: cart.totalPrice,
    });

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { countInStock: -item.quantity },
      });
    }

    // Clear cart after order is created
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// Get all orders (admin)
export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await Order.find({}).populate({
      path: "user",
      select: "name email",
    });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// Get user orders
export const getUserOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await Order.find({ user: req.user!.id }).populate({
      path: "orderItems.product",
      select: "name images",
    });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// Get order by ID
export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: "user",
        select: "name email",
      })
      .populate({
        path: "orderItems.product",
        select: "name images",
      });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Check if user is owner or admin
    if (
      order.user._id.toString() !== req.user!.id &&
      req.user!.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this order",
      });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// Update order to paid
export const updateOrderToPaid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Update order status
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      updateTime: req.body.update_time,
    };

    const updatedOrder = await order.save();

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    next(error);
  }
};

// Update order to delivered
export const updateOrderToDelivered = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Check for admin permission
    if (req.user!.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update delivery status",
      });
    }

    // Update order status
    order.isDelivered = true;
    order.deliveredAt = new Date();

    const updatedOrder = await order.save();

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    next(error);
  }
};
