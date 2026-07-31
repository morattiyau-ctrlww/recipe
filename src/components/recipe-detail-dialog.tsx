"use client";

import { useState } from "react";
import { ChefHat } from "lucide-react";
import type { Recipe } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RecipeDetailDialogProps {
  recipe: Recipe | null;
  onOpenChange: (open: boolean) => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
}

function DetailImage({ recipe }: { recipe: Recipe }) {
  const [failed, setFailed] = useState(false);

  if (!recipe.imageUrl.trim() || failed) {
    return (
      <div
        aria-hidden
        className="flex aspect-[16/9] w-full items-center justify-center rounded-t-xl bg-linear-to-br from-orange-200 via-red-100 to-amber-200"
      >
        <ChefHat className="size-14 text-orange-600/60" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={recipe.imageUrl}
      alt={recipe.title}
      onError={() => setFailed(true)}
      className="aspect-[16/9] w-full rounded-t-xl object-cover"
    />
  );
}

function DetailSection({
  title,
  items,
  ordered,
}: {
  title: string;
  items: string[];
  ordered: boolean;
}) {
  if (items.length === 0) return null;
  const ListTag = ordered ? "ol" : "ul";

  return (
    <div className="grid gap-2">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ListTag
        className={`grid gap-2 text-sm text-muted-foreground ${
          ordered ? "list-decimal" : "list-disc"
        } pl-5`}
      >
        {items.map((item, index) => (
          <li key={`${title}-${index}`}>{item}</li>
        ))}
      </ListTag>
    </div>
  );
}

export function RecipeDetailDialog({
  recipe,
  onOpenChange,
  onEdit,
  onDelete,
}: RecipeDetailDialogProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!recipe) return null;

  const ingredientLines = recipe.ingredients
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const instructionLines = recipe.instructions
    .split("\n")
    .map((l) => l.replace(/^\d+[.)]\s*/, "").trim())
    .filter(Boolean);

  return (
    <>
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[calc(100vh-3rem)] overflow-y-auto gap-0 p-0 sm:max-w-xl">
          <DetailImage recipe={recipe} />
          <div className="grid gap-4 p-4">
            <DialogHeader>
              <DialogTitle className="text-xl">{recipe.title}</DialogTitle>
              <DialogDescription>{recipe.description}</DialogDescription>
              {recipe.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {recipe.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-orange-100/80 text-orange-800 dark:bg-orange-500/15 dark:text-orange-200"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </DialogHeader>

            <DetailSection
              title="Ingredients"
              items={ingredientLines}
              ordered={false}
            />
            <DetailSection
              title="Instructions"
              items={instructionLines}
              ordered
            />
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
              Delete
            </Button>
            <Button variant="outline" onClick={() => onEdit(recipe)}>
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete recipe?</DialogTitle>
            <DialogDescription>
              &ldquo;{recipe.title}&rdquo; will be permanently removed from your
              recipe book.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(recipe);
                setConfirmOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
