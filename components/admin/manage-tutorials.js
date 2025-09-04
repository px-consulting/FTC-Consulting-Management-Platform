import { prisma } from "@/lib/prisma";
import { SubmitButton } from "@/components/ui/submit-button";
import AddTutorialDialog from "./add-tutorial-dialog";
import { toggleTutorial, deleteTutorial } from "@/lib/tutorials";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import YouTubePlayer from "@/components/ui/youtube-player";

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
      <ol className="space-y-6 max-w-3xl mx-auto">
        {tutorials.map((t, i) => {
          const id = extractVideoId(t.youtubeUrl);
          return (
            <li key={t.id}>
              <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div>
                    <CardTitle className="text-lg">{t.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">Step {i + 1}</p>
                  </div>
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
                </CardHeader>
                <YouTubePlayer videoId={id} />
                <CardContent>
                  <p className="text-sm text-muted-foreground">{t.description}</p>
                </CardContent>
              </Card>
            </li>
          );
        })}
        {tutorials.length === 0 && <p>No tutorials added.</p>}
      </ol>
    </div>
  );
}
