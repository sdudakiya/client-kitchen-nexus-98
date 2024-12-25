import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Minus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { RecipeIngredient } from "@/types/recipe";
import { MasterConfigurations } from "./MasterConfigurations";
import { calculateMasterConfigurations, calculateIngredientTotals } from "@/utils/recipeCalculations";

export const RecipeForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [moistureInProduct, setMoistureInProduct] = useState(0);
  const [allowancePercentage, setAllowancePercentage] = useState(0);
  const [productionQuantity, setProductionQuantity] = useState(0);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([{
    name: "",
    amount: "",
    unit: "",
    weight: 0,
    ingredientPercentage: 0,
    bomPercentage: 0,
    moisturePercentage: 0,
    waterInKg: 0,
    rate: 0,
    bomWithAllowance: 0,
    bomQtyTheoretical: 0,
    bomQtyWithAllowance: 0,
    totalCost: 0
  }]);

  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const masterConfig = calculateMasterConfigurations(
    ingredients,
    moistureInProduct,
    allowancePercentage
  );

  const addIngredient = () => {
    const newIngredient: RecipeIngredient = {
      name: "",
      amount: "",
      unit: "",
      weight: 0,
      ingredientPercentage: 0,
      bomPercentage: 0,
      moisturePercentage: 0,
      waterInKg: 0,
      rate: 0,
      bomWithAllowance: 0,
      bomQtyTheoretical: 0,
      bomQtyWithAllowance: 0,
      totalCost: 0
    };
    setIngredients(prev => calculateIngredientTotals(
      [...prev, newIngredient],
      masterConfig.finalOutput,
      masterConfig.finalQuantity,
      productionQuantity,
      allowancePercentage
    ));
  };

  const removeIngredient = (index: number) => {
    setIngredients(prev => calculateIngredientTotals(
      prev.filter((_, i) => i !== index),
      masterConfig.finalOutput,
      masterConfig.finalQuantity,
      productionQuantity,
      allowancePercentage
    ));
  };

  const updateIngredient = (index: number, field: keyof RecipeIngredient, value: string | number) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: value
    };
    setIngredients(calculateIngredientTotals(
      newIngredients,
      masterConfig.finalOutput,
      masterConfig.finalQuantity,
      productionQuantity,
      allowancePercentage
    ));
  };

  const calculateTotals = () => {
    return {
      weight: ingredients.reduce((sum, ing) => sum + Number(ing.weight), 0),
      ingredientPercentage: 100,
      waterInKg: ingredients.reduce((sum, ing) => sum + ing.waterInKg, 0),
      totalCost: ingredients.reduce((sum, ing) => sum + ing.totalCost, 0)
    };
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to create a recipe");
        return;
      }

      if (!selectedClient) {
        toast.error("Please select a client");
        return;
      }

      if (!name) {
        toast.error("Please enter a recipe name");
        return;
      }

      const { error } = await supabase
        .from("recipes")
        .insert([{
          name,
          description,
          instructions,
          ingredients,
          client_id: selectedClient,
          created_by: user.id,
          moistureInProduct,
          finalDryWt: masterConfig.finalDryWt,
          moisture: masterConfig.moisture,
          finalOutput: masterConfig.finalOutput,
          allowancePercentage,
          finalQuantity: masterConfig.finalQuantity,
          productionQuantity
        }]);

      if (error) throw error;

      toast.success("Recipe created successfully");
      navigate(`/clients/${selectedClient}`);
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast.error("Error creating recipe");
    }
  };

  const totals = calculateTotals();

  return (
    <Card className="p-6 space-y-8">
      <div className="space-y-4">
        <div>
          <Label htmlFor="client">Client</Label>
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="name">Recipe Name</Label>
          <Input 
            id="name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter recipe name" 
            className="mt-1" 
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter recipe description"
            className="mt-1"
          />
        </div>

        <MasterConfigurations
          moistureInProduct={moistureInProduct}
          setMoistureInProduct={setMoistureInProduct}
          finalDryWt={masterConfig.finalDryWt}
          moisture={masterConfig.moisture}
          finalOutput={masterConfig.finalOutput}
          allowancePercentage={allowancePercentage}
          setAllowancePercentage={setAllowancePercentage}
          finalQuantity={masterConfig.finalQuantity}
          productionQuantity={productionQuantity}
          setProductionQuantity={setProductionQuantity}
          totalWeight={totals.weight}
          totalWaterInKg={totals.waterInKg}
        />

        <div>
          <Label>Ingredients</Label>
          <div className="space-y-4 mt-2 overflow-x-auto">
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
                  <th className="px-2"></th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((ingredient, index) => (
                  <tr key={index} className="text-sm">
                    <td className="p-1">
                      <Input
                        value={ingredient.name}
                        onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                        className="w-full"
                      />
                    </td>
                    <td className="p-1">
                      <Input
                        type="number"
                        value={ingredient.weight}
                        onChange={(e) => updateIngredient(index, 'weight', Number(e.target.value))}
                        className="w-24"
                      />
                    </td>
                    <td className="p-1">
                      <Input
                        value={ingredient.ingredientPercentage.toFixed(2)}
                        readOnly
                        className="w-20 bg-gray-50"
                      />
                    </td>
                    <td className="p-1">
                      <Input
                        value={ingredient.bomPercentage.toFixed(2)}
                        readOnly
                        className="w-20 bg-gray-50"
                      />
                    </td>
                    <td className="p-1">
                      <Input
                        type="number"
                        value={ingredient.moisturePercentage}
                        onChange={(e) => updateIngredient(index, 'moisturePercentage', Number(e.target.value))}
                        className="w-24"
                      />
                    </td>
                    <td className="p-1">
                      <Input
                        value={ingredient.waterInKg.toFixed(2)}
                        readOnly
                        className="w-24 bg-gray-50"
                      />
                    </td>
                    <td className="p-1">
                      <Input
                        type="number"
                        value={ingredient.rate}
                        onChange={(e) => updateIngredient(index, 'rate', Number(e.target.value))}
                        className="w-24"
                      />
                    </td>
                    <td className="p-1">
                      <Input
                        value={ingredient.bomWithAllowance.toFixed(2)}
                        readOnly
                        className="w-24 bg-gray-50"
                      />
                    </td>
                    <td className="p-1">
                      <Input
                        value={ingredient.bomQtyTheoretical.toFixed(2)}
                        readOnly
                        className="w-24 bg-gray-50"
                      />
                    </td>
                    <td className="p-1">
                      <Input
                        value={ingredient.bomQtyWithAllowance.toFixed(2)}
                        readOnly
                        className="w-24 bg-gray-50"
                      />
                    </td>
                    <td className="p-1">
                      <Input
                        value={ingredient.totalCost.toFixed(2)}
                        readOnly
                        className="w-24 bg-gray-50"
                      />
                    </td>
                    <td className="p-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeIngredient(index)}
                        className="shrink-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </td>
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
                  <td className="p-1"></td>
                </tr>
              </tbody>
            </table>
            <Button
              type="button"
              variant="outline"
              onClick={addIngredient}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Ingredient
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="instructions">Instructions</Label>
          <Textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Enter cooking instructions"
            className="mt-1"
            rows={6}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit}>Save Recipe</Button>
      </div>
    </Card>
  );
};