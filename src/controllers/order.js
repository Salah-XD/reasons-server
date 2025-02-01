import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create Order with Shipping
export const createOrder = async (req, res) => {
  try {
    const { id: userId } = req.user; // Extract user ID from middleware
    const { addressId, name, phone, shippingNotes } = req.body.shipping; // Shipping details

    // Check if address exists
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });
    if (!address) {
      return res.status(404).json({ error: "Address not found." });
    }

    // Fetch user's cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { cart: { userId } },
      include: { product: true },
    });
    if (!cartItems.length) {
      return res.status(400).json({ error: "Cart is empty." });
    }

    // Calculate total price
    let totalPrice = cartItems.reduce(
      (total, item) => total + item.quantity * item.product.discountedPrice,
      0
    );

    // Create order with nested order items and shipping
    const order = await prisma.order.create({
      data: {
        userId,
        totalPrice,
        orderItems: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.discountedPrice,
          })),
        },
        shipping: {
          create: {
            name,
            phone,
            addressId,
            shippingNotes,
          },
        },
      },
      include: { orderItems: true, shipping: true },
    });

    // Clear user's cart after order placement
    await prisma.cartItem.deleteMany({
      where: { cart: { userId } },
    });

    return res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get Order Details
export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: { include: { product: true } },
        shipping: { include: { address: true } },
        payment: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].includes(status)) {
      return res.status(400).json({ error: "Invalid order status." });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update Shipping Status & Tracking
export const updateShippingStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber } = req.body;

    // Validate status
    if (!["PENDING", "DISPATCHED", "IN_TRANSIT", "DELIVERED"].includes(status)) {
      return res.status(400).json({ error: "Invalid shipping status." });
    }

    const shipping = await prisma.shipping.update({
      where: { orderId },
      data: { status, trackingNumber },
    });

    return res.status(200).json({
      message: "Shipping status updated successfully",
      shipping,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get Order List for User
export const getUserOrders = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { orderItems: true, shipping: true, payment: true },
    });

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
