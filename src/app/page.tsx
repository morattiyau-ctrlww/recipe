"use client";

import { useMemo, useState } from "react";
import { BookOpen, Heart, Plus, Search, X } from "lucide-react";
import type { Recipe, RecipeFormData } from "@/lib/types";
import { useRecipes } from "@/hooks/use-recipes";
import { useAuth } from "@/hooks/use-auth";
import { useFavorites } from "@/hooks/use-favorites";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RecipeCard } from "@/components/recipe-card";
import { RecipeFormDialog } from "@/components/recipe-form-dialog";
import { RecipeDetailDialog } from "@/components/recipe-detail-dialog";
import { AuthMenu } from "@/components/auth/auth-menu";
import { AuthDialog } from "@/components/auth/auth-dialog";

export default function Home() {
  const {
    recipes,
    loading,
    error,
    refresh,
    addRecipe,
    updateRecipe,
    deleteRecipe,
  } = useRecipes();

  const { user } = useAuth();
  const favorites = useFavorites();
  const { favoriteIds } = favorites;

  const [formOpen, setFormOpen] = useState(false);
  const [formSession, setFormSession] = useState(0);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  const allTags = useMemo(
    () => Array.from(new Set(recipes.flatMap((r) => r.tags))).sort(),
    [recipes]
  );

  const filteredRecipes = useMemo(() => {
    const query = search.trim().toLowerCase();
    return recipes.filter((recipe) => {
      const matchesSearch =
        !query ||
        recipe.title.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query);
      const matchesTag =
        favoritesOnly || activeTag === "all" || recipe.tags.includes(activeTag);
      const matchesFavorites = !favoritesOnly || favoriteIds.has(recipe.id);
      return matchesSearch && matchesTag && matchesFavorites;
    });
  }, [recipes, search, activeTag, favoritesOnly, favoriteIds]);

  function openAddDialog() {
    setEditingRecipe(null);
    setFormSession((s) => s + 1);
    setFormOpen(true);
  }

  function openEditDialog(recipe: Recipe) {
    setEditingRecipe(recipe);
    setFormSession((s) => s + 1);
    setFormOpen(true);
  }

  async function handleSubmit(data: RecipeFormData) {
    try {
      setSaveError(null);
      if (editingRecipe) {
        await updateRecipe(editingRecipe.id, data);
      } else {
        await addRecipe(data);
      }
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : String(e));
    }
  }

  async function handleDelete(recipe: Recipe) {
    try {
      setSaveError(null);
      await deleteRecipe(recipe.id);
      setSelectedRecipe(null);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : String(e));
    }
  }

  function promptLogin(message: string) {
    setAuthMessage(message);
    setAuthOpen(true);
  }

  function handleFavoritesTabClick() {
    if (!user) {
      promptLogin("Please log in to view your favorites.");
      return;
    }
    setActiveTag("all");
    setFavoritesOnly((prev) => !prev);
  }

  async function handleToggleFavorite(recipeId: string) {
    if (!user) {
      promptLogin("Please log in to save recipes.");
      return;
    }
    try {
      setSaveError(null);
      await favorites.toggleFavorite(recipeId);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <div className="min-h-full">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-linear-to-br from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/30">
              <BookOpen className="size-6" />
            </span>
            <div>
              <h1 className="font-heading text-2xl font-bold tracking-tight">
                Recipe Book
              </h1>
              <p className="text-sm text-muted-foreground">
                Your collection of delicious homemade favorites.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AuthMenu
              onLoginClick={() => {
                setAuthMessage(null);
                setAuthOpen(true);
              }}
            />
            <Button onClick={openAddDialog} className="gap-1.5">
              <Plus data-icon="inline-start" />
              Add Recipe
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-4 py-6">
          <h2 className="text-lg font-semibold">
            {favoritesOnly
              ? "My Favorites"
              : activeTag === "all"
                ? "All Recipes"
                : `"${activeTag}" recipes`}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {filteredRecipes.length}
            </span>
          </h2>

          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipes by title or description…"
              className="h-10 pl-9 pr-9"
            />
            {search && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label="Clear search"
                onClick={() => setSearch("")}
                className="absolute top-1/2 right-2 -translate-y-1/2"
              >
                <X />
              </Button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm text-muted-foreground">Filter:</span>
            <Badge
              asChild
              variant={!favoritesOnly && activeTag === "all" ? "default" : "outline"}
              className="cursor-pointer"
            >
              <button
                type="button"
                onClick={() => {
                  setFavoritesOnly(false);
                  setActiveTag("all");
                }}
              >
                All
              </button>
            </Badge>
            <Badge
              asChild
              variant={favoritesOnly ? "default" : "outline"}
              className="cursor-pointer"
            >
              <button
                type="button"
                onClick={handleFavoritesTabClick}
                className="inline-flex items-center gap-1"
              >
                <Heart className={favoritesOnly ? "fill-current" : undefined} />
                My Favorites
                {user && (
                  <span className="tabular-nums">{favoriteIds.size}</span>
                )}
              </button>
            </Badge>
            {!favoritesOnly &&
              allTags.map((tag) => (
                <Badge
                  asChild
                  key={tag}
                  variant={activeTag === tag ? "default" : "secondary"}
                  className="cursor-pointer"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setFavoritesOnly(false);
                      setActiveTag(activeTag === tag ? "all" : tag);
                    }}
                  >
                    {tag}
                  </button>
                </Badge>
              ))}
          </div>
        </div>

        {saveError && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            <span>{saveError}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSaveError(null)}
            >
              Dismiss
            </Button>
          </div>
        )}

        {loading ? (
          <p className="py-16 text-center text-muted-foreground">
            Loading your recipes…
          </p>
        ) : error ? (
          <div className="mx-auto max-w-md rounded-xl border border-destructive/30 bg-destructive/5 py-8 text-center">
            <p className="font-medium">Couldn&apos;t load recipes</p>
            <p className="mt-1 text-sm text-destructive">{error}</p>
            <Button
              variant="outline"
              onClick={() => void refresh()}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="mx-auto max-w-sm rounded-xl border border-dashed border-border py-16 text-center">
            {favoritesOnly ? (
              <>
                <p className="font-medium">No favorites yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tap the heart on a recipe to save it here.
                </p>
              </>
            ) : search.trim() || activeTag !== "all" ? (
              <>
                <p className="font-medium">No matching recipes</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different search term or tag.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setActiveTag("all");
                    setFavoritesOnly(false);
                  }}
                  className="mt-4"
                >
                  Clear filters
                </Button>
              </>
            ) : (
              <>
                <p className="font-medium">No recipes yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add your first recipe to get started.
                </p>
                <Button onClick={openAddDialog} className="mt-4 gap-1.5">
                  <Plus data-icon="inline-start" />
                  Add Recipe
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onView={setSelectedRecipe}
                isFavorited={favoriteIds.has(recipe.id)}
                favoriteDisabled={
                  favorites.loading || favorites.pendingId === recipe.id
                }
                onToggleFavorite={() => void handleToggleFavorite(recipe.id)}
              />
            ))}
          </div>
        )}
      </main>

      <RecipeFormDialog
        key={formSession}
        open={formOpen}
        recipe={editingRecipe}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
      />

      <RecipeDetailDialog
        recipe={selectedRecipe}
        onOpenChange={(open) => {
          if (!open) setSelectedRecipe(null);
        }}
        onEdit={(recipe) => {
          openEditDialog(recipe);
          setSelectedRecipe(null);
        }}
        onDelete={handleDelete}
      />

      <AuthDialog
        open={authOpen}
        initialMessage={authMessage}
        onOpenChange={(open) => {
          setAuthOpen(open);
          if (!open) setAuthMessage(null);
        }}
      />
    </div>
  );
}
