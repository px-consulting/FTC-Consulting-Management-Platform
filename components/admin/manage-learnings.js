import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

async function addModule(formData) {
  "use server";
  const name = formData.get("name");
  const description = formData.get("description");
  await prisma.learningModule.create({ data: { name, description, fileUrl: "" } });
  revalidatePath("/admin");
}

async function toggleModule(id, active) {
  "use server";
  await prisma.learningModule.update({ where: { id }, data: { active } });
  revalidatePath("/admin");
}

async function deleteModule(id) {
  "use server";
  await prisma.learningModule.delete({ where: { id } });
  revalidatePath("/admin");
}

export default async function ManageLearnings() {
  const modules = await prisma.learningModule.findMany({ orderBy: { id: "desc" } });
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Module</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Module</DialogTitle>
            </DialogHeader>
            <form action={addModule} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="module-name">Module Name</Label>
                <Input id="module-name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module-desc">Description</Label>
                <Input id="module-desc" name="description" required />
              </div>
              <Button type="submit">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {modules.map((m) => (
          <div key={m.id} className="rounded border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{m.name}</h3>
              <div className="flex gap-2">
                <form action={async () => toggleModule(m.id, !m.active)}>
                  <Button type="submit" variant="secondary">
                    {m.active ? "Deactivate" : "Activate"}
                  </Button>
                </form>
                <form action={async () => deleteModule(m.id)}>
                  <Button type="submit" variant="ghost">Delete</Button>
                </form>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{m.description}</p>
          </div>
        ))}
        {modules.length === 0 && <p>No modules uploaded.</p>}
      </div>
    </div>
  );
}
