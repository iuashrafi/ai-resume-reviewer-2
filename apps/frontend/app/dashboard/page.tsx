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
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<ResumeAnalysis[]>([]);
  const [stats, setStats] = useState<AnalysisStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [analysesData, statsData] = await Promise.all([
        resumeApi.getAnalyses(),
        resumeApi.getAnalysisStats(),
      ]);
      setAnalyses(analysesData);
      setStats(statsData);
    } catch (error: any) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Resume Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and track your resume analyses
              </p>
            </div>
            <button
              onClick={() => router.push("/resume/upload")}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>New Analysis</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        {stats && stats.totalAnalyses > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Analyses</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalAnalyses}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.averageScore}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Last Analysis</p>
                  <p className="text-lg font-bold text-gray-900">
                    {stats.lastAnalysis
                      ? formatDistanceToNow(new Date(stats.lastAnalysis), {
                          addSuffix: true,
                        })
                      : "Never"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Score Improvement</p>
                  <p
                    className={`text-2xl font-bold ${
                      stats.scoreImprovement >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stats.scoreImprovement > 0 ? "+" : ""}
                    {stats.scoreImprovement}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search analyses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {uniqueCategories.map((category) => (
                    <option key={category} value={category}>
                      {formatJobCategory(category)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Analyses List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Analysis History
            </h2>
          </div>

          {filteredAnalyses.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {analyses.length === 0
                  ? "No analyses yet"
                  : "No matching analyses"}
              </h3>
              <p className="text-gray-600 mb-6">
                {analyses.length === 0
                  ? "Upload your first resume to get started with AI-powered analysis."
                  : "Try adjusting your search or filter criteria."}
              </p>
              {analyses.length === 0 && (
                <button
                  onClick={() => router.push("/resume/upload")}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>Upload Resume</span>
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {filteredAnalyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {analysis.fileName}
                        </h3>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {formatJobCategory(analysis.jobCategory)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDistanceToNow(new Date(analysis.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        {analysis.fullName && (
                          <div>Candidate: {analysis.fullName}</div>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium">
                          Overall Score:
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 bg-primary-600 rounded-full"
                              style={{ width: `${analysis.overallScore}%` }}
                            ></div>
                          </div>
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

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          router.push(`/resume/analysis/${analysis.id}`)
                        }
                        className="px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Results</span>
                      </button>
                      <button
                        onClick={() => handleDeleteAnalysis(analysis.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
