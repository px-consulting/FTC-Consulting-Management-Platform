import { prisma } from "@/lib/prisma";
import AddTutorialDialog from "./add-tutorial-dialog";
import TutorialCard from "./tutorial-card";

export default async function ManageTutorials() {
  const tutorials = await prisma.tutorial.findMany({ orderBy: { id: "desc" } });
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddTutorialDialog />
      </div>
      <ol className="space-y-6 max-w-3xl mx-auto">
        {tutorials.map((t, i) => (
          <li key={t.id}>
            <TutorialCard tutorial={t} step={i + 1} />
          </li>
        ))}
        {tutorials.length === 0 && <p>No tutorials added.</p>}
      </ol>
    </div>
  );
}
