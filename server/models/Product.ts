import mongoose, { Document, Schema } from 'mongoose';

export interface IProductImage {
  _id?: mongoose.Types.ObjectId;
  url: string;
  public_id: string;
  alt: string;
  role: 'hero' | 'gallery' | 'thumbnail' | 'category';
  position: number;
}

export interface IProductSize {
  label: string;
  qty: number;
}

export interface IProductColor {
  label: string;
  hex: string;
}

export interface IProduct extends Document {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number; // in paise (smallest currency unit)
  currency: string;
  sku?: string;
  stock: number;
  categories: string[];
  tags: string[];
  sizes?: IProductSize[];
  colors?: IProductColor[];
  images: IProductImage[];
  attributes: Record<string, any>;
  isActive: boolean;
  featured: boolean;
  metadata: Record<string, any>;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  categories: [{
    type: String,
    required: true,
  }],
  tags: [String],
  sizes: [{
    label: String,
    qty: Number,
  }],
  colors: [{
    label: String,
    hex: String,
  }],
  images: [{
    url: {
      type: String,
      required: true,
    },
    public_id: String,
    alt: String,
    role: {
      type: String,
      enum: ['hero', 'gallery', 'thumbnail', 'category'],
      default: 'gallery',
    },
    position: {
      type: Number,
      default: 0,
    },
  }],
  attributes: {
    type: Map,
    of: Schema.Types.Mixed,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Indexes
productSchema.index({ slug: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ categories: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ title: 'text', description: 'text' });

export const Product = mongoose.model<IProduct>('Product', productSchema);
