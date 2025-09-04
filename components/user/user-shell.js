"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import TutorialCard from "./tutorial-card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Eye, Download, Menu, X } from "lucide-react";

export default function UserShell({ user, modules, tutorials, logout }) {
  const [view, setView] = useState("modules");
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold">Welcome {user.name}!</h1>
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
                  <button onClick={() => setView("modules")} className="text-left font-medium">
                    Learning Modules
                  </button>
                </SheetClose>
                <SheetClose asChild>
                  <button onClick={() => setView("tutorials")} className="text-left font-medium">
                    Tutorials
                  </button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
          <Dialog>
            <DialogTrigger asChild>
              <button className="h-10 w-10 rounded-full overflow-hidden border">
                {user.imageUrl ? (
                  <img src={user.imageUrl} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-muted text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>
            </DialogTrigger>
            <DialogContent className="rounded-lg">
              <DialogHeader className="flex flex-row items-center justify-between">
                <DialogTitle>Profile</DialogTitle>
                <DialogClose className="cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </DialogClose>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {user.name}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Phone:</span> {user.phone}</p>
                <p><span className="font-medium">Membership:</span> {user.membership}</p>
                <p><span className="font-medium">Start Date:</span> {user.startDate}</p>
                <p><span className="font-medium">End Date:</span> {user.endDate}</p>
                {user.businessName && (
                  <p><span className="font-medium">Business Name:</span> {user.businessName}</p>
                )}
                {user.companyAddress && (
                  <p><span className="font-medium">Company Address:</span> {user.companyAddress}</p>
                )}
                {user.employeeCount !== null && (
                  <p><span className="font-medium">Total Employees:</span> {user.employeeCount}</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <form action={logout}>
            <Button type="submit" variant="destructive">
              Logout
            </Button>
          </form>
        </div>
      </div>
      <Tabs value={view} onValueChange={setView} className="hidden sm:block">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="modules">Learning Modules</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
        </TabsList>
      </Tabs>
      <div>
        {view === "modules" && (
          <div className="space-y-4">
            {modules.map((m) => (
              <div key={m.id} className="flex items-start justify-between rounded border p-4">
                <div className="pr-4">
                  <h3 className="font-medium">{m.name}</h3>
                  {m.description && (
                    <p className="text-sm text-muted-foreground">{m.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" title="View">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl rounded-lg" onInteractOutside={(e) => e.preventDefault()}>
                      <DialogHeader className="flex flex-row items-center justify-between">
                        <DialogTitle>{m.name}</DialogTitle>
                        <DialogClose className="cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none">
                          <X className="h-4 w-4" />
                          <span className="sr-only">Close</span>
                        </DialogClose>
                      </DialogHeader>
                      <iframe src={`/api/modules/${m.id}/file`} className="h-[75vh] w-full" />
                    </DialogContent>
                  </Dialog>
                  <a href={`/api/modules/${m.id}/file`} download target="_blank">
                    <Button variant="ghost" size="icon" title="Download">
                      <Download className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </div>
            ))}
            {modules.length === 0 && <p>No modules available.</p>}
          </div>
        )}
        {view === "tutorials" && (
          <div className="space-y-4">
            <ol className="space-y-6 max-w-3xl mx-auto">
              {tutorials.map((t, i) => (
                <li key={t.id}>
                  <TutorialCard tutorial={t} step={i + 1} />
                </li>
              ))}
              {tutorials.length === 0 && <p>No tutorials available.</p>}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
