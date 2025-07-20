// src/controllers/authController.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db, users, registerSchema, loginSchema } from "../db/index.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/auth.types.js";
import { id } from "zod/v4/locales";

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { email, password, firstName, lastName } = validatedData;

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email: email,
        password: hashedPassword,
        firstName,
        lastName,
      })
      .returning({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
      });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const userData = {
      userId: user.id,
    };

    const token = jwt.sign(userData, "qwerty", {
      expiresIn: "7d",
    });

    res.status(200).json({ token, userData });
    return;
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.user;

    if (!req.user || !userId) {
      console.log("User does not exists in req");
      throw new Error("User does not exists in req");
    }

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ user });

    res.status(200).json({ data: req.user });
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

export class AuthController {
  // static async register(req: Request, res: Response) {
  //   try {
  //     const validatedData = registerSchema.parse(req.body);
  //     // Check if user already exists
  //     const [existingUser] = await db
  //       .select()
  //       .from(users)
  //       .where(eq(users.email, validatedData.email));
  //     if (existingUser) {
  //       return res.status(400).json({ message: "User already exists" });
  //     }
  //     // Hash password
  //     const hashedPassword = await bcrypt.hash(validatedData.password, 12);
  //     // Create user
  //     const [newUser] = await db
  //       .insert(users)
  //       .values({
  //         email: validatedData.email,
  //         password: hashedPassword,
  //         firstName: validatedData.firstName,
  //         lastName: validatedData.lastName,
  //       })
  //       .returning({
  //         id: users.id,
  //         email: users.email,
  //         firstName: users.firstName,
  //         lastName: users.lastName,
  //       });
  //     // Generate tokens
  //     const { accessToken, refreshToken } = generateTokens(newUser.id);
  //     // Store refresh token in database
  //     await db
  //       .update(users)
  //       .set({ refreshToken })
  //       .where(eq(users.id, newUser.id));
  //     // Set cookies
  //     res.cookie("accessToken", accessToken, {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === "production",
  //       sameSite: "strict",
  //       maxAge: 15 * 60 * 1000, // 15 minutes
  //     });
  //     res.cookie("refreshToken", refreshToken, {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === "production",
  //       sameSite: "strict",
  //       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  //     });
  //     res.status(201).json({
  //       message: "User created successfully",
  //       user: newUser,
  //     });
  //   } catch (error) {
  //     console.error("Registration error:", error);
  //     res.status(500).json({ message: "Internal server error" });
  //   }
  // }
  // static async login(req: Request, res: Response) {
  //   try {
  //     const validatedData = loginSchema.parse(req.body);
  //     // Find user
  //     const [user] = await db
  //       .select()
  //       .from(users)
  //       .where(eq(users.email, validatedData.email));
  //     if (!user) {
  //       return res.status(400).json({ message: "Invalid credentials" });
  //     }
  //     // Check password
  //     const isValidPassword = await bcrypt.compare(
  //       validatedData.password,
  //       user.password
  //     );
  //     if (!isValidPassword) {
  //       return res.status(400).json({ message: "Invalid credentials" });
  //     }
  //     // Generate tokens
  //     const { accessToken, refreshToken } = generateTokens(user.id);
  //     // Store refresh token in database
  //     await db.update(users).set({ refreshToken }).where(eq(users.id, user.id));
  //     // Set cookies
  //     res.cookie("accessToken", accessToken, {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === "production",
  //       sameSite: "strict",
  //       maxAge: 15 * 60 * 1000, // 15 minutes
  //     });
  //     res.cookie("refreshToken", refreshToken, {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === "production",
  //       sameSite: "strict",
  //       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  //     });
  //     const {
  //       password: _,
  //       refreshToken: __,
  //       ...userWithoutSensitiveData
  //     } = user;
  //     res.json({
  //       message: "Login successful",
  //       user: userWithoutSensitiveData,
  //     });
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     res.status(500).json({ message: "Internal server error" });
  //   }
  // }
  // static async refreshToken(req: Request, res: Response) {
  //   try {
  //     const refreshToken = req.cookies.refreshToken;
  //     if (!refreshToken) {
  //       return res.status(401).json({ message: "Refresh token required" });
  //     }
  //     // Verify refresh token
  //     const decoded = verifyRefreshToken(refreshToken);
  //     // Check if refresh token exists in database
  //     const [user] = await db
  //       .select()
  //       .from(users)
  //       .where(eq(users.id, decoded.userId));
  //     if (!user || user.refreshToken !== refreshToken) {
  //       return res.status(403).json({ message: "Invalid refresh token" });
  //     }
  //     // Generate new tokens
  //     const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
  //       generateTokens(user.id);
  //     // Update refresh token in database
  //     await db
  //       .update(users)
  //       .set({ refreshToken: newRefreshToken })
  //       .where(eq(users.id, user.id));
  //     // Set new cookies
  //     res.cookie("accessToken", newAccessToken, {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === "production",
  //       sameSite: "strict",
  //       maxAge: 15 * 60 * 1000, // 15 minutes
  //     });
  //     res.cookie("refreshToken", newRefreshToken, {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === "production",
  //       sameSite: "strict",
  //       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  //     });
  //     res.json({ message: "Tokens refreshed successfully" });
  //   } catch (error) {
  //     console.error("Refresh token error:", error);
  //     res.status(403).json({ message: "Invalid refresh token" });
  //   }
  // }
  // static async logout(req: AuthRequest, res: Response) {
  //   try {
  //     const userId = req.user?.id;
  //     if (userId) {
  //       // Remove refresh token from database
  //       await db
  //         .update(users)
  //         .set({ refreshToken: null })
  //         .where(eq(users.id, userId));
  //     }
  //     // Clear cookies
  //     res.clearCookie("accessToken");
  //     res.clearCookie("refreshToken");
  //     res.json({ message: "Logout successful" });
  //   } catch (error) {
  //     console.error("Logout error:", error);
  //     res.status(500).json({ message: "Internal server error" });
  //   }
  // }
  // static async getProfile(req: AuthRequest, res: Response) {
  //   try {
  //     const userId = req.user?.id;
  //     const [user] = await db
  //       .select({
  //         id: users.id,
  //         email: users.email,
  //         firstName: users.firstName,
  //         lastName: users.lastName,
  //         profileImageUrl: users.profileImageUrl,
  //         createdAt: users.createdAt,
  //       })
  //       .from(users)
  //       .where(eq(users.id, userId!));
  //     if (!user) {
  //       return res.status(404).json({ message: "User not found" });
  //     }
  //     res.json({ user });
  //   } catch (error) {
  //     console.error("Get profile error:", error);
  //     res.status(500).json({ message: "Internal server error" });
  //   }
  // }
}
