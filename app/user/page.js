import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import UserShell from "@/components/user/user-shell";

export default async function UserPage() {
  const userIdCookie = cookies().get("userId");
  if (!userIdCookie) redirect("/");
  const id = Number(userIdCookie.value);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) redirect("/");
  if (
    !user.businessName ||
    !user.companyAddress ||
    user.annualRevenue === null ||
    user.employeeCount === null ||
    user.manufacturing === null ||
    user.businessChallenges.length === 0
  ) {
    redirect("/user/onboarding");
  }
  const modules = await prisma.learningModule.findMany({
    where: { active: true },
    select: { id: true, name: true, description: true },
    orderBy: { id: "desc" },
  });
  const tutorials = await prisma.tutorial.findMany({
    where: { active: true },
    select: { id: true, name: true, description: true, youtubeUrl: true },
    orderBy: { id: "desc" },
  });
  const formattedUser = {
    ...user,
    startDate: user.startDate.toISOString().split("T")[0],
    endDate: user.endDate.toISOString().split("T")[0],
  };
  async function logout() {
    "use server";
    cookies().delete("userId");
    redirect("/?logout=1");
  }
  return (
    <UserShell
      user={formattedUser}
      modules={modules}
      tutorials={tutorials}
      logout={logout}
    />
  );
}
