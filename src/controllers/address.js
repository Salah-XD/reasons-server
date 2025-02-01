import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Create Address
export const createAddress = async (req, res) => {
  try {
    const { id: userId } = req.user; // Fetch userId from middleware
    const { address, city, state, postalCode, country } = req.body;

    // Validate required fields
    if (!address || !city || !state || !postalCode || !country) {
      return res.status(400).json({ error: "All address fields are required." });
    }

    // Create a new address
    const newAddress = await prisma.address.create({
      data: {
        userId,
        address,
        city,
        state,
        postalCode,
        country,
      },
    });

    return res.status(201).json({
      message: "Address created successfully.",
      address: newAddress,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get All Addresses for a User
export const getUserAddresses = async (req, res) => {
  try {
    const { id: userId } = req.user; // Fetch userId from middleware

    // Fetch all addresses for the user
    const addresses = await prisma.address.findMany({
      where: { userId },
    });

    return res.status(200).json({ addresses });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get Single Address by ID
export const getAddressById = async (req, res) => {
  try {
    const { id: userId } = req.user; // Fetch userId from middleware
    const { addressId } = req.params; // Address ID from URL params

    // Fetch the address by ID and ensure it belongs to the user
    const address = await prisma.address.findUnique({
      where: { id: addressId, userId },
    });

    if (!address) {
      return res.status(404).json({ error: "Address not found." });
    }

    return res.status(200).json({ address });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update Address
export const updateAddress = async (req, res) => {
  try {
    const { id: userId } = req.user; // Fetch userId from middleware
    const { addressId } = req.params; // Address ID from URL params
    const { address, city, state, postalCode, country } = req.body;

    // Validate required fields
    if (!address || !city || !state || !postalCode || !country) {
      return res.status(400).json({ error: "All address fields are required." });
    }

    // Update the address
    const updatedAddress = await prisma.address.update({
      where: { id: addressId, userId },
      data: {
        address,
        city,
        state,
        postalCode,
        country,
      },
    });

    return res.status(200).json({
      message: "Address updated successfully.",
      address: updatedAddress,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete Address
export const deleteAddress = async (req, res) => {
  try {
    const { id: userId } = req.user; // Fetch userId from middleware
    const { addressId } = req.params; // Address ID from URL params

    // Verify the address exists and belongs to the user
    const address = await prisma.address.findUnique({
      where: { id: addressId, userId },
    });

    if (!address) {
      return res.status(404).json({ error: "Address not found." });
    }

    // Delete the address
    await prisma.address.delete({
      where: { id: addressId },
    });

    return res.status(200).json({ message: "Address deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};