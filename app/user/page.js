import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function UserPage() {
  const userId = cookies().get("userId");
  if (!userId) redirect("/");
  return <div className="p-4">User dashboard coming soon.</div>;
}
