import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { completeOnboarding } from "@/lib/users";
import OnboardingForm from "@/components/user/onboarding-form";

export default async function OnboardingPage() {
  const userIdCookie = cookies().get("userId");
  if (!userIdCookie) redirect("/");
  const id = Number(userIdCookie.value);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) redirect("/");
  if (
    user.businessName &&
    user.companyAddress &&
    user.annualRevenue !== null &&
    user.employeeCount !== null &&
    user.manufacturing !== null &&
    user.businessChallenges.length > 0
  ) {
    redirect("/user");
  }

  async function handleSubmit(formData) {
    "use server";
    await completeOnboarding(id, formData);
    redirect("/user");
  }

  const formattedUser = {
    ...user,
    startDate: user.startDate.toISOString().split("T")[0],
    endDate: user.endDate.toISOString().split("T")[0],
  };
  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-heading font-bold text-center">Onboarding</h1>
      <OnboardingForm user={formattedUser} action={handleSubmit} />
    </div>
  );
}
