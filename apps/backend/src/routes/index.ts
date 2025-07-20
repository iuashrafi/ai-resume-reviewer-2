// src/routes/index.ts
import { Router, Request, Response } from "express";
import authRoutes from "./authRoutes.js";
import resumeRoutes from "./resumeRoutes.js";

const router: Router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.status(200).send("Hello world!");
});

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API routes
router.use("/auth", authRoutes);
// router.use("/resume", resumeRoutes);

export default router;
