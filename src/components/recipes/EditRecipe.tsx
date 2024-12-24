import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Minus, ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const EditRecipe = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState<Array<{ name: string; amount: string; unit: string }>>([]);

  const { data: recipe } = useQuery({
    queryKey: ["recipe", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (recipe) {
      setName(recipe.name);
      setDescription(recipe.description || "");
      setInstructions(recipe.instructions || "");
      setIngredients(recipe.ingredients || [{ name: "", amount: "", unit: "" }]);
    }
  }, [recipe]);

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "", unit: "" }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from("recipes")
        .update({
          name,
          description,
          instructions,
          ingredients
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Recipe updated successfully");
      navigate(-1);
    } catch (error) {
      console.error('Error updating recipe:', error);
      toast.error("Error updating recipe");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-semibold">Edit Recipe</h2>
      </div>

      <Card className="p-6 space-y-8">
        <div className="space-y-4">
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

          <div>
            <Label>Ingredients</Label>
            <div className="space-y-4 mt-2">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-4 items-start fade-in">
                  <Input 
                    placeholder="Ingredient name" 
                    value={ingredient.name}
                    onChange={(e) => {
                      const newIngredients = [...ingredients];
                      newIngredients[index].name = e.target.value;
                      setIngredients(newIngredients);
                    }}
                  />
                  <Input 
                    placeholder="Amount" 
                    className="w-24"
                    value={ingredient.amount}
                    onChange={(e) => {
                      const newIngredients = [...ingredients];
                      newIngredients[index].amount = e.target.value;
                      setIngredients(newIngredients);
                    }}
                  />
                  <Input 
                    placeholder="Unit" 
                    className="w-24"
                    value={ingredient.unit}
                    onChange={(e) => {
                      const newIngredients = [...ingredients];
                      newIngredients[index].unit = e.target.value;
                      setIngredients(newIngredients);
                    }}
                  />
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
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Enter cooking instructions"
              className="mt-1"
              rows={6}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSubmit}>Update Recipe</Button>
        </div>
      </Card>
    </div>
  );
};