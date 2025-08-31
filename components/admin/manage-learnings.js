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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Module</DialogTitle>
            </DialogHeader>
            <form action={addModule} className="space-y-4">
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
                <Label htmlFor="module-desc">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="module-desc"
                  name="description"
                  placeholder="Describe module"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module-file">
                  PDF <span className="text-red-500">*</span>
                </Label>
                <Input id="module-file" name="file" type="file" accept="application/pdf" required />
              </div>
              <SubmitButton type="submit" pendingText="Saving...">Save</SubmitButton>
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
