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
import { addModule } from "@/lib/learning-modules";

export default function AddLearningModuleDialog() {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData) {
    await addModule(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Module</Button>
      </DialogTrigger>
      <DialogContent
        className="rounded-lg"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>New Module</DialogTitle>
          <DialogClose className="cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <form
          action={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          <div className="space-y-2">
            <Label htmlFor="module-name">
              Module Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="module-name"
              name="name"
              placeholder="Enter module name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="module-desc">Description</Label>
            <Input
              id="module-desc"
              name="description"
              placeholder="Describe module"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="module-file">
              PDF (max 50MB) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="module-file"
              name="file"
              type="file"
              accept="application/pdf"
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

