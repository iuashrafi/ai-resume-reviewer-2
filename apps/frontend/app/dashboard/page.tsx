// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { resumeApi, ResumeAnalysis, AnalysisStats } from "@/lib/api";
import {
  Plus,
  FileText,
  Calendar,
  TrendingUp,
  BarChart3,
  Search,
  Filter,
  Trash2,
  Eye,
  LogOut,
  Loader2,
  ArrowRight,
  Badge,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthProvider";
import { Card } from "@/components/ui/card";
import { Progress } from "@radix-ui/react-progress";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const [analyses, setAnalyses] = useState<ResumeAnalysis[]>([]);
  const [stats, setStats] = useState<AnalysisStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");

  const fetchData = async () => {
    try {
      const [analysesData] = await Promise.all([
        resumeApi.getAnalyses(),
        // resumeApi.getAnalysisStats(),
      ]);
      setAnalyses(analysesData);
      // setStats(statsData);
    } catch (error: any) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteAnalysis = async (id: number) => {
    if (!confirm("Are you sure you want to delete this analysis?")) return;

    try {
      await resumeApi.deleteAnalysis(id);
      setAnalyses((prev) => prev.filter((analysis) => analysis.id !== id));
      toast.success("Analysis deleted successfully");
      // Refresh stats
      const newStats = await resumeApi.getAnalysisStats();
      setStats(newStats);
    } catch (error: any) {
      console.error("Failed to delete analysis:", error);
      toast.error("Failed to delete analysis");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-50";
    if (score >= 70) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const formatJobCategory = (category: string) => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const filteredAnalyses = analyses.filter((analysis) => {
    const matchesSearch =
      analysis.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !filterCategory || analysis.jobCategory === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = [...new Set(analyses.map((a) => a.jobCategory))];

  const handleViewAnalysis = (analysisId: number) => {
    router.push(`/results/${analysisId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user?.email || "User"}
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => {}} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Analysis
            </Button>
            {/* <Button
              variant="outline"
              onClick={() => {}}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button> */}
          </div>
        </div>

        {/* Stats Overview */}
        {analyses && analyses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 shadow-none rounded-md">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Analyses</p>
                  <p className="text-2xl font-bold">{analyses.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-none rounded-md">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ArrowRight className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold">
                    {Math.round(
                      analyses.reduce(
                        (sum: number, analysis: ResumeAnalysis) =>
                          sum + analysis.overallScore,
                        0
                      ) / analyses.length
                    )}
                    %
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-none rounded-md">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Analysis</p>
                  <p className="text-2xl font-bold">
                    {formatDistanceToNow(new Date(analyses[0].createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Analysis History */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Analysis History
          </h2>

          {!analyses || analyses.length === 0 ? (
            <Card className="p-12 text-center rounded-md">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No analyses yet
              </h3>
              <p className="text-gray-600 mb-6">
                Upload your first resume to get started with AI-powered
                analysis.
              </p>
              <Button onClick={() => {}} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Upload Resume
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {analyses.map((analysis: ResumeAnalysis) => (
                <Card
                  key={analysis.id}
                  className="p-6 hover:cursor-pointer transition-shadow  shadow-none rounded-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {analysis.fileName}
                        </h3>
                        <Badge>{formatJobCategory(analysis.jobCategory)}</Badge>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDistanceToNow(new Date(analysis.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                        {analysis.fullName && (
                          <div>Candidate: {analysis.fullName}</div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">
                          Overall Score:
                        </span>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={analysis.overallScore}
                            className="w-20"
                          />
                          <span
                            className={`text-sm font-semibold px-2 py-1 rounded ${getScoreColor(
                              analysis.overallScore
                            )}`}
                          >
                            {analysis.overallScore}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleViewAnalysis(analysis.id)}
                      className="flex items-center gap-2"
                    >
                      View Results
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
