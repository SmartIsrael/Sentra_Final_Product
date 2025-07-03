
import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  isLoading?: boolean;
  error?: string | null;
}

const StatCard = ({ title, value, icon, trend, className, isLoading, error }: StatCardProps) => {
  return (
    <div className={cn("glass-card p-6 flex flex-col animate-fade-in min-h-[120px]", className)}> {/* Added min-h for consistent size */}
      <div className="flex justify-between items-start mb-2"> {/* Reduced mb */}
        <h3 className="text-smartel-gray-600 text-sm font-medium">{title}</h3>
        <div className="p-2 bg-smartel-green-100 rounded-lg text-smartel-green-500">
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between flex-grow"> {/* Added flex-grow */}
        {isLoading ? (
          <p className="text-2xl font-bold text-smartel-gray-500 animate-pulse">...</p>
        ) : error ? (
          <p className="text-sm text-red-500">Error: {error.substring(0, 30)}{error.length > 30 && '...'}</p>
        ) : (
          <div>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <p className={`text-xs flex items-center ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% from last month
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
