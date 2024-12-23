import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export const ClientList = () => {
  const clients = [
    { id: 1, name: "Sarah Johnson", recipes: 12, lastActive: "2 days ago" },
    { id: 2, name: "Michael Chen", recipes: 8, lastActive: "5 days ago" },
    { id: 3, name: "Emma Davis", recipes: 15, lastActive: "1 day ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          className="pl-10"
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <Card key={client.id} className="hover-lift">
            <div className="p-6">
              <h3 className="text-lg font-semibold">{client.name}</h3>
              <div className="mt-2 text-sm text-muted-foreground">
                <p>{client.recipes} recipes</p>
                <p>Last active: {client.lastActive}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};