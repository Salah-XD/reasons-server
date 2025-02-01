import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🚀 Create a New Product
export const createProduct = async (req, res) => {
  try {
    const {
        name,
        description,
        actualPrice,
        discountedPrice,
        material,
        size,
        countryOrigin,
        careInstructions,
        manufacturedBy,
        sku,
        tags,
        categoryId,
        imageUrl, // FIXED: Renamed to match request body
      } = req.body;
      
      if (!name || !actualPrice || !categoryId || !imageUrl || imageUrl.length === 0) {
        return res.status(400).json({ error: "Name, price, category, and at least one image URL are required." });
      }
      
      // Correctly map image URLs
      const product = await prisma.product.create({
        data: {
          name,
          description,
          actualPrice,
          discountedPrice,
          material,
          size,
          countryOrigin,
          careInstructions,
          manufacturedBy,
          sku,
          tags,
          categoryId,
          images: { create: imageUrl.map((url) => ({ imageUrl: url })) }

        },
        include: { images: true },
      });
      

    return res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 📌 Get All Products with Filters & Search
export const getAllProducts = async (req, res) => {
  try {
    const { categoryId, tag, search } = req.query;

    const products = await prisma.product.findMany({
      where: {
        ...(categoryId && { categoryId }),
        ...(tag && { tags: { has: tag } }),
        ...(search && { name: { contains: search, mode: "insensitive" } }),
      },
      include: { images: true, reviews: true, category: true }, // Include category & reviews
    });

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 🔍 Get a Single Product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true, reviews: true, category: true },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ✏️ Update a Product
export const updateProduct = async (req, res) => {
    try {
      const { id } = req.params;
      let { imageUrl, categoryId, ...data } = req.body;
  
      const existingProduct = await prisma.product.findUnique({
        where: { id },
        include: { images: true },
      });
  
      if (!existingProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      // Convert categoryId to proper format
      if (categoryId) {
        data.category = { connect: { id: categoryId } };
      }
  
      // Update product details (excluding images for now)
      const updatedProduct = await prisma.product.update({
        where: { id },
        data,
        include: { images: true },
      });
  
      // If imageUrl array is provided, update images
      if (imageUrl && Array.isArray(imageUrl)) {
        // Delete existing images
        await prisma.productImage.deleteMany({
          where: { productId: id },
        });
  
        // Add new images
        await prisma.product.update({
          where: { id },
          data: {
            images: {
              create: imageUrl.map((url) => ({ imageUrl: url })),
            },
          },
        });
      }
  
      return res.status(200).json({ message: "Product updated successfully", updatedProduct });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  

// 🗑 Delete a Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({ where: { id } });

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
