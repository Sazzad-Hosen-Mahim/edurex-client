"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { AppDispatch, RootState } from "@/src/store";
import { loginUser } from "@/src/features/auth/authSlice";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading, error, user } = useSelector(
    (state: RootState) => state.auth
  );

  console.log(user, "current user");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const resultAction = await dispatch(loginUser({ email, password }));
      console.log(resultAction, "result action");
      // @ts-ignore
      if (resultAction.payload?.user.role === "admin") {
        router.push("/admin");
      } else if (resultAction.payload?.user.role === "user") {
        router.push("/courses");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-16">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <BookOpen className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">Edurex</span>
        </div>

        <CardDescription>
          Sign in to your account to continue learning
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 border-black shadow-lg"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-2 border-black shadow-lg"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>

        <div className="mt-6 text-center space-y-2">
          {/* <Link
            href="/auth/forgot-password"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Forgot your password?
          </Link> */}
          <div className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
