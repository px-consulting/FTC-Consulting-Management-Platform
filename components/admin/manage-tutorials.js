import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function extractVideoId(url) {
  try {
    const u = new URL(url);
    return u.searchParams.get("v") || u.pathname.split("/").pop();
  } catch {
    return url;
  }
}

async function addTutorial(formData) {
  "use server";
  const name = formData.get("name");
  const description = formData.get("description");
  const youtubeUrl = formData.get("youtubeUrl");
  await prisma.tutorial.create({ data: { name, description, youtubeUrl } });
  revalidatePath("/admin");
}

async function toggleTutorial(id, active) {
  "use server";
  await prisma.tutorial.update({ where: { id }, data: { active } });
  revalidatePath("/admin");
}

async function deleteTutorial(id) {
  "use server";
  await prisma.tutorial.delete({ where: { id } });
  revalidatePath("/admin");
}

export default async function ManageTutorials() {
  const tutorials = await prisma.tutorial.findMany({ orderBy: { id: "desc" } });
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Tutorial</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Tutorial</DialogTitle>
            </DialogHeader>
            <form action={addTutorial} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tut-name">Tutorial Name</Label>
                <Input id="tut-name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tut-desc">Description</Label>
                <Input id="tut-desc" name="description" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tut-url">YouTube Link</Label>
                <Input id="tut-url" name="youtubeUrl" required />
              </div>
              <Button type="submit">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {tutorials.map((t) => {
          const id = extractVideoId(t.youtubeUrl);
          return (
            <div key={t.id} className="rounded border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{t.name}</h3>
                <div className="flex gap-2">
                  <form action={async () => toggleTutorial(t.id, !t.active)}>
                    <Button type="submit" variant="secondary">
                      {t.active ? "Deactivate" : "Activate"}
                    </Button>
                  </form>
                  <form action={async () => deleteTutorial(t.id)}>
                    <Button type="submit" variant="ghost">Delete</Button>
                  </form>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{t.description}</p>
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${id}`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          );
        })}
        {tutorials.length === 0 && <p>No tutorials added.</p>}
      </div>
    </div>
  );
}
