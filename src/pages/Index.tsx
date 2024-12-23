import { ClientList } from "@/components/dashboard/ClientList";
import { RecipeForm } from "@/components/recipes/RecipeForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight">Recipe Management</h1>
        <p className="text-lg text-muted-foreground">
          Manage your clients and recipes in one place
        </p>
      </header>

      <Tabs defaultValue="clients" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mx-auto">
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="recipes">New Recipe</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients" className="fade-in">
          <ClientList />
        </TabsContent>
        
        <TabsContent value="recipes" className="fade-in">
          <RecipeForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;