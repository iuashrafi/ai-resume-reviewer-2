// src/routes/resumeRoutes.ts
import { Router } from "express";
import multer from "multer";
import { ResumeController } from "../controllers/resumeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router: Router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

// All routes are protected
router.use(authMiddleware);

// Resume analysis routes
router.post(
  "/upload",
  upload.single("resume"),
  ResumeController.uploadAndAnalyze
);
router.get("/analyses", ResumeController.getUserAnalyses);
router.get("/analyses/search", ResumeController.searchAnalyses);
router.get("/analyses/stats", ResumeController.getAnalysisStats);
router.get("/analyses/:id", ResumeController.getAnalysisById);
router.put("/analyses/:id", ResumeController.updateAnalysis);
router.delete("/analyses/:id", ResumeController.deleteAnalysis);
router.get("/job-categories", ResumeController.getJobCategories);

export default router;
