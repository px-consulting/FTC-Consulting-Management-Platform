import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ensureChecklists, getChecklist } from "@/lib/checklists";
import UserProfile from "@/components/user-profile";

export default async function AdminUserProfilePage({ params }) {
  const id = Number(params.id);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return <div className="p-4">User not found</div>;
  }
  await ensureChecklists(user);
  const checklist = await getChecklist(id);
  const formattedUser = {
    ...user,
    startDate: user.startDate.toISOString().split("T")[0],
    endDate: user.endDate.toISOString().split("T")[0],
  };
  return (
    <div className="p-4 space-y-6">
      <Link href="/admin" className="text-sm text-muted-foreground hover:underline">
        &larr; Back
      </Link>
      <UserProfile user={formattedUser} checklist={checklist} isAdmin />
    </div>
  );
}
