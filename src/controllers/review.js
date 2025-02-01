import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Add Review Controller
export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const { id: userId } = req.user; // Get user ID from middleware

    if (!productId || !rating) {
      return res.status(400).json({ error: "Product ID and rating are required." });
    }

    // Ensure the product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Check if the user has already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: { productId, userId },
    });

    if (existingReview) {
      return res.status(400).json({ error: "You have already reviewed this product." });
    }

    // Create the new review
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId,
        productId,
      },
    });

    return res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// Update Review Controller
export const updateReview = async (req, res) => {
    try {
      const { id: userId } = req.user; // Get user ID from middleware
      const { productId, rating, comment } = req.body;
      const { reviewId } = req.params; // Ensure we're correctly accessing the review ID
  
      if (!rating && !comment) {
        return res.status(400).json({ error: "Rating or comment is required." });
      }
  
      // Ensure the review exists and belongs to the user
      const review = await prisma.review.findUnique({
        where: { id: reviewId }, // Fixed: Ensure we're passing the correct review ID
      });
  
      if (!review) {
        return res.status(404).json({ error: "Review not found." });
      }
  
      if (review.userId !== userId) {
        return res.status(403).json({ error: "You can only update your own reviews." });
      }
  
      // Update the review
      const updatedReview = await prisma.review.update({
        where: { id: reviewId }, // Ensure we're using the correct review ID
        data: {
          rating: rating !== undefined ? rating : review.rating,
          comment: comment !== undefined ? comment : review.comment,
        },
      });
  
      return res.status(200).json({ message: "Review updated successfully", updatedReview });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  
  
  // Delete Review Controller
export const deleteReview = async (req, res) => {
    try {
      const { id: userId } = req.user; // Get user ID from middleware
      const { reviewId } = req.params; // Review ID to be deleted
  
      // Ensure the review exists and belongs to the user
      const review = await prisma.review.findUnique({
        where: { id: reviewId },
      });
  
      if (!review) {
        return res.status(404).json({ error: "Review not found." });
      }
  
      if (review.userId !== userId) {
        return res.status(403).json({ error: "You can only delete your own reviews." });
      }
  
      // Delete the review
      await prisma.review.delete({
        where: { id: reviewId },
      });
  
      return res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  
