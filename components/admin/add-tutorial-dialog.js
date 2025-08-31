"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { addTutorial } from "@/lib/tutorials";

export default function AddTutorialDialog() {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData) {
    await addTutorial(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Tutorial</Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>New Tutorial</DialogTitle>
          <DialogClose className="cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tut-name">
              Tutorial Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tut-name"
              name="name"
              placeholder="Enter tutorial name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tut-desc">Description</Label>
            <Input
              id="tut-desc"
              name="description"
              placeholder="Describe tutorial"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tut-url">
              YouTube Link <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tut-url"
              name="youtubeUrl"
              placeholder="https://youtube.com/watch?v=..."
              required
            />
          </div>
          <SubmitButton type="submit" pendingText="Saving...">
            Save
          </SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
