"use client";

import { useState } from "react";
import { ChefHat } from "lucide-react";
import type { Recipe } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

const MAX_VISIBLE_TAGS = 3;

function RecipeImage({ src, title }: { src: string; title: string }) {
  const [failed, setFailed] = useState(false);
  const showFallback = !src.trim() || failed;

  if (showFallback) {
    return (
      <div
        aria-hidden
        className="flex aspect-[4/3] w-full items-center justify-center bg-linear-to-br from-orange-200 via-red-100 to-amber-200"
      >
        <ChefHat className="size-12 text-orange-600/60" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={title}
      onError={() => setFailed(true)}
      className="aspect-[4/3] w-full object-cover"
    />
  );
}

export function RecipeCard({
  recipe,
  onView,
}: {
  recipe: Recipe;
  onView: (recipe: Recipe) => void;
}) {
  const visibleTags = recipe.tags.slice(0, MAX_VISIBLE_TAGS);
  const extraTags = recipe.tags.length - visibleTags.length;

  return (
    <Card className="group/card h-full transition-shadow hover:shadow-lg hover:shadow-orange-900/10">
      <RecipeImage src={recipe.imageUrl} title={recipe.title} />
      <CardContent className="flex flex-1 flex-col gap-2 pt-4">
        <CardTitle className="line-clamp-1 text-lg">{recipe.title}</CardTitle>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {recipe.description}
        </p>
        {recipe.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {visibleTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-orange-100/80 text-orange-800 dark:bg-orange-500/15 dark:text-orange-200"
              >
                {tag}
              </Badge>
            ))}
            {extraTags > 0 && (
              <Badge variant="outline" className="text-muted-foreground">
                +{extraTags}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onView(recipe)}
        >
          View
        </Button>
      </CardFooter>
    </Card>
  );
}
