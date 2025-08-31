"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function addModule(formData) {
  const name = formData.get("name");
  const description = formData.get("description") || "";
  const file = formData.get("file");
  let fileBuffer = null;
  if (file && typeof file === "object") {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size exceeds 50MB limit");
    }
    const bytes = await file.arrayBuffer();
    fileBuffer = Buffer.from(bytes);
  }
  if (!fileBuffer) {
    throw new Error("File is required");
  }
  await prisma.learningModule.create({ data: { name, description, file: fileBuffer } });
  revalidatePath("/admin");
}

export async function toggleModule(id, active) {
  await prisma.learningModule.update({ where: { id }, data: { active } });
  revalidatePath("/admin");
}

export async function deleteModule(id) {
  await prisma.learningModule.delete({ where: { id } });
  revalidatePath("/admin");
}

