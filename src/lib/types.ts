export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ingredients: string;
  instructions: string;
  tags: string[];
}

export type RecipeFormData = Omit<Recipe, "id">;
