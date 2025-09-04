"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function AdminShell({ logout, learnings, tutorials, users }) {
  const [view, setView] = useState("learnings");

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold">Welcome Admin!</h1>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="sm:hidden" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="mt-6 flex flex-col space-y-4">
                <SheetClose asChild>
                  <button
                    onClick={() => setView("learnings")}
                    className="text-left font-medium"
                  >
                    Manage Learnings
                  </button>
                </SheetClose>
                <SheetClose asChild>
                  <button
                    onClick={() => setView("tutorials")}
                    className="text-left font-medium"
                  >
                    Manage Tutorials
                  </button>
                </SheetClose>
                <SheetClose asChild>
                  <button
                    onClick={() => setView("users")}
                    className="text-left font-medium"
                  >
                    Manage Users
                  </button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
          <form action={logout}>
            <Button type="submit" variant="secondary">
              Logout
            </Button>
          </form>
        </div>
      </div>
      <Tabs value={view} onValueChange={setView} className="hidden sm:block">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="learnings">Manage Learnings</TabsTrigger>
          <TabsTrigger value="tutorials">Manage Tutorials</TabsTrigger>
          <TabsTrigger value="users">Manage Users</TabsTrigger>
        </TabsList>
      </Tabs>
      <div>
        {view === "learnings" && learnings}
        {view === "tutorials" && tutorials}
        {view === "users" && users}
      </div>
    </div>
  );
}

