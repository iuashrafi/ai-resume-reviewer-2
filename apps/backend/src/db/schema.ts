// src/db/schema.ts
import {
  pgTable,
  text,
  serial,
  integer,
  json,
  timestamp,
  varchar,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  profileImageUrl: varchar("profile_image_url", { length: 500 }),
  isEmailVerified: varchar("is_email_verified").default("false"),
  refreshToken: text("refresh_token"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Resume analyses table
export const resumeAnalyses = pgTable("resume_analyses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  fileName: text("file_name").notNull(),
  jobCategory: text("job_category").notNull(),
  fullName: text("full_name"),
  overallScore: integer("overall_score").notNull(),
  sections: json("sections").notNull(),
  summary: text("summary").notNull(),
  suggestedFixes: json("suggested_fixes").notNull(),
  atsScore: json("ats_score").notNull(),
  originalText: text("original_text"),
  highlightedText: json("highlighted_text"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Job categories enum
export const jobCategories = [
  "software-developer",
  "data-engineer",
  "founders-office",
  "product-manager",
  "devops-engineer",
  "ui-ux-designer",
] as const;

export const jobCategorySchema = z.enum(jobCategories);

// Resume analysis schemas
export const sectionAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string(),
});

export const highlightedTextSchema = z.object({
  text: z.string(),
  type: z.enum(["strength", "weakness", "neutral"]),
  section: z.string().optional(),
  reason: z.string().optional(),
});

export const resumeAnalysisSchema = z.object({
  fullName: z.string(),
  jobCategory: jobCategorySchema,
  overallScore: z.number().min(0).max(100),
  sections: z.object({
    education: sectionAnalysisSchema,
    experience: sectionAnalysisSchema,
    skills: sectionAnalysisSchema,
    projects: sectionAnalysisSchema.optional(),
  }),
  summary: z.string(),
  suggestedFixes: z.record(z.string()),
  atsScore: z.object({
    format: z.number().min(0).max(100),
    keywords: z.number().min(0).max(100),
    readability: z.number().min(0).max(100),
  }),
  originalText: z.string().optional(),
  highlightedText: z.array(highlightedTextSchema).optional(),
});

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const insertResumeAnalysisSchema = createInsertSchema(
  resumeAnalyses
).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type ResumeAnalysis = typeof resumeAnalyses.$inferSelect;
export type NewResumeAnalysis = typeof resumeAnalyses.$inferInsert;
export type JobCategory = z.infer<typeof jobCategorySchema>;
export type HighlightedText = z.infer<typeof highlightedTextSchema>;
export type ResumeAnalysisResult = z.infer<typeof resumeAnalysisSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
