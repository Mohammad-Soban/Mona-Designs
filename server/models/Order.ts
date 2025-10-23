import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  title: string;
  price: number;
  qty: number;
  size?: string;
  color?: string;
  options?: Record<string, any>;
}

export interface IAddress {
  label: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IPaymentDetails {
  provider: string;
  orderId: string; // Razorpay order ID
  paymentId?: string; // Razorpay payment ID
  signature?: string;
  method?: string;
  captured: boolean;
}

export interface IOrder extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IAddress;
  billingAddress: IAddress;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  status: 'pending' | 'created' | 'paid' | 'failed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment: IPaymentDetails;
  receiptId: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
  shippingAddress: {
    label: String,
    line1: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  billingAddress: {
    label: String,
    line1: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  shipping: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  tax: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  status: {
    type: String,
    enum: ['pending', 'created', 'paid', 'failed', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
  },
  payment: {
    provider: {
      type: String,
      default: 'razorpay',
    },
    orderId: {
      type: String,
      required: true,
    },
    paymentId: String,
    signature: String,
    method: String,
    captured: {
      type: Boolean,
      default: false,
    },
  },
  receiptId: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
});

// Indexes
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ receiptId: 1 });
orderSchema.index({ 'payment.orderId': 1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);
