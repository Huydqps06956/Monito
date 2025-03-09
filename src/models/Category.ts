import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  parent?: mongoose.Types.ObjectId;
}

const CategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, "Please add a category name"],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

export default mongoose.model<ICategory>("Category", CategorySchema);
