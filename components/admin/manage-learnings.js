import { prisma } from "@/lib/prisma";
import AddLearningModuleDialog from "./add-learning-module-dialog";
import LearningModuleCard from "./learning-module-card";

export default async function ManageLearnings() {
  const modules = await prisma.learningModule.findMany({
    orderBy: { id: "desc" },
    select: { id: true, name: true, description: true, active: true },
  });
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddLearningModuleDialog />
      </div>
      <div className="space-y-4">
        {modules.map((m) => (
          <LearningModuleCard key={m.id} module={m} />
        ))}
        {modules.length === 0 && <p>No modules uploaded.</p>}
      </div>
    </div>
  );
}
