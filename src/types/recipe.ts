import { Json } from "@/integrations/supabase/types";

export interface RecipeIngredient {
  [key: string]: string | number; // Add index signature to make it compatible with Json type
  name: string;
  amount: string;
  unit: string;
  weight: number;
  ingredientPercentage: number;
  bomPercentage: number;
  moisturePercentage: number;
  waterInKg: number;
  rate: number;
  bomWithAllowance: number;
  bomQtyTheoretical: number;
  bomQtyWithAllowance: number;
  totalCost: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string | null;
  instructions: string | null;
  client_id: string;
  created_by: string;
  created_at: string;
  ingredients: RecipeIngredient[] | null;
  moistureInProduct: number | null;
  finalDryWt: number | null;
  moisture: number | null;
  finalOutput: number | null;
  finalQuantity: number | null;
  productionQuantity: number | null;
  allowancePercentage: number | null;
}

// Type guard to check if a JSON value is a RecipeIngredient array
export function isRecipeIngredientArray(json: Json | null): json is RecipeIngredient[] {
  if (!json || !Array.isArray(json)) return false;
  return json.every(item => 
    typeof item === 'object' && 
    item !== null && 
    'name' in item &&
    'weight' in item &&
    typeof item.name === 'string' &&
    typeof item.weight === 'number'
  );
}

// Helper function to convert RecipeIngredient array to Json
export function ingredientsToJson(ingredients: RecipeIngredient[]): Json {
  return ingredients as unknown as Json;
}