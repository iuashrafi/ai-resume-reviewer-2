// src/routes/authRoutes.ts
import { Router } from "express";
import {
  AuthController,
  login,
  register,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router: Router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
// router.post("/logout", authMiddleware, AuthController.logout);
// router.get("/profile", authMiddleware, AuthController.getProfile);

export default router;
