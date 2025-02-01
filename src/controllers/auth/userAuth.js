import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export const registerUser = async (req, res) => {
    try {
      const { name, email, password, phone } = req.body;
  
      if (!name || !email || !password || !phone) {
        return res.status(400).json({ error: "All fields are required." });
      }
  
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists with this email." });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, phone },
      });
  
      const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "7d" });
  
      res.status(201).json({ message: "User registered successfully", user, token });
    } catch (error) {
      // 🚨 Fix: Return error response, not throw it again
      res.status(500).json({ error: error.message });
    }
  };
  

// User Login
export const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
      }
  
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials." });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ error: "Invalid credentials." });
      }
  
      const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "7d" });
  
      return res.status(200).json({ message: "Login successful", user, token });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  
