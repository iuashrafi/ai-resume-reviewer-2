import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthProvider";
import { AuthGate } from "@/context/AuthGate";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AnalysisProvider } from "@/context/analysis-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Resume Reviewer",
  description: "Developed By IUA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {/* <AuthGate> */}
          <AnalysisProvider>
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 3000,
              }}
            />
            {children}
          </AnalysisProvider>
          {/* </AuthGate> */}
        </AuthProvider>
      </body>
    </html>
  );
}
