"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
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
      success: false,
    };
  }
  const { email, password } = result.data;
  if (email === "admin@pxconsulting.in" && password === "pxcDDDAAA@123") {
    cookies().set("admin", "true", { path: "/" });
    return { errors: {}, success: true };
  }
  return { errors: { general: "Invalid credentials" }, success: false };
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
      success: false,
    };
  }
  const { email, password } = result.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { errors: { general: "Invalid credentials" }, success: false };
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return { errors: { general: "Invalid credentials" }, success: false };
  const today = new Date();
  if (user.status !== "ACTIVE" || user.endDate < today) {
    return { errors: { general: "Membership Expired" }, success: false };
  }
  cookies().set("userId", String(user.id), { path: "/" });
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date(), status: "ACTIVE" },
  });
  return { errors: {}, success: true };
}
