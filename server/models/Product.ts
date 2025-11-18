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

export interface IProductCategory {
  name: string;
  rank: number; // Lower rank = higher priority/position
}

export interface IProduct extends Document {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number; // in rupees
  currency: string;
  sku?: string;
  stock: number;
  categories: IProductCategory[];
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
    name: {
      type: String,
      required: true,
      enum: ['home', 'lehengas', 'kurtas', 'sherwanis', 'suits', 'accessories', 'wedding', 'reception', 'sangeet', 'mehendi', 'haldi', 'festivals', 'general', 'new-arrivals']
    },
    rank: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    }
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
      required: false,
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
    required: false,
  },
}, {
  timestamps: true,
});

// Indexes
// productSchema.index({ slug: 1 }); // Removed: slug already has unique: true
productSchema.index({ featured: 1 });
productSchema.index({ categories: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ title: 'text', description: 'text' });

// Ensure Maps (attributes, metadata) are converted to plain objects when
// documents are serialized to JSON or toObject. This makes it safe for the
// frontend to access fields like attributes.occasions without dealing with
// Mongoose Map instances.
productSchema.set('toJSON', {
  transform: (doc, ret) => {
    if (ret.attributes && ret.attributes instanceof Map) {
      ret.attributes = Object.fromEntries(ret.attributes);
    }
    if (ret.metadata && ret.metadata instanceof Map) {
      ret.metadata = Object.fromEntries(ret.metadata);
    }
    return ret;
  }
});

productSchema.set('toObject', {
  transform: (doc, ret) => {
    if (ret.attributes && ret.attributes instanceof Map) {
      ret.attributes = Object.fromEntries(ret.attributes);
    }
    if (ret.metadata && ret.metadata instanceof Map) {
      ret.metadata = Object.fromEntries(ret.metadata);
    }
    return ret;
  }
});

export const Product = mongoose.model<IProduct>('Product', productSchema);
