"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { X } from "lucide-react";
import { addUser } from "@/lib/users";

export default function AddUserDialog() {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData) {
    try {
      await addUser(formData);
      toast.success("User created");
      setOpen(false);
    } catch (err) {
      toast.error(err.message || "Failed to create user");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add User</Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>New User</DialogTitle>
          <DialogClose className="cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input id="user-name" name="name" placeholder="Enter name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="user-email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input id="user-email" name="email" type="email" placeholder="Enter email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="user-phone">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="user-phone"
              name="phone"
              type="tel"
              placeholder="Enter phone number"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="user-membership">
              Membership Taken <span className="text-red-500">*</span>
            </Label>
            <Select name="membership">
              <SelectTrigger id="user-membership">
                <SelectValue placeholder="Select membership" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SILVER">Silver</SelectItem>
                <SelectItem value="GOLD">Gold</SelectItem>
                <SelectItem value="DIAMOND">Diamond</SelectItem>
                <SelectItem value="PLATINUM">Platinum</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <Label>Start Date <span className="text-red-500">*</span></Label>
              <DatePicker name="startDate" />
            </div>
            <div className="space-y-2 flex-1">
              <Label>End Date <span className="text-red-500">*</span></Label>
              <DatePicker name="endDate" />
            </div>
          </div>
          <SubmitButton type="submit" pendingText="Saving...">Save</SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
