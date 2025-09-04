import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/admin-shell";
import ManageLearnings from "@/components/admin/manage-learnings";
import ManageTutorials from "@/components/admin/manage-tutorials";
import ManageUsers from "@/components/admin/manage-users";

export default async function AdminPage() {
  const isAdmin = cookies().get("admin");
  if (!isAdmin) redirect("/");

  async function logout() {
    "use server";
    cookies().delete("admin");
    redirect("/?logout=1");
  }

  return (
    <AdminShell
      logout={logout}
      learnings={<ManageLearnings />}
      tutorials={<ManageTutorials />}
      users={<ManageUsers />}
    />
  );
}
