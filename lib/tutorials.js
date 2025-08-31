"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addTutorial(formData) {
  const name = formData.get("name");
  const description = formData.get("description");
  const youtubeUrl = formData.get("youtubeUrl");
  await prisma.tutorial.create({ data: { name, description, youtubeUrl } });
  revalidatePath("/admin");
}

export async function toggleTutorial(id, active) {
  await prisma.tutorial.update({ where: { id }, data: { active } });
  revalidatePath("/admin");
}

export async function deleteTutorial(id) {
  await prisma.tutorial.delete({ where: { id } });
  revalidatePath("/admin");
}
