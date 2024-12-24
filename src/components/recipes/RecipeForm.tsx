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

export const RecipeForm = () => {
  const [ingredients, setIngredients] = useState([{ name: "", amount: "", unit: "" }]);
  const [selectedClient, setSelectedClient] = useState<string>("");

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

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "", unit: "" }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

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
          <Input id="name" placeholder="Enter recipe name" className="mt-1" />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter recipe description"
            className="mt-1"
          />
        </div>

        <div>
          <Label>Ingredients</Label>
          <div className="space-y-4 mt-2">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-4 items-start fade-in">
                <Input placeholder="Ingredient name" />
                <Input placeholder="Amount" className="w-24" />
                <Input placeholder="Unit" className="w-24" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeIngredient(index)}
                  className="shrink-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
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
            placeholder="Enter cooking instructions"
            className="mt-1"
            rows={6}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button>Save Recipe</Button>
      </div>
    </Card>
  );
};