import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const addToCart = async (req, res) => {
    try {
      const { id: userId } = req.user; // from the user middleware
      const { productId, quantity = 1 } = req.body; // Default quantity to 1 if not provided
  
      // Check for required fields
      if (!productId) {
        return res.status(400).json({ error: "Product ID is required." });
      }
  
      // Validate quantity to ensure it's a positive number
      if (typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({ error: "Quantity must be a positive number." });
      }
  
      // Verify product exists
      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product) {
        return res.status(404).json({ error: "Product not found." });
      }
  
      // Find the cart for the user; if not found, create one.
      let cart = await prisma.cart.findUnique({ where: { userId } });
      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId },
        });
      }
  
      // Check if the product already exists in the cart (using cartId and productId)
      const existingCartItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
        },
      });
  
      if (existingCartItem) {
        // Update the quantity if it already exists
        const updatedCartItem = await prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + quantity },
        });
        return res.status(200).json({
          message: "Product quantity updated in the cart.",
          cartItem: updatedCartItem,
        });
      } else {
        // Otherwise, add a new cart item
        const newCartItem = await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
          },
        });
        return res.status(201).json({
          message: "Product added to cart.",
          cartItem: newCartItem,
        });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  

export const getCartItems = async (req, res) => {
    try {
      const { id: userId } = req.user;
  
      // Find the cart for the user and include cart items with product details
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          cartItems: {
            include: {
              product: true,
            },
          },
        },
      });
  
      // If no cart exists, return an empty list
      if (!cart) {
        return res.status(200).json({ cartItems: [] });
      }
  
      return res.status(200).json({ cartItems: cart.cartItems });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  
  export const updateCartItem = async (req, res) => {
    try {
      const { cartItemId } = req.params;
      const { quantity } = req.body; // Extract quantity fr  "productId": "1fc1b099-e67e-4065-8fd2-4af9ac43163e",
  
      // Ensure that the quantity is passed and is a positive number
      if (quantity && (typeof quantity !== "number" || quantity <= 0)) {
        return res.status(400).json({ error: "Quantity must be a positive number." });
      }
  
      // Set quantity to 1 if not provided (as it's the default value)
      const updatedQuantity = quantity || 1;
  
      const updatedCartItem = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity: updatedQuantity },
      });
  
      return res.status(200).json({
        message: "Cart item updated successfully",
        cartItem: updatedCartItem,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  
  
  
  export const removeCartItem = async (req, res) => {
    try {
      const { id: userId } = req.user;
      const { cartItemId } = req.params; // cartItemId from URL params
  
      if (!cartItemId) {
        return res.status(400).json({ error: "Cart item ID is required." });
      }
  
      // Find the cart item
      const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
      });
      if (!cartItem) {
        return res.status(404).json({ error: "Cart item not found." });
      }
  
      // Verify that the cart item belongs to the user
      const cart = await prisma.cart.findUnique({ where: { id: cartItem.cartId } });
      if (cart.userId !== userId) {
        return res.status(403).json({ error: "You can only remove your own cart items." });
      }
  
      // Delete the cart item
      await prisma.cartItem.delete({
        where: { id: cartItemId },
      });
  
      return res.status(200).json({ message: "Cart item removed." });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  