import { prisma } from "@/lib/prisma";
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
import { Key, X } from "lucide-react";
import AddUserDialog from "./add-user-dialog";
import { deactivateUser, deleteUser, updateCredentials } from "@/lib/users";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function ManageUsers() {
  const users = await prisma.user.findMany({ orderBy: { id: "desc" } });
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddUserDialog />
      </div>
      <div className="space-y-4">
        {users.map((u) => (
          <Card key={u.id} className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium">{u.name}</h3>
                <p className="text-sm text-muted-foreground">{u.email}</p>
                <p className="text-sm text-muted-foreground">
                  {u.membership} - {u.startDate.toISOString().split("T")[0]} to {u.endDate.toISOString().split("T")[0]}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={u.status.toLowerCase()}>{u.status}</Badge>
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
                    <form action={updateCredentials.bind(null, u.id)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`email-${u.id}`}>Email</Label>
                        <Input id={`email-${u.id}`} name="email" type="email" defaultValue={u.email} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`password-${u.id}`}>Password</Label>
                        <Input id={`password-${u.id}`} name="password" defaultValue={u.passwordPlain} />
                      </div>
                      <SubmitButton type="submit" pendingText="Updating...">
                        Update Credentials
                      </SubmitButton>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <form action={deactivateUser.bind(null, u.id)}>
                <SubmitButton type="submit" variant="secondary" pendingText="Updating...">
                  Deactivate
                </SubmitButton>
              </form>
              <form action={deleteUser.bind(null, u.id)}>
                <SubmitButton type="submit" variant="ghost" pendingText="Deleting...">
                  Delete
                </SubmitButton>
              </form>
            </div>
          </Card>
        ))}
        {users.length === 0 && <p>No users added.</p>}
      </div>
    </div>
  );
}
