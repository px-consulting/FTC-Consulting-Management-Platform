import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { completeOnboarding } from "@/lib/users";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";

export default async function OnboardingPage() {
  const userIdCookie = cookies().get("userId");
  if (!userIdCookie) redirect("/");
  const id = Number(userIdCookie.value);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) redirect("/");
  if (user.businessName || user.companyAddress || user.employeeCount !== null) {
    redirect("/user");
  }

  async function handleSubmit(formData) {
    "use server";
    await completeOnboarding(id, formData);
    redirect("/user");
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-heading font-bold text-center">Onboarding</h1>
      <form action={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input defaultValue={user.name} disabled />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input defaultValue={user.email} disabled />
        </div>
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input defaultValue={user.phone || ""} disabled />
        </div>
        <div className="space-y-2">
          <Label>Membership Taken</Label>
          <Input defaultValue={user.membership} disabled />
        </div>
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input defaultValue={user.startDate.toISOString().split("T")[0]} disabled />
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <Input defaultValue={user.endDate.toISOString().split("T")[0]} disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name</Label>
          <Input id="businessName" name="businessName" placeholder="Enter business name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyAddress">Company Address</Label>
          <Input id="companyAddress" name="companyAddress" placeholder="Enter company address" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="employeeCount">Total Employee Count</Label>
          <Input id="employeeCount" name="employeeCount" type="number" placeholder="Enter total employees" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="image">Profile Image</Label>
          <Input id="image" name="image" type="file" accept="image/*" />
        </div>
        <SubmitButton type="submit" pendingText="Saving...">Save</SubmitButton>
      </form>
    </div>
  );
}
