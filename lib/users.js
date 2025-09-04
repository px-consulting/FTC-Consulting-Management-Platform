"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

function generatePassword() {
  return Math.random().toString(36).slice(-8);
}

export async function addUser(formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const membership = formData.get("membership");
  const startDate = new Date(formData.get("startDate"));
  const endDate = new Date(formData.get("endDate"));
  const plainPassword = generatePassword();
  const hashed = await bcrypt.hash(plainPassword, 10);
  await prisma.user.create({
    data: {
      name,
      email,
      membership,
      startDate,
      endDate,
      password: hashed,
      passwordPlain: plainPassword,
    },
  });
  revalidatePath("/admin");
}

export async function deleteUser(id) {
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin");
}

export async function updateCredentials(id, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id },
    data: { email, password: hashed, passwordPlain: password },
  });
  revalidatePath("/admin");
}

export async function setUserActive(id, active) {
  await prisma.user.update({
    where: { id },
    data: { status: active ? "ACTIVE" : "EXPIRED" },
  });
  revalidatePath("/admin");
}
