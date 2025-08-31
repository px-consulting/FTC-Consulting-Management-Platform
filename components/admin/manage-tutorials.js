import { prisma } from "@/lib/prisma";
import { SubmitButton } from "@/components/ui/submit-button";
import AddTutorialDialog from "./add-tutorial-dialog";
import { toggleTutorial, deleteTutorial } from "@/lib/tutorials";

function extractVideoId(url) {
  try {
    const u = new URL(url);
    return u.searchParams.get("v") || u.pathname.split("/").pop();
  } catch {
    return url;
  }
}

export default async function ManageTutorials() {
  const tutorials = await prisma.tutorial.findMany({ orderBy: { id: "desc" } });
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddTutorialDialog />
      </div>
      <div className="grid gap-4 md:grid-cols-2 max-w-3xl mx-auto">
        {tutorials.map((t) => {
          const id = extractVideoId(t.youtubeUrl);
          return (
            <div key={t.id} className="rounded border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{t.name}</h3>
                <div className="flex gap-2">
                  <form action={toggleTutorial.bind(null, t.id, !t.active)}>
                    <SubmitButton type="submit" variant="secondary" pendingText="Updating...">
                      {t.active ? "Deactivate" : "Activate"}
                    </SubmitButton>
                  </form>
                  <form action={deleteTutorial.bind(null, t.id)}>
                    <SubmitButton type="submit" variant="ghost" pendingText="Deleting...">
                      Delete
                    </SubmitButton>
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
