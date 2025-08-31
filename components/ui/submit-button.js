"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./button";

export function SubmitButton({ children, pendingText = "Loading...", ...props }) {
  const { pending } = useFormStatus();
  return (
    <Button {...props} disabled={pending}>
      {pending ? pendingText : children}
    </Button>
  );
}
