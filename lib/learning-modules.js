"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function addModule(formData) {
  const name = formData.get("name");
  const description = formData.get("description");
  const file = formData.get("file");
  let fileUrl = "";
  if (file && typeof file === "object") {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size exceeds 50MB limit");
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${randomUUID()}-${file.name}`;
    const dir = join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, fileName), buffer);
    fileUrl = `/uploads/${fileName}`;
  }
  await prisma.learningModule.create({ data: { name, description, fileUrl } });
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

