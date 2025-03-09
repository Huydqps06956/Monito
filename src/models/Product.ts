import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: mongoose.Types.ObjectId;
  countInStock: number;
  isAccessory: boolean;
  brand?: string;
  features?: string[];
  ageGroup?: string;
  size?: string;
  weight?: number;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, "Please add a product name"],
    trim: true,
    maxlength: [100, "Name cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
    min: [0, "Price must be positive"],
  },
  images: {
    type: [String],
    required: [true, "Please add at least one image"],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  isAccessory: {
    type: Boolean,
    required: true,
    default: false,
  },
  brand: {
    type: String,
  },
  features: {
    type: [String],
  },
  ageGroup: {
    type: String,
  },
  size: {
    type: String,
  },
  weight: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add indexing for search functionality
ProductSchema.index({ name: "text", description: "text" });

export default mongoose.model<IProduct>("Product", ProductSchema);
