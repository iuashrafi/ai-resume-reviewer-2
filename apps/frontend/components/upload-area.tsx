import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Check, AlertCircle } from "lucide-react";
import { useAuthContext } from "@/context/AuthProvider";
// import { LoginDialog } from "./login-dialog";

interface UploadAreaProps {
  onFileSelected: (file: File) => void;
  uploadedFile: File | null;
  isUploading: boolean;
}

export function UploadArea({
  onFileSelected,
  uploadedFile,
  isUploading,
}: UploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isAuthenticated } = useAuthContext();

  const handleFileSelect = (file: File) => {
    // Check authentication first
    // if (!isAuthenticated) {
    //   setShowLoginDialog(true);
    //   return;
    // }

    setError(null);

    if (file.type !== "application/pdf") {
      setError("Please select a PDF file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    onFileSelected(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-700 mb-4">
        Upload Your Resume (PDF)
      </label>

      <Card
        className={`
          border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-200 shadow-none
          ${
            isDragOver || uploadedFile
              ? "border-primary bg-blue-50"
              : "border-gray-300/70 hover:border-primary hover:bg-violet-50/70"
          }
          ${isUploading ? "pointer-events-none opacity-50" : ""}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileInputChange}
          disabled={isUploading}
        />

        <div className="mx-auto w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
          {uploadedFile ? (
            <Check className="text-green-600 w-8 h-8" />
          ) : (
            <Upload className="text-primary w-8 h-8" />
          )}
        </div>

        {uploadedFile ? (
          <>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {uploadedFile.name}
            </h3>
            <p className="text-gray-600 mb-4">File uploaded successfully</p>
            <p className="text-sm text-gray-500">Click to change file</p>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Drop your resume here
            </h3>
            <p className="text-gray-600 mb-4">
              or <span className="text-primary font-medium">browse files</span>
            </p>
            <p className="text-sm text-gray-500">PDF files only, max 10MB</p>
          </>
        )}
      </Card>

      {error && (
        <div className="mt-2 flex items-center space-x-2 text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} /> */}
    </div>
  );
}
