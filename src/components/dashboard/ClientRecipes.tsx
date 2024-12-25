import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface ClientRecipesProps {
  client: {
    id: string;
    name: string;
  };
  onBack: () => void;
}

export const ClientRecipes = ({ client, onBack }: ClientRecipesProps) => {
  const navigate = useNavigate();
  
  const { data: recipes = [] } = useQuery({
    queryKey: ["recipes", client.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("client_id", client.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-semibold">{client.name}'s Recipes</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {recipes.map((recipe) => (
          <Card 
            key={recipe.id} 
            className="p-6 hover:bg-accent cursor-pointer transition-colors"
            onClick={() => navigate(`/recipes/${recipe.id}`)}
          >
            <h3 className="text-lg font-semibold">{recipe.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{recipe.description}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Created: {new Date(recipe.created_at).toLocaleDateString()}
            </p>
          </Card>
        ))}
        {recipes.length === 0 && (
          <p className="text-muted-foreground col-span-2 text-center py-8">
            No recipes found for this client
          </p>
        )}
      </div>
    </div>
  );
};