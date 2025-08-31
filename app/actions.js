"use server";

import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase"; // not used yet but for future
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export async function loginAdmin(formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  if (email === "admin@pxconsulting.in" && password === "pxcDDDAAA@123") {
    cookies().set("admin", "true", { path: "/" });
    redirect("/admin");
  }
  return { error: "Invalid credentials" };
}

export async function loginUser(formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "Invalid credentials" };
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return { error: "Invalid credentials" };
  cookies().set("userId", String(user.id), { path: "/" });
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date(), status: "ACTIVE" },
  });
  redirect("/user");
}
