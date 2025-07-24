"use client";

import { BarChart3, FileText, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthProvider";

export const Header = () => {
  const { isAuthenticated, logout } = useAuthContext();
  return (
    <nav className="bg-white shadow-none border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="text-white w-4 h-4" />
            </div>
            <span className="text-base font-semibold text-gray-900">
              AI Resume Reviewer
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => {
                    logout();
                  }}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button className="" variant={"ghost"} asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button className="text-white" asChild>
                  <Link href="/signup">Create An Account</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
