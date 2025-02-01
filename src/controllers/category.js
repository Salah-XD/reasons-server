import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Category name is required." });

    const existingCategory = await prisma.category.findUnique({ where: { name } });
    if (existingCategory) return res.status(400).json({ error: "Category already exists." });

    const category = await prisma.category.create({ data: { name } });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({ include: { products: true } });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get a single category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!category) return res.status(404).json({ error: "Category not found." });

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update a category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: "Category name is required." });

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name },
    });

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.category.delete({ where: { id } });

    res.status(200).json({ message: "Category deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
