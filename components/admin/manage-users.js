import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Key, X } from "lucide-react";
import AddUserDialog from "./add-user-dialog";
import { deactivateUser, deleteUser } from "@/lib/users";

export default async function ManageUsers() {
  const users = await prisma.user.findMany({ orderBy: { id: "desc" } });
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddUserDialog />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {users.map((u) => (
          <div key={u.id} className="rounded border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{u.name}</h3>
                <p className="text-sm text-muted-foreground">{u.email}</p>
                <p className="text-sm text-muted-foreground">
                  {u.membership} - {u.startDate.toISOString().split("T")[0]} to {u.endDate.toISOString().split("T")[0]}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2 py-1 rounded bg-muted">
                  {u.status}
                </span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Key className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-lg">
                    <DialogHeader className="flex flex-row items-center justify-between">
                      <DialogTitle>Credentials</DialogTitle>
                      <DialogClose className="cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                      </DialogClose>
                    </DialogHeader>
                    <DialogDescription>
                      Email: {u.email}
                      <br /> Password: {u.passwordPlain}
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="flex gap-2">
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
          </div>
        ))}
        {users.length === 0 && <p>No users added.</p>}
      </div>
    </div>
  );
}
