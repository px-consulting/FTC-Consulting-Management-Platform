import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SubmitButton } from "@/components/ui/submit-button";
import ManageLearnings from "@/components/admin/manage-learnings";
import ManageTutorials from "@/components/admin/manage-tutorials";
import ManageUsers from "@/components/admin/manage-users";

export default async function AdminPage() {
  const isAdmin = cookies().get("admin");
  if (!isAdmin) redirect("/");

  async function logout() {
    "use server";
    cookies().delete("admin");
    redirect("/");
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome Admin!</h1>
        <form action={logout}>
          <SubmitButton type="submit" variant="secondary" pendingText="Logging out...">
            Logout
          </SubmitButton>
        </form>
      </div>
      <Tabs defaultValue="learnings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="learnings">Manage Learnings</TabsTrigger>
          <TabsTrigger value="tutorials">Manage Tutorials</TabsTrigger>
          <TabsTrigger value="users">Manage Users</TabsTrigger>
        </TabsList>
        <TabsContent value="learnings">
          <ManageLearnings />
        </TabsContent>
        <TabsContent value="tutorials">
          <ManageTutorials />
        </TabsContent>
        <TabsContent value="users">
          <ManageUsers />
        </TabsContent>
      </Tabs>
    </div>
  );
}
