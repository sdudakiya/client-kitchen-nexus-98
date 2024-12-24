// Base types for recipe-related data
export interface RecipeIngredient {
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
  created_at: string;
  created_by: string;
  ingredients: RecipeIngredient[];
  moistureInProduct: number;
  finalDryWt: number;
  moisture: number;
  finalOutput: number;
  allowancePercentage: number;
  finalQuantity: number;
  productionQuantity: number;
}

// Database types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          created_at: string;
          created_by: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      recipes: {
        Row: Recipe;
        Insert: Omit<Recipe, 'id' | 'created_at'>;
        Update: Partial<Omit<Recipe, 'id'>>;
        Relationships: [
          {
            foreignKeyName: "recipes_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}