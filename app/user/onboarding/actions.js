"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { completeOnboarding } from "@/lib/users";

export async function submitOnboarding(formData) {
  const userIdCookie = cookies().get("userId");
  if (!userIdCookie) redirect("/");
  const id = Number(userIdCookie.value);
  await completeOnboarding(id, formData);
  redirect("/user");
}
