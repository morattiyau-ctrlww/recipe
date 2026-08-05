"use client";

import { useState } from "react";
import { LogIn, LogOut, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function AuthMenu({ onLoginClick }: { onLoginClick: () => void }) {
  const { user, loading, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    setSigningOut(true);
    setError(null);
    try {
      await signOut();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSigningOut(false);
    }
  }

  if (loading) {
    return (
      <div
        className="h-8 w-24 animate-pulse rounded-lg bg-muted"
        aria-hidden="true"
      />
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-1.5 text-sm text-muted-foreground sm:flex">
          <UserRound className="size-4" />
          {user.email}
        </div>
        <Button
          variant="outline"
          onClick={() => void handleSignOut()}
          disabled={signingOut}
          className="gap-1.5"
        >
          <LogOut />
          {signingOut ? "Logging out…" : "Log Out"}
        </Button>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <Button onClick={onLoginClick} className="gap-1.5">
      <LogIn />
      Log In
    </Button>
  );
}
