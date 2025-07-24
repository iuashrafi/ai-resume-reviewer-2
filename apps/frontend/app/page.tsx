"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { UploadArea } from "@/components/upload-area";
import { JobCategorySelector } from "@/components/job-category-selector";
import { FileText, Clock, Shield } from "lucide-react";
import { useAuthContext } from "@/context/AuthProvider";
import { useAnalysis } from "@/context/analysis-context";
import { AIButton } from "@/components/ai-button";

export default function HomePage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { isAuthenticated, user, logout } = useAuthContext();
  const { handleStartAnalysis, analysisState } = useAnalysis();

  const startResumeAnalysis = () => {
    if (uploadedFile && selectedCategory) {
      console.log("uploaded file=", uploadedFile);
      console.log("selected categ=", selectedCategory);
      handleStartAnalysis(uploadedFile, selectedCategory);
    }
  };

  const isUploading = false;
  const isValid = uploadedFile && selectedCategory && !isUploading;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className=" py-16 gradient-mesh-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get Your Resume{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-violet-600 text-transparent bg-clip-text">
              AI-Reviewed
            </span>
            <br />
            in Under 2 Minutes
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload your resume, select your target role, and receive detailed
            AI-powered feedback with actionable improvement suggestions.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 mb-12">
            <div className="flex items-center space-x-2">
              <Shield className="text-lime-500 w-4 h-4" />
              <span>100% Free Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="text-lime-500 w-4 h-4" />
              <span>2-minute turnaround</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="text-lime-500 w-4 h-4" />
              <span>Secure & Private</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Upload Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <Card className="p-8 shadow-none border-gray-200/80">
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  Upload Resume
                </span>
              </div>
              <div className="w-12 h-0.5 bg-gray-200/80"></div>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    uploadedFile
                      ? "bg-primary text-white"
                      : "bg-gray-200/80 text-gray-500"
                  }`}
                >
                  2
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    uploadedFile ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  Select Role
                </span>
              </div>
              <div className="w-12 h-0.5 bg-gray-200/80"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200/80 text-gray-500 rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <span className="ml-2 text-sm font-medium text-gray-500">
                  Get Results
                </span>
              </div>
            </div>
          </div>

          {/* File Upload Area */}
          <UploadArea
            onFileSelected={setUploadedFile}
            uploadedFile={uploadedFile}
            isUploading={isUploading}
          />

          {/* Job Category Selection */}
          <JobCategorySelector
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />

          {/* Action Button */}
          <div className="text-center">
            {/* <Button
                size="lg"
                disabled={!isValid}
                onClick={startResumeAnalysis}
                className="px-8 py-4 text-lg font-semibold shadow-lg disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Analyze My Resume
              </Button> */}
            <AIButton
              size="lg"
              title="Analyze My Resume"
              className="px-12 py-5 text-base rounded-lg"
            />
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <FileText className="text-white w-4 h-4" />
                </div>
                <span className="text-xl font-semibold">
                  AI Resume Reviewer
                </span>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                Get your resume analyzed by AI in minutes. Improve your chances
                of landing your dream job with detailed feedback and actionable
                suggestions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AI Resume Reviewer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
