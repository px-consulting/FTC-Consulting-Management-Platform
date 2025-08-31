import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return new Response("Invalid id", { status: 400 });
  }
  const learningModule = await prisma.learningModule.findUnique({
    where: { id },
    select: { file: true },
  });
  if (!learningModule || !learningModule.file) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(learningModule.file, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
    },
  });
}
