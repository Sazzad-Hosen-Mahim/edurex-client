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
import { signupUser } from "@/src/features/auth/authSlice";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading, error, user } = useSelector(
    (state: RootState) => state.auth
  );

  console.log(user, "current user");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordError("");

    try {
      const resultAction = await dispatch(signupUser({ email, password }));
      console.log(resultAction, "result action in signup");
      // @ts-ignore
      if (resultAction.payload?.user) {
        router.push("/login");
      }
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-16">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <BookOpen className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">Edurex</span>
        </div>

        <CardDescription>Please sign up to your account</CardDescription>
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-2 border-black shadow-lg"
              required
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </Button>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>

        <div className="mt-6 text-center space-y-2">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
