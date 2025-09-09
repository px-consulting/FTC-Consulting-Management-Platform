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
  const phone = formData.get("phone");
  const businessName = formData.get("businessName");
  const membership = formData.get("membership");
  const startDate = new Date(formData.get("startDate"));
  const endDate = new Date(formData.get("endDate"));
  const plainPassword = generatePassword();
  const hashed = await bcrypt.hash(plainPassword, 10);
  await prisma.user.create({
    data: {
      name,
      email,
      phone,
      businessName,
      membership,
      startDate,
      endDate,
      password: hashed,
      passwordPlain: plainPassword,
      status: "ACTIVE",
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
    data: { status: active ? "ACTIVE" : "INACTIVE" },
  });
  revalidatePath("/admin");
}

export async function completeOnboarding(id, formData) {
  const companyAddress = formData.get("companyAddress") || null;
  const annualRevenue = formData.get("annualRevenue")
    ? Number(formData.get("annualRevenue"))
    : null;
  const employeeCount = formData.get("employeeCount")
    ? Number(formData.get("employeeCount"))
    : null;
  const manufacturing = formData.get("manufacturing")
    ? formData.get("manufacturing") === "yes"
    : null;
  const businessChallenges = formData
    .getAll("challenges")
    .map((c) => c.trim())
    .filter(Boolean);
  const image = formData.get("image");
  let imageUrl = null;
  if (image && typeof image === "object") {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    imageUrl = `data:${image.type};base64,${buffer.toString("base64")}`;
  }
  const password = formData.get("password");
  const data = {
    companyAddress,
    annualRevenue,
    employeeCount,
    manufacturing,
    businessChallenges,
    imageUrl,
  };
  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    data.password = hashed;
    data.passwordPlain = password;
  }
  await prisma.user.update({
    where: { id },
    data,
  });
  revalidatePath("/user");
}
