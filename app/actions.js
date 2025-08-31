"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Valid email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export async function loginAdmin(prevState, formData) {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return {
      errors: {
        email: errors.email?.[0],
        password: errors.password?.[0],
      },
    };
  }
  const { email, password } = result.data;
  if (email === "admin@pxconsulting.in" && password === "pxcDDDAAA@123") {
    cookies().set("admin", "true", { path: "/" });
    redirect("/admin");
  }
  return { errors: { general: "Invalid credentials" } };
}

export async function loginUser(prevState, formData) {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return {
      errors: {
        email: errors.email?.[0],
        password: errors.password?.[0],
      },
    };
  }
  const { email, password } = result.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { errors: { general: "Invalid credentials" } };
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return { errors: { general: "Invalid credentials" } };
  cookies().set("userId", String(user.id), { path: "/" });
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date(), status: "ACTIVE" },
  });
  redirect("/user");
}
