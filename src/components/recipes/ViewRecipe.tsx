import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Edit } from "lucide-react";
import { Recipe, RecipeIngredient, isRecipeIngredientArray } from "@/types/recipe";

export const ViewRecipe = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: recipe } = useQuery({
    queryKey: ["recipe", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Recipe;
    },
  });

  if (!recipe) return null;

  const ingredients = isRecipeIngredientArray(recipe.ingredients) ? recipe.ingredients : [];

  const totals = {
    weight: ingredients.reduce((sum, ing) => sum + Number(ing.weight), 0),
    ingredientPercentage: 100,
    waterInKg: ingredients.reduce((sum, ing) => sum + ing.waterInKg, 0),
    totalCost: ingredients.reduce((sum, ing) => sum + ing.totalCost, 0)
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-semibold">{recipe.name}</h2>
        </div>
        <Button onClick={() => navigate(`/recipes/${id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Recipe
        </Button>
      </div>

      <Card className="p-6 space-y-8">
        {recipe.description && (
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{recipe.description}</p>
          </div>
        )}

        <div>
          <h3 className="font-semibold mb-4">Master Configurations</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p>Moisture in Product: {recipe.moistureInProduct}%</p>
              <p>Final Dry Weight: {recipe.finalDryWt}</p>
              <p>Moisture: {recipe.moisture}</p>
              <p>Final Output: {recipe.finalOutput}</p>
            </div>
            <div className="space-y-2">
              <p>Allowance: {recipe.allowancePercentage}%</p>
              <p>Final Quantity: {recipe.finalQuantity}</p>
              <p>Production Quantity: {recipe.productionQuantity} Kg</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Ingredients</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-xs">
                  <th className="px-2">Name</th>
                  <th className="px-2">Weight</th>
                  <th className="px-2">Ing %</th>
                  <th className="px-2">BOM %</th>
                  <th className="px-2">Moisture %</th>
                  <th className="px-2">Water (Kg)</th>
                  <th className="px-2">Rate</th>
                  <th className="px-2">BOM w/Allow</th>
                  <th className="px-2">BOM Qty Theo</th>
                  <th className="px-2">BOM Qty w/Allow</th>
                  <th className="px-2">Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((ingredient: RecipeIngredient, index: number) => (
                  <tr key={index} className="text-sm">
                    <td className="p-1">{ingredient.name}</td>
                    <td className="p-1">{ingredient.weight.toFixed(3)}</td>
                    <td className="p-1">{ingredient.ingredientPercentage.toFixed(2)}</td>
                    <td className="p-1">{ingredient.bomPercentage.toFixed(2)}</td>
                    <td className="p-1">{ingredient.moisturePercentage.toFixed(2)}</td>
                    <td className="p-1">{ingredient.waterInKg.toFixed(3)}</td>
                    <td className="p-1">{ingredient.rate.toFixed(2)}</td>
                    <td className="p-1">{ingredient.bomWithAllowance.toFixed(2)}</td>
                    <td className="p-1">{ingredient.bomQtyTheoretical.toFixed(3)}</td>
                    <td className="p-1">{ingredient.bomQtyWithAllowance.toFixed(3)}</td>
                    <td className="p-1">{ingredient.totalCost.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="font-bold text-sm">
                  <td className="p-1">Totals</td>
                  <td className="p-1">{totals.weight.toFixed(2)}</td>
                  <td className="p-1">{totals.ingredientPercentage.toFixed(2)}</td>
                  <td className="p-1">-</td>
                  <td className="p-1">-</td>
                  <td className="p-1">{totals.waterInKg.toFixed(2)}</td>
                  <td className="p-1">-</td>
                  <td className="p-1">-</td>
                  <td className="p-1">-</td>
                  <td className="p-1">-</td>
                  <td className="p-1">{totals.totalCost.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {recipe.instructions && (
          <div>
            <h3 className="font-semibold mb-2">Instructions</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{recipe.instructions}</p>
          </div>
        )}
      </Card>
    </div>
  );
};