import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

interface ClientRecipesProps {
  client: {
    id: number;
    name: string;
    recipes: number;
  };
  onBack: () => void;
}

export const ClientRecipes = ({ client, onBack }: ClientRecipesProps) => {
  // This would typically come from an API/database
  const clientRecipes = [
    { id: 1, name: "Quinoa Bowl", description: "Healthy lunch option", createdAt: "2024-02-15" },
    { id: 2, name: "Smoothie Bowl", description: "Breakfast recipe", createdAt: "2024-02-14" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-semibold">{client.name}'s Recipes</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {clientRecipes.map((recipe) => (
          <Card key={recipe.id} className="p-6">
            <h3 className="text-lg font-semibold">{recipe.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{recipe.description}</p>
            <p className="text-xs text-muted-foreground mt-2">Created: {recipe.createdAt}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};