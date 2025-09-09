import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import UserProfile from "@/components/user-profile";

export default async function UserProfilePage() {
  const userIdCookie = cookies().get("userId");
  if (!userIdCookie) redirect("/");
  const id = Number(userIdCookie.value);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) redirect("/");
  const formattedUser = {
    ...user,
    startDate: user.startDate.toISOString().split("T")[0],
    endDate: user.endDate.toISOString().split("T")[0],
  };
  return (
    <div className="p-4 space-y-6">
      <Link href="/user" className="text-sm text-muted-foreground hover:underline">
        &larr; Back
      </Link>
      <UserProfile user={formattedUser} />
    </div>
  );
}
