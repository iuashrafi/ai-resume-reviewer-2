"use client";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function AIButton({ title, className, ...props }: any) {
  return (
    <Button
      className={cn(
        "relative overflow-hidden px-6 py-3 rounded-2xl font-semibold text-white bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 shadow-xl",
        "transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)]",
        "backdrop-blur-md border border-white/20",
        className
      )}
      {...props}
    >
      <Sparkles className="mr-2 h-5 w-5 text-white animate-pulse" />
      {title}
    </Button>
  );
}
