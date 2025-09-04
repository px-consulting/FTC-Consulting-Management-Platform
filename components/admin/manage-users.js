import { prisma } from "@/lib/prisma";
import AddUserDialog from "./add-user-dialog";
import UserCard from "./user-card";

export default async function ManageUsers() {
  const users = await prisma.user.findMany({ orderBy: { id: "desc" } });
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddUserDialog />
      </div>
      <div className="space-y-4">
        {users.map((u) => (
          <UserCard key={u.id} user={u} />
        ))}
        {users.length === 0 && <p>No users added.</p>}
      </div>
    </div>
  );
}
