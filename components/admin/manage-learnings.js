import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
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

async function addModule(formData) {
  "use server";
  const name = formData.get("name");
  const description = formData.get("description");
  const file = formData.get("file");
  let fileUrl = "";
  if (file && typeof file === "object") {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${randomUUID()}-${file.name}`;
    const dir = join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, fileName), buffer);
    fileUrl = `/uploads/${fileName}`;
  }
  await prisma.learningModule.create({ data: { name, description, fileUrl } });
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
          <DialogContent
            className="rounded-lg"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle>New Module</DialogTitle>
              <DialogClose className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogHeader>
            <form
              action={addModule}
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
                  PDF <span className="text-red-500">*</span>
                </Label>
                <Input id="module-file" name="file" type="file" accept="application/pdf" required />
              </div>
              <DialogClose asChild>
                <SubmitButton type="submit" pendingText="Saving...">Save</SubmitButton>
              </DialogClose>
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
                <form action={toggleModule.bind(null, m.id, !m.active)}>
                  <SubmitButton type="submit" variant="secondary" pendingText="Updating...">
                    {m.active ? "Deactivate" : "Activate"}
                  </SubmitButton>
                </form>
                <form action={deleteModule.bind(null, m.id)}>
                  <SubmitButton type="submit" variant="ghost" pendingText="Deleting...">
                    Delete
                  </SubmitButton>
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
