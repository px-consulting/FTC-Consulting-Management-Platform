"use client";

import { cn } from "@/lib/utils";

const variants = {
  active: "bg-teal text-white",
  inactive: "bg-destructive/10 text-destructive",
  expired: "bg-destructive/10 text-destructive",
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
