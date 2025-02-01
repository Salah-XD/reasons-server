import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      message: "Email and password are required" 
    });
  }

  try {
    const admin = await prisma.admin.findUnique({ 
      where: { email }
    });

    if (!admin) {
      return res.status(400).json({ 
        message: "Invalid email or password" 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ 
        message: "Invalid email or password" 
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined in environment variables");
      return res.status(500).json({ 
        message: "Internal server error" 
      });
    }

    const token = jwt.sign(
      { 
        id: admin.id, 
        role: "admin",
        name:admin.name
      }, 
      jwtSecret,
      {
        expiresIn: process.env.EXPIRES_IN || '24h'
      }
    );

    return res.status(200).json({ 
      message: "Admin login successful", 
      token 
    });

  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ 
      message: "An error occurred while processing your request" 
    });
  }
};

export { adminLogin };