"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";

type AuthMode = "signin" | "signup";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMessage?: string | null;
}

export function AuthDialog({
  open,
  onOpenChange,
  initialMessage,
}: AuthDialogProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSignUp = mode === "signup";

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      if (initialMessage) setInfo(initialMessage);
    } else {
      setMode("signin");
      setEmail("");
      setPassword("");
      setError(null);
      setInfo(null);
      setLoading(false);
    }
    onOpenChange(nextOpen);
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError(null);
    setInfo(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      if (isSignUp) {
        const { session } = await signUp(email.trim(), password);
        if (session) {
          onOpenChange(false);
        } else {
          setMode("signin");
          setInfo(
            "Account created! Check your inbox for a confirmation link, then log in."
          );
        }
      } else {
        await signIn(email.trim(), password);
        onOpenChange(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {isSignUp ? "Create an account" : "Welcome back"}
          </DialogTitle>
          <DialogDescription>
            {isSignUp
              ? "Sign up to start saving your favorite recipes."
              : "Log in to access your recipe collection."}
          </DialogDescription>
        </DialogHeader>

        <form id="auth-form" onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="auth-email">Email</Label>
            <Input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="auth-password">Password</Label>
            <Input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              minLength={6}
              required
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          {info && (
            <p className="text-sm text-muted-foreground" role="status">
              {info}
            </p>
          )}
        </form>

        <DialogFooter>
          <Button
            type="submit"
            form="auth-form"
            disabled={loading}
            className="gap-1.5"
          >
            {loading && <Loader2 className="animate-spin" />}
            {isSignUp ? "Sign Up" : "Log In"}
          </Button>
        </DialogFooter>

        <p className="text-center text-sm text-muted-foreground">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button
            type="button"
            onClick={() => switchMode(isSignUp ? "signin" : "signup")}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {isSignUp ? "Log In" : "Sign Up"}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}
