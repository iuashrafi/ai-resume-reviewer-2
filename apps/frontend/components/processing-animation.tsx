"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Brain, Check, Circle, Loader2 } from "lucide-react";

interface ProcessingStep {
  id: string;
  label: string;
  status: "waiting" | "processing" | "complete";
}

export const ProcessingAnimation = () => {
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { id: "extract", label: "PDF text extraction", status: "complete" },
    { id: "analyze", label: "AI content analysis", status: "processing" },
    {
      id: "suggestions",
      label: "Generating improvement suggestions",
      status: "waiting",
    },
    { id: "scoring", label: "Calculating scores", status: "waiting" },
  ]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Simulate processing steps
    timers.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((step) =>
            step.id === "analyze"
              ? { ...step, status: "complete" }
              : step.id === "suggestions"
              ? { ...step, status: "processing" }
              : step
          )
        );
      }, 2000)
    );

    timers.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((step) =>
            step.id === "suggestions"
              ? { ...step, status: "complete" }
              : step.id === "scoring"
              ? { ...step, status: "processing" }
              : step
          )
        );
      }, 3500)
    );

    timers.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((step) =>
            step.id === "scoring" ? { ...step, status: "complete" } : step
          )
        );
      }, 4500)
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const getStepIcon = (status: ProcessingStep["status"]) => {
    switch (status) {
      case "complete":
        return <Check className="w-4 h-4 text-green-600" />;
      case "processing":
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      case "waiting":
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStepClasses = (status: ProcessingStep["status"]) => {
    switch (status) {
      case "complete":
        return "bg-green-50 border-green-200";
      case "processing":
        return "bg-blue-50 border-blue-200";
      case "waiting":
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusText = (status: ProcessingStep["status"]) => {
    switch (status) {
      case "complete":
        return "Complete";
      case "processing":
        return "In progress...";
      case "waiting":
        return "Waiting...";
    }
  };

  const getStatusColor = (status: ProcessingStep["status"]) => {
    switch (status) {
      case "complete":
        return "text-green-600";
      case "processing":
        return "text-primary";
      case "waiting":
        return "text-gray-500";
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Card className="p-12 text-center">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                <Check className="w-4 h-4" />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">
                Upload Resume
              </span>
            </div>
            <div className="w-12 h-0.5 bg-green-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                <Check className="w-4 h-4" />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">
                Select Role
              </span>
            </div>
            <div className="w-12 h-0.5 bg-primary"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-primary">
                Processing...
              </span>
            </div>
          </div>
        </div>

        {/* Processing Animation */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-4 bg-blue-50 rounded-full flex items-center justify-center">
              <Brain className="text-primary w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            AI is Analyzing Your Resume
          </h2>
          <p className="text-gray-600 mb-8">
            Our advanced AI is reviewing your resume and preparing detailed
            feedback...
          </p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4 mb-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center justify-between p-4 border rounded-lg ${getStepClasses(
                step.status
              )}`}
            >
              <div className="flex items-center space-x-3">
                {getStepIcon(step.status)}
                <span className="font-medium text-gray-900">{step.label}</span>
              </div>
              <span className={`text-sm ${getStatusColor(step.status)}`}>
                {getStatusText(step.status)}
              </span>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-500">
          This usually takes 30-60 seconds
        </p>
      </Card>
    </div>
  );
};
