import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import { clearCache } from '../middlewares/redisCache';

// Get all products
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let query;
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Base query
    query = Product.find(JSON.parse(queryStr)).populate('category');

    // Search functionality
    if (req.query.search) {
      query = Product.find({
        $text: { $search: req.query.search as string }
      }).populate('category');
    }

    // Select fields
    if (req.query.select) {
      const fields = (req.query.select as string).split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const products = await query;

    // Pagination result
    const pagination: any = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: products.length,
      pagination,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// Get single product
export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// Create new product
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.create(req.body);
    
    // Clear products cache
    await clearCache('__express__/api/products*');
    
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // Clear product cache
    await clearCache(`__express__/api/products/${req.params.id}`);
    await clearCache('__express__/api/products*');
    
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // Clear product cache
    await clearCache(`__express__/api/products/${req.params.id}`);
    await clearCache('__express__/api/products*');

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};