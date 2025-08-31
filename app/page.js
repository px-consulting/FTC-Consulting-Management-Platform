'use client';

import { useActionState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginAdmin, loginUser } from "./actions";

const initialState = { errors: {} };

export default function Home() {
  const [userState, userAction, userPending] = useActionState(
    loginUser,
    initialState
  );
  const [adminState, adminAction, adminPending] = useActionState(
    loginAdmin,
    initialState
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 space-y-6">
      <h1 className="text-2xl font-bold">FTC Consulting Management Platform</h1>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">User Login</TabsTrigger>
              <TabsTrigger value="admin">Admin Login</TabsTrigger>
            </TabsList>
            <TabsContent value="user">
              <form action={userAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user-email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="user-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                  {userState.errors.email && (
                    <p className="text-sm text-red-500">{userState.errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-password">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="user-password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                  {userState.errors.password && (
                    <p className="text-sm text-red-500">{userState.errors.password}</p>
                  )}
                </div>
                {userState.errors.general && (
                  <p className="text-sm text-center text-red-500">{userState.errors.general}</p>
                )}
                <div className="flex justify-center">
                  <Button type="submit" disabled={userPending}>
                    {userPending ? "Loading..." : "Login"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="admin">
              <form action={adminAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="admin-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                  {adminState.errors.email && (
                    <p className="text-sm text-red-500">{adminState.errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="admin-password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                  {adminState.errors.password && (
                    <p className="text-sm text-red-500">{adminState.errors.password}</p>
                  )}
                </div>
                {adminState.errors.general && (
                  <p className="text-sm text-center text-red-500">{adminState.errors.general}</p>
                )}
                <div className="flex justify-center">
                  <Button type="submit" disabled={adminPending}>
                    {adminPending ? "Loading..." : "Login"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

