// src/app/resume/analysis/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { resumeApi, ResumeAnalysis } from "@/lib/api";
import {
  ArrowLeft,
  Download,
  Share2,
  FileText,
  BarChart3,
  Lightbulb,
  Eye,
  Search,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
import { ResultsDisplay } from "@/components/results-display";

export default function AnalysisResultPage() {
  const params = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "detailed" | "resume"
  >("overview");

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const id = parseInt(params.id as string);
        const data = await resumeApi.getAnalysis(id);
        setAnalysis(data);
      } catch (error: any) {
        console.error("Failed to fetch analysis:", error);
        toast.error("Analysis not found");
        // router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchAnalysis();
    }
  }, [params.id, router]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return "bg-green-600";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const formatJobCategory = (category: string) => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 mb-4">
            The analysis you're looking for could not be found.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }
  if (analysis) return <ResultsDisplay analysis={analysis} />;
  else return <div>Analysis is not available</div>;
}
