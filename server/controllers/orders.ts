import { Request, Response } from 'express';
import { z } from 'zod';
import { Cart, ICart } from '../models/Cart';
import { Order, IOrder } from '../models/Order';
import { Product } from '../models/Product';
import { AuthRequest } from '../middleware/auth';

// Validation schemas
const addToCartSchema = z.object({
  body: z.object({
    productId: z.string(),
    qty: z.number().min(1),
    size: z.string().optional(),
    color: z.string().optional(),
    options: z.record(z.any()).optional(),
  }),
});

const updateCartItemSchema = z.object({
  params: z.object({
    itemId: z.string(),
  }),
  body: z.object({
    qty: z.number().min(1),
  }),
});

const createOrderSchema = z.object({
  body: z.object({
    items: z.array(z.object({
      productId: z.string(),
      title: z.string(),
      price: z.number(),
      qty: z.number().min(1),
      size: z.string().optional(),
      color: z.string().optional(),
      options: z.record(z.any()).optional(),
    })),
    shippingAddress: z.object({
      label: z.string().optional(),
      line1: z.string(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      country: z.string(),
    }),
    billingAddress: z.object({
      label: z.string().optional(),
      line1: z.string(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      country: z.string(),
    }),
    paymentMethod: z.string().default('razorpay'),
  }),
});

// Get user cart
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;

    let cart = await Cart.findOne({ userId }).populate('items.productId', 'title price images');
    
    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }

    // Transform cart items to match frontend expectations
    const transformedItems = cart.items.map(item => ({
      id: item.productId._id,
      name: (item.productId as any).title,
      price: `₹${(item.price / 100).toLocaleString()}`,
      image: (item.productId as any).images?.find((img: any) => img.role === 'thumbnail')?.url || (item.productId as any).images?.[0]?.url || '',
      category: 'General', // Default category
      rating: 4.5,
      quantity: item.qty,
      size: item.size,
      color: item.color,
      options: item.options,
    }));

    res.json({
      success: true,
      cart: {
        items: transformedItems,
        isOpen: false, // This is handled by frontend
      },
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
    });
  }
};

// Add item to cart
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { productId, qty, size, color, options } = req.body;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check stock
    if (product.stock < qty) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock',
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if item already exists with same size/color
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId && 
              item.size === size && 
              item.color === color
    );

    if (existingItemIndex >= 0) {
      // Update quantity
      cart.items[existingItemIndex].qty += qty;
    } else {
      // Add new item
      cart.items.push({
        productId: product._id as any,
        title: product.title,
        price: product.price,
        qty,
        size,
        color,
        options,
      });
    }

    await cart.save();

    res.json({
      success: true,
      message: 'Item added to cart',
      cart: cart.items,
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
    });
  }
};

// Update cart item quantity
export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { itemId } = req.params;
    const { qty } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const itemIndex = cart.items.findIndex(item => item._id?.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    if (qty <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].qty = qty;
    }

    await cart.save();

    res.json({
      success: true,
      message: 'Cart updated',
      cart: cart.items,
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart',
    });
  }
};

// Remove item from cart
export const removeCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const itemIndex = cart.items.findIndex(item => item._id?.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: cart.items,
    });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
    });
  }
};

// Clear cart
export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;

    await Cart.findOneAndUpdate({ userId }, { items: [] });

    res.json({
      success: true,
      message: 'Cart cleared',
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
    });
  }
};

// Calculate order totals
const calculateOrderTotals = (items: any[]) => {
  const subtotal = items.reduce((total, item) => total + (item.price * item.qty), 0);
  const shipping = subtotal > 299900 ? 0 : 5000; // Free shipping above ₹2999
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + shipping + tax;

  return { subtotal, shipping, tax, total };
};

// Generate receipt ID
const generateReceiptId = (): string => {
  return `MONA-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// Create order
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { items, shippingAddress, billingAddress, paymentMethod } = req.body;

    // Verify all products exist and check stock
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.title} not found`,
        });
      }
      if (product.stock < item.qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.title}`,
        });
      }
    }

    // Calculate totals
    const { subtotal, shipping, tax, total } = calculateOrderTotals(items);

    // Create order
    const order = new Order({
      userId,
      items,
      shippingAddress,
      billingAddress,
      subtotal,
      shipping,
      tax,
      total,
      currency: 'INR',
      status: 'created',
      payment: {
        provider: paymentMethod,
        orderId: '', // Will be set when Razorpay order is created
        captured: false,
      },
      receiptId: generateReceiptId(),
    });

    await order.save();

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.qty } }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
    });
  }
};

// Get user orders
export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;

    const orders = await Order.find({ userId })
      .populate('items.productId', 'title images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
    });
  }
};

// Get order by ID
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    const order = await Order.findOne({ _id: id, userId })
      .populate('items.productId', 'title images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
    });
  }
};

// Update order status (admin)
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('items.productId', 'title images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      message: 'Order status updated',
      order,
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
    });
  }
};

// Get order statistics (Admin only)
export const getOrderStats = async (req: Request, res: Response) => {
  try {
    // Calculate current month stats
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Get this month's orders
    const thisMonthOrders = await Order.find({
      createdAt: { $gte: startOfMonth }
    });

    // Get last month's orders
    const lastMonthOrders = await Order.find({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    // Calculate revenue
    const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => sum + order.total, 0);
    const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + order.total, 0);

    // Calculate percentage changes
    const revenueChange = lastMonthRevenue > 0 
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
      : 0;

    const ordersChange = lastMonthOrders.length > 0
      ? ((thisMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length * 100).toFixed(1)
      : 0;

    res.json({
      totalRevenue: Math.round(thisMonthRevenue / 100), // Convert paise to rupees
      totalOrders: thisMonthOrders.length,
      revenueChange: parseFloat(revenueChange as string),
      ordersChange: parseFloat(ordersChange as string)
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      totalRevenue: 0,
      totalOrders: 0,
      revenueChange: 0,
      ordersChange: 0
    });
  }
};

export {
  addToCartSchema,
  updateCartItemSchema,
  createOrderSchema,
};
