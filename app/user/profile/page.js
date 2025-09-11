import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ensureChecklists, getChecklist } from "@/lib/checklists";
import UserProfile from "@/components/user-profile";
import { formatDate } from "@/lib/utils";

export default async function UserProfilePage() {
  const userIdCookie = cookies().get("userId");
  if (!userIdCookie) redirect("/");
  const id = Number(userIdCookie.value);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) redirect("/");
  await ensureChecklists(user);
  const checklist = await getChecklist(id);
  const formattedUser = {
    ...user,
    startDate: formatDate(user.startDate),
    endDate: formatDate(user.endDate),
  };
  return (
    <div className="p-4 space-y-6">
      <Link href="/user" className="text-sm text-muted-foreground hover:underline">
        &larr; Back
      </Link>
      <UserProfile user={formattedUser} checklist={checklist} />
    </div>
  );
}
