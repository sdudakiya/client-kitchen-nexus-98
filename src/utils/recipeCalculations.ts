import { RecipeIngredient } from "@/integrations/supabase/types";

export const calculateMasterConfigurations = (
  ingredients: RecipeIngredient[],
  moistureInProduct: number,
  allowancePercentage: number
) => {
  const totalWeight = ingredients.reduce((sum, ing) => sum + Number(ing.weight), 0);
  const totalWaterInKg = ingredients.reduce((sum, ing) => sum + ing.waterInKg, 0);
  
  const finalDryWt = totalWeight - totalWaterInKg;
  const moisture = (moistureInProduct /100) * finalDryWt;
  const finalOutput = finalDryWt + moisture;
  const finalQuantity = finalOutput - (finalOutput * (allowancePercentage / 100));

  return {
    totalWeight,
    totalWaterInKg,
    finalDryWt,
    moisture,
    finalOutput,
    finalQuantity
  };
};

export const calculateIngredientTotals = (
  ingredients: RecipeIngredient[],
  finalOutput: number,
  finalQuantity: number,
  productionQuantity: number,
  allowancePercentage: number
) => {
  const totalWeight = ingredients.reduce((sum, ing) => sum + (Number(ing.weight) || 0), 0);
  
  return ingredients.map(ing => ({
    ...ing,
    ingredientPercentage: totalWeight ? (Number(ing.weight) / totalWeight) * 100 : 0,
    bomPercentage: finalOutput ? (Number(ing.weight) / finalOutput) * 100 : 0,
    waterInKg: (Number(ing.weight) * (Number(ing.moisturePercentage) / 100)) || 0,
    bomWithAllowance: finalQuantity ? (Number(ing.weight) / finalQuantity) * 100 : 0,
    bomQtyTheoretical: (Number(ing.weight) / finalOutput) * productionQuantity,
    bomQtyWithAllowance: ((Number(ing.weight) / finalOutput) * productionQuantity) * (1 + (allowancePercentage / 100)),
    totalCost: Number(ing.rate) * (((Number(ing.weight) / finalOutput) * productionQuantity) * (1 + (allowancePercentage / 100)))
  }));
};