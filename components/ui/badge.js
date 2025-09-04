"use client";

import { cn } from "@/lib/utils";

const variants = {
  created: "bg-primary text-primary-foreground",
  active: "bg-teal text-white",
  inactive: "bg-muted text-muted-foreground",
};

export function Badge({ variant = "created", className, ...props }) {
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
