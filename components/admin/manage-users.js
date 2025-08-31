import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key } from "lucide-react";
import bcrypt from "bcryptjs";

function generatePassword() {
  return Math.random().toString(36).slice(-8);
}

async function addUser(formData) {
  "use server";
  const name = formData.get("name");
  const email = formData.get("email");
  const membership = formData.get("membership");
  const startDate = new Date(formData.get("startDate"));
  const endDate = new Date(formData.get("endDate"));
  const plainPassword = generatePassword();
  const hashed = await bcrypt.hash(plainPassword, 10);
  await prisma.user.create({
    data: {
      name,
      email,
      membership,
      startDate,
      endDate,
      password: hashed,
      passwordPlain: plainPassword,
    },
  });
  revalidatePath("/admin");
}

async function deactivateUser(id) {
  "use server";
  await prisma.user.update({ where: { id }, data: { status: "INACTIVE" } });
  revalidatePath("/admin");
}

async function deleteUser(id) {
  "use server";
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin");
}

export default async function ManageUsers() {
  const users = await prisma.user.findMany({ orderBy: { id: "desc" } });
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New User</DialogTitle>
            </DialogHeader>
            <form action={addUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="user-name"
                  name="name"
                  placeholder="Enter name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="user-email"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-membership">
                  Membership Taken <span className="text-red-500">*</span>
                </Label>
                <select
                  id="user-membership"
                  name="membership"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select membership
                  </option>
                  <option value="SILVER">Silver</option>
                  <option value="GOLD">Gold</option>
                  <option value="DIAMOND">Diamond</option>
                  <option value="PLATINUM">Platinum</option>
                </select>
              </div>
              <div className="flex gap-4">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="startDate">
                    Start Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    placeholder="Select start date"
                    required
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <Label htmlFor="endDate">
                    End Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    placeholder="Select end date"
                    required
                  />
                </div>
              </div>
              <SubmitButton type="submit" pendingText="Saving...">Save</SubmitButton>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {users.map((u) => (
          <div key={u.id} className="rounded border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{u.name}</h3>
                <p className="text-sm text-muted-foreground">{u.membership} - ends {u.endDate.toISOString().split("T")[0]}</p>
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
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Credentials</DialogTitle>
                      <DialogDescription>
                        Email: {u.email}
                        <br /> Password: {u.passwordPlain}
                      </DialogDescription>
                    </DialogHeader>
                    <DialogClose asChild>
                      <Button variant="secondary">Close</Button>
                    </DialogClose>
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
