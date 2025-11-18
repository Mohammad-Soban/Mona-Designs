import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  _id?: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  title: string;
  price: number;
  qty: number;
  size?: string;
  color?: string;
  options?: Record<string, any>;
}

export interface ICart extends Document {
  _id: string;
  userId?: mongoose.Types.ObjectId; // nullable for guest carts
  items: ICartItem[];
  updatedAt: Date;
}

const cartSchema = new Schema<ICart>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    sparse: true, // allows null values but ensures uniqueness when present
  },
  items: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
    },
    size: String,
    color: String,
    options: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  }],
}, {
  timestamps: { createdAt: false, updatedAt: true },
});

// Index for userId
cartSchema.index({ userId: 1 });

export const Cart = mongoose.model<ICart>('Cart', cartSchema);
