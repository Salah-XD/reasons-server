import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};
