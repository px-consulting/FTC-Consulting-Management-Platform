"use client";

import { useState, useEffect, useActionState } from "react";
import Link from "next/link";
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
import { Key, Trash, X, MoreVertical } from "lucide-react";
import { setUserActive, deleteUser, updateCredentials } from "@/lib/users";
import { formatDate } from "@/lib/utils";

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
    businessName,
    companyAddress,
    annualRevenue,
    employeeCount,
    manufacturing,
    businessChallenges,
  } = user;
  const today = new Date();
  const status = endDate < today ? "EXPIRED" : rawStatus;
  const isActive = status === "ACTIVE";
  const profileAvailable =
    !!businessName &&
    !!companyAddress &&
    annualRevenue !== null &&
    employeeCount !== null &&
    manufacturing !== null &&
    businessChallenges.length > 0;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [credOpen, setCredOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const initialCredState = { success: false };
  async function handleUpdate(prevState, formData) {
    await updateCredentials(id, formData);
    return { success: true };
  }
  const [credState, credAction] = useActionState(
    handleUpdate,
    initialCredState
  );

  useEffect(() => {
    if (credState.success) {
      setEditing(false);
      setCredOpen(false);
      toast.success(`Credentials for ${name} updated`);
    }
  }, [credState.success, name]);

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
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded hover:bg-muted"
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-32 rounded-md border bg-popover text-popover-foreground shadow-md">
              {profileAvailable ? (
                <Link
                  href={`/admin/users/${id}`}
                  className="block px-4 py-2 text-sm hover:bg-muted"
                  onClick={() => setMenuOpen(false)}
                >
                  View Profile
                </Link>
              ) : (
                <span className="block px-4 py-2 text-sm opacity-50">
                  View Profile
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        {membership && (
          <p className="text-sm text-muted-foreground">{membership}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Ends {formatDate(endDate)}
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
        <Dialog
          open={credOpen}
          onOpenChange={(o) => {
            setCredOpen(o);
            if (!o) setEditing(false);
          }}
        >
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
              <form action={credAction} className="space-y-4">
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
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-destructive"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
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
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent
          className="rounded-lg"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Delete user?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. This will permanently delete the user
            and their records.
          </p>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <form action={deleteUser.bind(null, id)}>
              <SubmitButton
                variant="destructive"
                pendingText="Deleting..."
              >
                Delete
              </SubmitButton>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
