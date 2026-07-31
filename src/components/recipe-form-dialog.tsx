"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { Recipe, RecipeFormData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RecipeFormDialogProps {
  open: boolean;
  recipe: Recipe | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RecipeFormData) => void;
}

export function RecipeFormDialog({
  open,
  recipe,
  onOpenChange,
  onSubmit,
}: RecipeFormDialogProps) {
  const [title, setTitle] = useState(recipe?.title ?? "");
  const [description, setDescription] = useState(recipe?.description ?? "");
  const [imageUrl, setImageUrl] = useState(recipe?.imageUrl ?? "");
  const [ingredients, setIngredients] = useState(recipe?.ingredients ?? "");
  const [instructions, setInstructions] = useState(recipe?.instructions ?? "");
  const [tags, setTags] = useState(recipe?.tags.join(", ") ?? "");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedTags = Array.from(
      new Set(
        tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    );
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      ingredients: ingredients.trim(),
      instructions: instructions.trim(),
      tags: parsedTags,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-3rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{recipe ? "Edit Recipe" : "Add Recipe"}</DialogTitle>
          <DialogDescription>
            {recipe
              ? "Update the details of your recipe."
              : "Fill in the details to add a new recipe to your book."}
          </DialogDescription>
        </DialogHeader>
        <form id="recipe-form" onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="recipe-title">Title</Label>
            <Input
              id="recipe-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Creamy Garlic Butter Pasta"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="recipe-description">Description</Label>
            <Textarea
              id="recipe-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short, mouth-watering summary of the dish."
              rows={2}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="recipe-image-url">Image URL</Label>
            <Input
              id="recipe-image-url"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://.../photo.jpg"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to use a gradient placeholder.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="recipe-ingredients">Ingredients</Label>
            <Textarea
              id="recipe-ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="One ingredient per line…"
              rows={5}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="recipe-instructions">Instructions</Label>
            <Textarea
              id="recipe-instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="One step per line…"
              rows={5}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="recipe-tags">Tags</Label>
            <Input
              id="recipe-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Dinner, Vegetarian, Quick"
            />
            <p className="text-xs text-muted-foreground">
              Separate tags with commas.
            </p>
          </div>
        </form>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="recipe-form">
            {recipe ? "Save Changes" : "Add Recipe"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
