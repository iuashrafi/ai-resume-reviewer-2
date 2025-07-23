import axios from "axios";
import Cookies from "js-cookie";
import { CookieNames } from "@/types/enum";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get(CookieNames.jwtToken);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Clear invalid token
//       Cookies.remove("auth-token");
//       // Redirect to login if needed
//       if (typeof window !== "undefined") {
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// Types
export interface JobCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface SectionAnalysis {
  score: number;
  feedback: string;
}

export interface HighlightedText {
  text: string;
  type: "strength" | "weakness" | "neutral";
  section?: string;
  reason?: string;
}

export interface ResumeAnalysis {
  id: number;
  userId: number;
  fileName: string;
  jobCategory: string;
  fullName: string;
  overallScore: number;
  sections: {
    education: SectionAnalysis;
    experience: SectionAnalysis;
    skills: SectionAnalysis;
    projects?: SectionAnalysis;
  };
  summary: string;
  suggestedFixes: Record<string, string>;
  atsScore: {
    format: number;
    keywords: number;
    readability: number;
  };
  originalText?: string;
  highlightedText?: HighlightedText[];
  createdAt: string;
}

export interface AnalysisStats {
  totalAnalyses: number;
  averageScore: number;
  lastAnalysis: string | null;
  topJobCategory: string | null;
  scoreImprovement: number;
}

// Resume API functions
export const resumeApi = {
  // Upload and analyze resume
  uploadResume: async (
    file: File,
    jobCategory: string
  ): Promise<ResumeAnalysis> => {
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobCategory", jobCategory);

    const response = await api.post("/api/resume/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Get all user analyses
  getAnalyses: async (): Promise<ResumeAnalysis[]> => {
    const response = await api.get("/api/resume/analyses");
    return response.data;
  },

  // Get specific analysis
  getAnalysis: async (id: number): Promise<ResumeAnalysis> => {
    const response = await api.get(`/api/resume/analyses/${id}`);
    return response.data;
  },

  // Delete analysis
  deleteAnalysis: async (id: number): Promise<void> => {
    await api.delete(`/api/resume/analyses/${id}`);
  },

  // Get job categories
  getJobCategories: async (): Promise<JobCategory[]> => {
    const response = await api.get("/api/resume/job-categories");
    return response.data;
  },

  // Get analysis statistics
  getAnalysisStats: async (): Promise<AnalysisStats> => {
    const response = await api.get("/api/resume/analyses/stats");
    return response.data;
  },

  // Search analyses
  searchAnalyses: async (params: {
    search?: string;
    jobCategory?: string;
    minScore?: number;
    maxScore?: number;
    limit?: number;
    offset?: number;
  }): Promise<ResumeAnalysis[]> => {
    const response = await api.get("/api/resume/analyses/search", { params });
    return response.data;
  },
};
