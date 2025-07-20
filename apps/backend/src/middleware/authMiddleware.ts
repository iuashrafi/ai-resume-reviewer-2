import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest, User } from "../types/auth.types";
import "dotenv/config";
import { db, users } from "../db";
import { eq } from "drizzle-orm";

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      res.status(401).json({ message: "No token provided" });
      return;
    }
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token as string, "qwerty") as User;

    // Validate decoded payload shape
    if (!decoded.userId) {
      res.status(400).json({ message: "Invalid token payload" });
      return;
    }

    // Get user from database
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, decoded.userId));

    if (!user) {
      console.error("[AuthMiddleware] User does not exist:", decoded.userId);
      res.status(404).json({ message: "User does not exist" });
      return;
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("[AuthMiddleware] Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
