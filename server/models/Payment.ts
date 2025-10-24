import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  _id: string;
  orderId?: mongoose.Types.ObjectId; // Make optional for guest payments
  providerPaymentId: string;
  providerOrderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'captured' | 'failed' | 'refunded';
  rawPayload?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: false, // Allow null for guest payments
  },
  providerPaymentId: {
    type: String,
    required: true,
  },
  providerOrderId: {
    type: String,
    required: true,
  },
  amount: {
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
    enum: ['pending', 'captured', 'failed', 'refunded'],
    default: 'pending',
  },
  rawPayload: {
    type: Map,
    of: Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

// Indexes
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ providerPaymentId: 1 });
paymentSchema.index({ providerOrderId: 1 });

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
