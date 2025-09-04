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
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Key, Trash, X } from "lucide-react";
import { setUserActive, deleteUser, updateCredentials } from "@/lib/users";

export default function UserCard({ user }) {
  const {
    id,
    name,
    email,
    membership,
    startDate,
    endDate,
    status: rawStatus,
    passwordPlain,
  } = user;
  const today = new Date();
  const status = endDate < today ? "EXPIRED" : rawStatus;
  const isActive = status === "ACTIVE";
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  async function handleToggle() {
    try {
      await setUserActive(id, !isActive);
      toast.success(`User ${isActive ? "deactivated" : "activated"}`);
    } catch (err) {
      toast.error("Failed to update user");
    } finally {
      setConfirmOpen(false);
    }
  }

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-sm text-muted-foreground">{membership}</p>
          <p className="text-sm text-muted-foreground">
            Ends {endDate.toISOString().split("T")[0]}
          </p>
          <Badge variant={status.toLowerCase()}>{status}</Badge>
          <div className="flex items-center gap-2">
            <Switch
              id={`user-${id}`}
              checked={isActive}
              onCheckedChange={() => setConfirmOpen(true)}
            />
            <Label htmlFor={`user-${id}`}>
              {status === "ACTIVE" ? "Active" : status === "EXPIRED" ? "Expired" : "Inactive"}
            </Label>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Key className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-lg sm:max-w-sm">
              <DialogHeader className="flex flex-row items-center justify-between">
                <DialogTitle>Credentials</DialogTitle>
                <DialogClose className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </DialogClose>
              </DialogHeader>
              {editing ? (
                <form action={updateCredentials.bind(null, id)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`email-${id}`}>Email</Label>
                    <Input
                      id={`email-${id}`}
                      name="email"
                      type="email"
                      defaultValue={email}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`password-${id}`}>Password</Label>
                    <Input
                      id={`password-${id}`}
                      name="password"
                      defaultValue={passwordPlain}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </Button>
                    <SubmitButton type="submit" pendingText="Saving...">
                      Save
                    </SubmitButton>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Password</p>
                    <p className="text-sm text-muted-foreground">{passwordPlain}</p>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => setEditing(true)}>
                      Update Credentials
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
          <form action={deleteUser.bind(null, id)}>
            <SubmitButton
              type="submit"
              variant="ghost"
              size="icon"
              className="text-destructive"
              pendingText="Deleting..."
            >
              <Trash className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </SubmitButton>
          </form>
        </div>
      </div>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent
          className="rounded-lg"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {isActive ? "Deactivate user?" : "Activate user?"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleToggle}>Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
