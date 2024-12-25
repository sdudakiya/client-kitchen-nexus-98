import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Calculator, Database, Settings, Columns } from "lucide-react";
import React from 'react';

interface MasterConfigurationsProps {
  moistureInProduct: number;
  setMoistureInProduct: (value: number) => void;
  finalDryWt: number;
  moisture: number;
  finalOutput: number;
  allowancePercentage: number;
  setAllowancePercentage: (value: number) => void;
  finalQuantity: number;
  productionQuantity: number;
  setProductionQuantity: (value: number) => void;
  totalWeight: number;
  totalWaterInKg: number;
}

export const MasterConfigurations = ({
  moistureInProduct,
  setMoistureInProduct,
  finalDryWt,
  moisture,
  finalOutput,
  allowancePercentage,
  setAllowancePercentage,
  finalQuantity,
  productionQuantity,
  setProductionQuantity,
  totalWeight,
  totalWaterInKg,
}: MasterConfigurationsProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Settings className="h-5 w-5" />
        Master Configurations
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <div className="flex-1">
              <Label>Moisture in Product (%)</Label>
              <Input
                type="number"
                value={moistureInProduct.toFixed(2)}
                onChange={(e) => setMoistureInProduct(Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <div className="flex-1">
              <Label>Final Dry Weight</Label>
              <Input
                type="number"
                value={finalDryWt.toFixed(2)}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Columns className="h-4 w-4" />
            <div className="flex-1">
              <Label>Moisture</Label>
              <Input
                type="number"
                value={Math.round(moisture).toFixed(2)}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <div className="flex-1">
              <Label>Final Output</Label>
              <Input
                type="number"
                value={finalOutput.toFixed(2)}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <div className="flex-1">
              <Label>Allowance (%)</Label>
              <Input
                type="number"
                value={allowancePercentage.toFixed(0)}
                onChange={(e) => setAllowancePercentage(Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <div className="flex-1">
              <Label>Final Quantity</Label>
              <Input
                type="number"
                value={finalQuantity.toFixed(2)}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Columns className="h-4 w-4" />
            <div className="flex-1">
              <Label>Production Quantity (Kg)</Label>
              <Input
                type="number"
                value={productionQuantity.toFixed(0)}
                onChange={(e) => setProductionQuantity(Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};