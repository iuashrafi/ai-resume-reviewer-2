"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Code,
  Database,
  Rocket,
  TrendingUp,
  Server,
  Palette,
} from "lucide-react";

const jobCategories = [
  {
    id: "software-developer",
    name: "Software Developer",
    description: "Frontend, Backend, Full-stack",
    icon: Code,
    color: "blue",
  },
  // {
  //   id: "data-engineer",
  //   name: "Data Engineer",
  //   description: "ETL, Analytics, ML",
  //   icon: Database,
  //   color: "green",
  // },
  {
    id: "founders-office",
    name: "Founder's Office",
    description: "Strategy, Operations",
    icon: Rocket,
    color: "purple",
  },
  // {
  //   id: "product-manager",
  //   name: "Product Manager",
  //   description: "Strategy, Analytics",
  //   icon: TrendingUp,
  //   color: "orange",
  // },
  {
    id: "devops-engineer",
    name: "DevOps Engineer",
    description: "Infrastructure, CI/CD",
    icon: Server,
    color: "red",
  },
  // {
  //   id: "ui-ux-designer",
  //   name: "UI/UX Designer",
  //   description: "Design, Research",
  //   icon: Palette,
  //   color: "pink",
  // },
];

interface JobCategorySelectorProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
}

export function JobCategorySelector({
  selectedCategory,
  onCategorySelect,
}: JobCategorySelectorProps) {
  const getColorClasses = (color: string, isSelected: boolean) => {
    const colorMap = {
      blue: isSelected ? "bg-blue-100 border-primary" : "bg-blue-100",
      green: isSelected ? "bg-green-100 border-primary" : "bg-green-100",
      purple: isSelected ? "bg-purple-100 border-primary" : "bg-purple-100",
      orange: isSelected ? "bg-orange-100 border-primary" : "bg-orange-100",
      red: isSelected ? "bg-red-100 border-primary" : "bg-red-100",
      pink: isSelected ? "bg-pink-100 border-primary" : "bg-pink-100",
    };

    const iconColorMap = {
      blue: "text-primary",
      green: "text-green-600",
      purple: "text-purple-600",
      orange: "text-orange-600",
      red: "text-red-600",
      pink: "text-pink-600",
    };

    return {
      bg: colorMap[color as keyof typeof colorMap],
      icon: iconColorMap[color as keyof typeof iconColorMap],
    };
  };

  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-700 mb-4">
        Select Your Target Role
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobCategories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const colors = getColorClasses(category.color, isSelected);
          const Icon = category.icon;

          return (
            <Card
              key={category.id}
              className={`
                p-4 cursor-pointer transition-all duration-200 border shadow-none 
                ${
                  isSelected
                    ? "border-primary bg-blue-50"
                    : "border-gray-200 hover:border-primary hover:bg-blue-50"
                }
              `}
              onClick={() => onCategorySelect(category.id)}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${colors.icon}`} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{category.name}</h4>
                  <p className="text-sm text-gray-500">
                    {category.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
