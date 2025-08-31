import { prisma } from "@/lib/prisma";
import { SubmitButton } from "@/components/ui/submit-button";
import AddLearningModuleDialog from "./add-learning-module-dialog";
import { toggleModule, deleteModule } from "@/lib/learning-modules";

export default async function ManageLearnings() {
  const modules = await prisma.learningModule.findMany({ orderBy: { id: "desc" } });
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddLearningModuleDialog />
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
