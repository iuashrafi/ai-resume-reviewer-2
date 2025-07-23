"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { resumeApi } from "@/lib/api";
import { showToast } from "@/lib/show-toast";

type AnalysisState = {
  isProcessing: boolean;
  file: File | null;
  category: string | null;
};

type AnalysisContextType = {
  analysisState: AnalysisState;
  handleStartAnalysis: (file: File, category: string) => Promise<void>;
  handleAnalyzeAnother: () => void;
};

const AnalysisContext = createContext<AnalysisContextType | undefined>(
  undefined
);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isProcessing: false,
    file: null,
    category: null,
  });

  const handleStartAnalysis = useCallback(
    async (file: File, category: string) => {
      try {
        setAnalysisState({ isProcessing: true, file, category });
        // router.push("/processing");

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const result = await resumeApi.uploadResume(file, category);

        showToast("Analysis Complted!", "success");

        // router.push(`/results/${result.id}`);
      } catch (error) {
        console.error("Analysis failed:", error);

        showToast("Analysis Failed!", "error");

        // router.push("/");
      } finally {
        setAnalysisState({ isProcessing: false, file: null, category: null });
      }
    },
    [router]
  );

  const handleAnalyzeAnother = useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <AnalysisContext.Provider
      value={{ analysisState, handleStartAnalysis, handleAnalyzeAnother }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
}
