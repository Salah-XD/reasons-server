import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const addToWishlist = async (req, res) => {
    try {
      const { id: userId } = req.user;  // from user middleware
      const { productId } = req.body;
  
      if (!productId) {
        return res.status(400).json({ error: "Product ID is required." });
      }
  
      // Verify product exists
      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product) {
        return res.status(404).json({ error: "Product not found." });
      }
  
      // Find the user's wishlist or create one if not present
      let wishlist = await prisma.wishlist.findUnique({ where: { userId } });
  
      if (!wishlist) {
        wishlist = await prisma.wishlist.create({
          data: { userId },
        });
      }
  
      // Check if the product is already in the wishlist
      const existingWishlistItem = await prisma.wishlist.findFirst({
        where: {
          userId,
          products: {
            some: { id: productId }
          }
        },
      });
  
      if (existingWishlistItem) {
        return res.status(400).json({ message: "Product already in the wishlist." });
      }
  
      // Add product to wishlist
      const updatedWishlist = await prisma.wishlist.update({
        where: { userId },
        data: {
          products: {
            connect: { id: productId }
          },
        },
      });
  
      return res.status(200).json({
        message: "Product added to wishlist.",
        wishlist: updatedWishlist,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  
  export const removeFromWishlist = async (req, res) => {
    try {
      const { id: userId } = req.user;  // from user middleware
      const { productId } = req.body;
  
      if (!productId) {
        return res.status(400).json({ error: "Product ID is required." });
      }
  
      // Find the user's wishlist
      const wishlist = await prisma.wishlist.findUnique({ where: { userId } });
      if (!wishlist) {
        return res.status(404).json({ error: "Wishlist not found." });
      }
  
      // Check if the product exists in the wishlist
      const productInWishlist = await prisma.wishlist.findFirst({
        where: {
          userId,
          products: {
            some: { id: productId }
          }
        },
      });
  
      if (!productInWishlist) {
        return res.status(400).json({ error: "Product not in wishlist." });
      }
  
      // Remove product from wishlist
      const updatedWishlist = await prisma.wishlist.update({
        where: { userId },
        data: {
          products: {
            disconnect: { id: productId }
          }
        }
      });
  
      return res.status(200).json({
        message: "Product removed from wishlist.",
        wishlist: updatedWishlist,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  
  export const getWishlist = async (req, res) => {
    try {
      const { id: userId } = req.user;  // from user middleware
  
      // Find the user's wishlist
      const wishlist = await prisma.wishlist.findUnique({
        where: { userId },
        include: { products: true },  // Include all products in the wishlist
      });
  
      if (!wishlist) {
        return res.status(404).json({ error: "Wishlist not found." });
      }
  
      return res.status(200).json({ wishlist });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  export const clearWishlist = async (req, res) => {
  try {
    const { id: userId } = req.user;  // from user middleware

    // Find the user's wishlist
    const wishlist = await prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found." });
    }

    // Clear all products from the wishlist
    const updatedWishlist = await prisma.wishlist.update({
      where: { userId },
      data: {
        products: {
          set: []  // Remove all products from the wishlist
        }
      }
    });

    return res.status(200).json({
      message: "Wishlist cleared.",
      wishlist: updatedWishlist,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
