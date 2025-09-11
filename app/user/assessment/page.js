import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Assessment from "@/components/user/assessment";

export default async function AssessmentPage() {
  const userIdCookie = cookies().get("userId");
  if (!userIdCookie) redirect("/");
  const id = Number(userIdCookie.value);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) redirect("/");
  return (
    <div className="p-4 space-y-6">
      <Assessment user={user} />
    </div>
  );
}
