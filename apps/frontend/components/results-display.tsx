"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
// import { HighlightedResume } from "./highlighted-resume";
import {
  Download,
  Plus,
  ClipboardList,
  BarChart3,
  GraduationCap,
  Briefcase,
  Cog,
  FolderOpen,
  Lightbulb,
  FileText,
  Search,
  Eye,
  AlertTriangle,
  Info,
  CheckCircle,
} from "lucide-react";
import { ResumeAnalysis } from "@/lib/api";

interface ResultsDisplayProps {
  analysis: ResumeAnalysis;
  onAnalyzeAnother?: () => void;
}

export function ResultsDisplay({
  analysis,
  onAnalyzeAnother,
}: ResultsDisplayProps) {
  const getSectionIcon = (sectionName: string) => {
    switch (sectionName) {
      case "education":
        return GraduationCap;
      case "experience":
        return Briefcase;
      case "skills":
        return Cog;
      case "projects":
        return FolderOpen;
      default:
        return FileText;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const formatCategoryName = (category: string) => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Resume Analysis Complete!
            </h1>
            <p className="text-xl opacity-90">
              Analysis for {analysis.fullName}'s Resume
            </p>
            <p className="text-lg opacity-75">
              {formatCategoryName(analysis.jobCategory)} Position
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Overall Score Card */}
          <div className="xl:col-span-2">
            <Card className="p-8 text-center sticky top-8">
              <div className="mb-6">
                <div className="relative w-32 h-32 mx-auto">
                  <svg
                    className="w-32 h-32 transform -rotate-90"
                    viewBox="0 0 120 120"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="8"
                      strokeDasharray="339.3"
                      strokeDashoffset={
                        339.3 - (339.3 * analysis.overallScore) / 100
                      }
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div>
                      <div className="text-4xl font-bold text-gray-900">
                        {analysis.overallScore}
                      </div>
                      <div className="text-sm text-gray-500">out of 100</div>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Overall Score
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Your resume shows strong potential with room for targeted
                improvements
              </p>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button className="w-full" onClick={() => window.print()}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onAnalyzeAnother}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Analyze Another Resume
                </Button>
              </div>
            </Card>
          </div>

          {/* Detailed Analysis */}
          <div className="xl:col-span-5 space-y-6">
            {/* Summary Card */}
            <Card className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <ClipboardList className="text-primary w-5 h-5 mr-2" />
                Executive Summary
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {analysis.summary}
              </p>
            </Card>

            {/* Section Scores */}
            <Card className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <BarChart3 className="text-primary w-5 h-5 mr-2" />
                Section Breakdown
              </h3>

              <div className="space-y-6">
                {Object.entries(analysis.sections).map(
                  ([sectionName, sectionData]) => {
                    const Icon = getSectionIcon(sectionName);

                    return (
                      <Card key={sectionName} className="border p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Icon className="text-primary w-5 h-5" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 capitalize">
                              {sectionName}
                            </h4>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div
                              className={`text-2xl font-bold ${getScoreColor(
                                sectionData.score
                              )}`}
                            >
                              {sectionData.score}
                            </div>
                            <div className="text-sm text-gray-500">/100</div>
                          </div>
                        </div>
                        <div className="mb-4">
                          <Progress value={sectionData.score} className="h-2" />
                        </div>
                        <p className="text-gray-700">{sectionData.feedback}</p>
                      </Card>
                    );
                  }
                )}
              </div>
            </Card>

            {/* Improvement Suggestions */}
            <Card className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Lightbulb className="text-yellow-500 w-5 h-5 mr-2" />
                Improvement Suggestions
              </h3>
              <div className="space-y-4">
                {Object.entries(analysis.suggestedFixes).map(
                  ([key, suggestion], index) => (
                    <Card
                      key={key}
                      className="bg-yellow-50 border-yellow-200 p-6"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <AlertTriangle className="text-white w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Improvement #{index + 1}
                          </h4>
                          <p className="text-gray-700 text-sm">{suggestion}</p>
                        </div>
                      </div>
                    </Card>
                  )
                )}
              </div>
            </Card>

            {/* ATS Readiness Score */}
            <Card className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="text-primary w-5 h-5 mr-2" />
                ATS Readiness Score
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="text-green-600 w-6 h-6" />
                  </div>
                  <div
                    className={`text-2xl font-bold mb-1 ${getScoreColor(
                      analysis.atsScore.format
                    )}`}
                  >
                    {analysis.atsScore.format}/100
                  </div>
                  <div className="text-sm text-gray-600">Format Score</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="text-yellow-600 w-6 h-6" />
                  </div>
                  <div
                    className={`text-2xl font-bold mb-1 ${getScoreColor(
                      analysis.atsScore.keywords
                    )}`}
                  >
                    {analysis.atsScore.keywords}/100
                  </div>
                  <div className="text-sm text-gray-600">Keyword Match</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Eye className="text-primary w-6 h-6" />
                  </div>
                  <div
                    className={`text-2xl font-bold mb-1 ${getScoreColor(
                      analysis.atsScore.readability
                    )}`}
                  >
                    {analysis.atsScore.readability}/100
                  </div>
                  <div className="text-sm text-gray-600">Readability</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Highlighted Resume */}
          <div className="xl:col-span-5">
            {analysis.originalText && analysis.highlightedText ? (
              <>
                highlighted part here
                {/* <HighlightedResume
                  originalText={analysis.originalText}
                  highlightedText={analysis.highlightedText}
                /> */}
              </>
            ) : (
              <Card className="h-full">
                <div className="p-6 flex items-center justify-center h-64">
                  <div className="text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Resume highlighting not available for this analysis</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
