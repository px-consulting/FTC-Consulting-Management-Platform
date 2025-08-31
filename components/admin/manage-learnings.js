import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
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
  const file = formData.get("file");
  let fileUrl = "";
  if (file && typeof file.name === "string") {
    const { data, error } = await supabase.storage
      .from("learnings")
      .upload(`learnings/${Date.now()}-${file.name}`, file, { upsert: false });
    if (!error) {
      fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.path}`;
    }
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
                <Label htmlFor="module-name">Module Name</Label>
                <Input id="module-name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module-desc">Description</Label>
                <Input id="module-desc" name="description" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module-file">Upload PDF</Label>
                <Input id="module-file" name="file" type="file" accept="application/pdf" required />
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">View</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl h-[80vh]">
                    <iframe src={m.fileUrl} className="h-full w-full" />
                  </DialogContent>
                </Dialog>
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
