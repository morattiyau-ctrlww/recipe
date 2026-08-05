"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface FavoriteRow {
  recipe_id: string;
}

export function useFavorites() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [prevUserId, setPrevUserId] = useState<string | null>(null);

  if (userId !== prevUserId) {
    setPrevUserId(userId);
    setFavoriteIds(new Set());
    setLoading(userId !== null);
  }

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    const supabase = createClient();

    void supabase
      .from("favorites")
      .select("recipe_id")
      .eq("user_id", userId)
      .then(({ data, error }) => {
        if (cancelled) return;
        setLoading(false);
        if (error) {
          console.error("Failed to load favorites:", error.message);
          return;
        }
        setFavoriteIds(
          new Set(
            (data as FavoriteRow[] | null)?.map((row) => row.recipe_id) ?? []
          )
        );
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const isFavorited = useCallback(
    (recipeId: string) => favoriteIds.has(recipeId),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    async (recipeId: string) => {
      if (!user) {
        throw new Error("You must be logged in to save recipes.");
      }

      const supabase = createClient();
      setPendingId(recipeId);
      try {
        if (favoriteIds.has(recipeId)) {
          const { error } = await supabase
            .from("favorites")
            .delete()
            .eq("user_id", user.id)
            .eq("recipe_id", recipeId);
          if (error) throw new Error(error.message);
          setFavoriteIds((prev) => {
            const next = new Set(prev);
            next.delete(recipeId);
            return next;
          });
        } else {
          const { error } = await supabase
            .from("favorites")
            .insert({ user_id: user.id, recipe_id: recipeId });
          if (error) throw new Error(error.message);
          setFavoriteIds((prev) => new Set(prev).add(recipeId));
        }
      } finally {
        setPendingId(null);
      }
    },
    [favoriteIds, user]
  );

  return { favoriteIds, loading, pendingId, isFavorited, toggleFavorite };
}
