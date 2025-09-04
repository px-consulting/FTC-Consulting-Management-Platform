"use client";

import { Input } from "@/components/ui/input";

export function DatePicker({ name, ...props }) {
  return <Input type="date" name={name} {...props} />;
}
