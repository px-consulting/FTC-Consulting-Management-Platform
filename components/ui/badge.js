"use client";

import { cn } from "@/lib/utils";

const variants = {
  active: "bg-teal text-white",
  inactive: "bg-destructive/10 text-destructive",
  expired: "bg-destructive/10 text-destructive",
  not_started: "bg-gray-200 text-gray-800",
  in_progress: "bg-yellow-200 text-yellow-800",
  done: "bg-green-200 text-green-800",
};

export function Badge({ variant = "active", className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium", 
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
