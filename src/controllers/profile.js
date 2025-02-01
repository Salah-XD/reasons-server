import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Get User Profile
 * @route GET /api/profile
 * @access Private
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, createdAt: true,addresses:true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Update User Profile
 * @route PUT /api/profile
 * @access Private
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, phone },
      select: { id: true, name: true, email: true, phone: true, updatedAt: true },
    });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};

/**
 * Delete User Profile
 * @route DELETE /api/profile
 * @access Private
 */
export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    await prisma.user.delete({ where: { id: userId } });

    res.json({ message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete profile" });
  }
};
