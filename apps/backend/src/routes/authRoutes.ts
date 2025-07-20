// src/routes/authRoutes.ts
import { Router } from "express";
import { getProfile, login, register } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router: Router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/profile", authMiddleware, getProfile);
// router.post("/logout", authMiddleware, AuthController.logout);

export default router;
