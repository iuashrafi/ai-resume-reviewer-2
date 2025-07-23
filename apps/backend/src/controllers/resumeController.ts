// src/controllers/resumeController.ts
import { Response } from "express";
import { db, resumeAnalyses, jobCategorySchema } from "../db/index.js";
import { eq, desc } from "drizzle-orm";
import { analyzeResume } from "../services/resumeAnalyzer.js";
import { z } from "zod";
import { AuthenticatedRequest } from "../types/auth.types.js";

export const uploadAndAnalyze = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const file = req.file;
    const userId = req.user?.userId;

    if (!req.file) {
      res.status(400).json({ message: "No PDF file uploaded" });
      return;
    }

    console.log("file=", req.file);
    res.status(200).json({
      success: true,
      message: "Resume uploaded and analyzed successfully!",
    });
  } catch (error) {
    console.error("resume upload and analyse error:", error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to analyze resume",
    });
  }
};

/*
export class ResumeController {
  static async uploadAndAnalyze(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No PDF file uploaded" });
      }

      const { jobCategory } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Validate job category
      const validatedCategory = jobCategorySchema.parse(jobCategory);

      // Analyze resume
      const analysisResult = await analyzeResume(
        req.file.buffer,
        validatedCategory
      );

      // Store analysis result
      const [storedAnalysis] = await db
        .insert(resumeAnalyses)
        .values({
          userId: userId,
          fileName: req.file.originalname,
          jobCategory: validatedCategory,
          fullName: analysisResult.fullName,
          overallScore: analysisResult.overallScore,
          sections: analysisResult.sections,
          summary: analysisResult.summary,
          suggestedFixes: analysisResult.suggestedFixes,
          atsScore: analysisResult.atsScore,
          originalText: analysisResult.originalText,
          highlightedText: analysisResult.highlightedText,
        })
        .returning();

      res.json({
        id: storedAnalysis.id,
        ...analysisResult,
      });
    } catch (error) {
      console.error("Upload/analysis error:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid job category",
          errors: error.errors,
        });
      }

      res.status(500).json({
        message:
          error instanceof Error ? error.message : "Failed to analyze resume",
      });
    }
  }

  static async getAnalysisById(req: AuthenticatedRequest, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid analysis ID" });
      }

      const [analysis] = await db
        .select()
        .from(resumeAnalyses)
        .where(eq(resumeAnalyses.id, id));

      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }

      // Check if user owns this analysis
      const userId = req.user?.userId;
      if (analysis.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(analysis);
    } catch (error) {
      console.error("Get analysis error:", error);
      res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve analysis",
      });
    }
  }

  static async getUserAnalyses(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const analyses = await db
        .select()
        .from(resumeAnalyses)
        .where(eq(resumeAnalyses.userId, userId))
        .orderBy(desc(resumeAnalyses.createdAt));

      res.json(analyses);
    } catch (error) {
      console.error("Error fetching user analyses:", error);
      res.status(500).json({ message: "Failed to fetch analyses" });
    }
  }

  static async deleteAnalysis(req: AuthenticatedRequest, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid analysis ID" });
      }

      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Check if analysis exists and belongs to user
      const [analysis] = await db
        .select()
        .from(resumeAnalyses)
        .where(eq(resumeAnalyses.id, id));

      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }

      if (analysis.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Delete the analysis
      await db.delete(resumeAnalyses).where(eq(resumeAnalyses.id, id));

      res.json({ message: "Analysis deleted successfully" });
    } catch (error) {
      console.error("Delete analysis error:", error);
      res.status(500).json({ message: "Failed to delete analysis" });
    }
  }

  static async updateAnalysis(req: AuthenticatedRequest, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid analysis ID" });
      }

      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Check if analysis exists and belongs to user
      const [existingAnalysis] = await db
        .select()
        .from(resumeAnalyses)
        .where(eq(resumeAnalyses.id, id));

      if (!existingAnalysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }

      if (existingAnalysis.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Extract updatable fields from request body
      const { fileName } = req.body;

      const updateData: Partial<typeof resumeAnalyses.$inferInsert> = {};

      if (fileName && typeof fileName === "string") {
        updateData.fileName = fileName;
      }

      // Only update if there are fields to update
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }

      const [updatedAnalysis] = await db
        .update(resumeAnalyses)
        .set(updateData)
        .where(eq(resumeAnalyses.id, id))
        .returning();

      res.json(updatedAnalysis);
    } catch (error) {
      console.error("Update analysis error:", error);
      res.status(500).json({ message: "Failed to update analysis" });
    }
  }

  static getJobCategories(req: AuthenticatedRequest, res: Response) {
    const categories = [
      {
        id: "software-developer",
        name: "Software Developer",
        description: "Frontend, Backend, Full-stack",
        icon: "Code",
        color: "blue",
      },
      {
        id: "data-engineer",
        name: "Data Engineer",
        description: "ETL, Analytics, ML",
        icon: "Database",
        color: "green",
      },
      {
        id: "founders-office",
        name: "Founder's Office",
        description: "Strategy, Operations",
        icon: "Rocket",
        color: "purple",
      },
      {
        id: "product-manager",
        name: "Product Manager",
        description: "Strategy, Analytics",
        icon: "TrendingUp",
        color: "orange",
      },
      {
        id: "devops-engineer",
        name: "DevOps Engineer",
        description: "Infrastructure, CI/CD",
        icon: "Server",
        color: "red",
      },
      {
        id: "ui-ux-designer",
        name: "UI/UX Designer",
        description: "Design, Research",
        icon: "Palette",
        color: "pink",
      },
    ];

    res.json(categories);
  }

  static async getAnalysisStats(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Get all user analyses for stats calculation
      const analyses = await db
        .select({
          id: resumeAnalyses.id,
          overallScore: resumeAnalyses.overallScore,
          jobCategory: resumeAnalyses.jobCategory,
          createdAt: resumeAnalyses.createdAt,
        })
        .from(resumeAnalyses)
        .where(eq(resumeAnalyses.userId, userId))
        .orderBy(desc(resumeAnalyses.createdAt));

      if (analyses.length === 0) {
        return res.json({
          totalAnalyses: 0,
          averageScore: 0,
          lastAnalysis: null,
          topJobCategory: null,
          scoreImprovement: 0,
        });
      }

      // Calculate statistics
      const totalAnalyses = analyses.length;
      const averageScore = Math.round(
        analyses.reduce((sum, analysis) => sum + analysis.overallScore, 0) /
          totalAnalyses
      );
      const lastAnalysis = analyses[0]?.createdAt || null;

      // Find most common job category
      const jobCategoryCounts = analyses.reduce((acc, analysis) => {
        acc[analysis.jobCategory] = (acc[analysis.jobCategory] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topJobCategory =
        Object.entries(jobCategoryCounts).sort(
          ([, a], [, b]) => b - a
        )[0]?.[0] || null;

      // Calculate score improvement (compare first and last analysis)
      let scoreImprovement = 0;
      if (analyses.length >= 2) {
        const latestScore = analyses[0].overallScore;
        const firstScore = analyses[analyses.length - 1].overallScore;
        scoreImprovement = latestScore - firstScore;
      }

      res.json({
        totalAnalyses,
        averageScore,
        lastAnalysis,
        topJobCategory,
        scoreImprovement,
      });
    } catch (error) {
      console.error("Get analysis stats error:", error);
      res.status(500).json({ message: "Failed to get analysis statistics" });
    }
  }

  static async searchAnalyses(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const {
        search,
        jobCategory,
        minScore,
        maxScore,
        limit = 10,
        offset = 0,
      } = req.query;

      let query = db
        .select()
        .from(resumeAnalyses)
        .where(eq(resumeAnalyses.userId, userId));

      // Add search filters if provided
      if (search && typeof search === "string") {
        // Note: This is a simple implementation. For production, consider using full-text search
        // query = query.where(
        //   or(
        //     ilike(resumeAnalyses.fileName, `%${search}%`),
        //     ilike(resumeAnalyses.fullName, `%${search}%`)
        //   )
        // );
      }

      if (jobCategory && typeof jobCategory === "string") {
        // query = query.where(eq(resumeAnalyses.jobCategory, jobCategory));
      }

      if (minScore && typeof minScore === "string") {
        const min = parseInt(minScore);
        if (!isNaN(min)) {
          // query = query.where(gte(resumeAnalyses.overallScore, min));
        }
      }

      if (maxScore && typeof maxScore === "string") {
        const max = parseInt(maxScore);
        if (!isNaN(max)) {
          // query = query.where(lte(resumeAnalyses.overallScore, max));
        }
      }

      const analyses = await query
        .orderBy(desc(resumeAnalyses.createdAt))
        .limit(parseInt(limit as string) || 10)
        .offset(parseInt(offset as string) || 0);

      res.json(analyses);
    } catch (error) {
      console.error("Search analyses error:", error);
      res.status(500).json({ message: "Failed to search analyses" });
    }
  }
}

*/
