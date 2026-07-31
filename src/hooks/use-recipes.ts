"use client";

import { useCallback, useEffect, useState } from "react";
import type { Recipe, RecipeFormData } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";

interface RecipeRow {
  id: string;
  title: string;
  description: string;
  image_url: string;
  ingredients: string;
  instructions: string;
  tags: string[];
  created_at: string;
}

function toRecipe(row: RecipeRow): Recipe {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    ingredients: row.ingredients,
    instructions: row.instructions,
    tags: row.tags,
  };
}

function toRow(data: RecipeFormData): Omit<RecipeRow, "id" | "created_at"> {
  return {
    title: data.title,
    description: data.description,
    image_url: data.imageUrl,
    ingredients: data.ingredients,
    instructions: data.instructions,
    tags: data.tags,
  };
}

async function fetchRecipes(): Promise<RecipeRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as RecipeRow[];
}

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchRecipes();
      setRecipes(rows.map(toRecipe));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchRecipes()
      .then((rows) => {
        if (cancelled) return;
        setRecipes(rows.map(toRecipe));
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const addRecipe = useCallback(async (data: RecipeFormData) => {
    const supabase = createClient();
    const { data: row, error: insertError } = await supabase
      .from("recipes")
      .insert(toRow(data))
      .select()
      .single();

    if (insertError) throw new Error(insertError.message);
    setRecipes((prev) => [toRecipe(row as RecipeRow), ...prev]);
  }, []);

  const updateRecipe = useCallback(async (id: string, data: RecipeFormData) => {
    const supabase = createClient();
    const { data: row, error: updateError } = await supabase
      .from("recipes")
      .update(toRow(data))
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw new Error(updateError.message);
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? toRecipe(row as RecipeRow) : r))
    );
  }, []);

  const deleteRecipe = useCallback(async (id: string) => {
    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from("recipes")
      .delete()
      .eq("id", id);

    if (deleteError) throw new Error(deleteError.message);
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { recipes, loading, error, refresh, addRecipe, updateRecipe, deleteRecipe };
}
