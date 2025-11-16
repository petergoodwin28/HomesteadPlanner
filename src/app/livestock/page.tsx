"use client";

import { useHomesteadStore } from "@/store/homestead-store";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import { useState } from "react";

export default function LivestockPage() {
  const { livestock, updateLivestock } = useHomesteadStore();

  const addLivestock = (name: string) => {
    if (!name.trim()) return;

    useHomesteadStore.setState((state) => ({
      livestock: [
        ...state.livestock,
        {
          id: nanoid(),
          name,
          count: 1,
          unit: "unit",
          annualProductionPerUnit: 10,
          pricePerUnit: 1,
          annualCostPerUnit: 20,
          caloriesPerUnit: 0,
        },
      ],
    }));
  };

  const removeLivestock = (id: string) => {
    useHomesteadStore.setState((state) => ({
      livestock: state.livestock.filter((l) => l.id !== id),
    }));
  };

  const totalValue = livestock.reduce((sum, l) => {
    return sum + l.count * l.annualProductionPerUnit * l.pricePerUnit;
  }, 0);

  const totalCost = livestock.reduce((sum, l) => {
    return sum + l.count * l.annualCostPerUnit;
  }, 0);

  const net = totalValue - totalCost;

  const [newLivestock, setNewLivestock] = useState("");

  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-xl font-semibold">Livestock</h2>
        <p className="text-sm text-muted-foreground">
          Manage chickens, bees, and add new livestock like goats, ducks, or rabbits.
        </p>
      </div>

      {/* Summary section */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Annual Production Value</CardTitle>
            <CardDescription>Eggs, honey, etc.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">${totalValue.toFixed(0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Annual Cost</CardTitle>
            <CardDescription>Feed, hive care, etc.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">${totalCost.toFixed(0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Value</CardTitle>
            <CardDescription>Production minus costs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold ${net >= 0 ? 'text-green-600' : 'text-red-600'}">
              ${net.toFixed(0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add livestock */}
      <Card>
        <CardHeader>
          <CardTitle>Add livestock</CardTitle>
          <CardDescription>Examples: Ducks, Goats, Rabbits, Extra hives</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            placeholder="Livestock name..."
            value={newLivestock}
            onChange={(e) => setNewLivestock(e.target.value)}
          />
          <Button
            onClick={() => {
              addLivestock(newLivestock);
              setNewLivestock("");
            }}
          >
            Add
          </Button>
        </CardContent>
      </Card>

      {/* Livestock editor */}
      <Card>
        <CardHeader>
          <CardTitle>Edit livestock</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">

          {livestock.map((l) => {
            return (
              <div
                key={l.id}
                className="grid gap-2 rounded border p-4 sm:grid-cols-[1.3fr_repeat(4,1fr)_auto]"
              >
                <div>
                  <p className="font-medium">{l.name}</p>
                  <p className="text-xs text-muted-foreground">{l.unit}</p>
                </div>

                <Input
                  value={l.count}
                  type="number"
                  onChange={(e) => updateLivestock(l.id, { count: Number(e.target.value) })}
                />

                <Input
                  value={l.annualProductionPerUnit}
                  type="number"
                  onChange={(e) =>
                    updateLivestock(l.id, { annualProductionPerUnit: Number(e.target.value) })
                  }
                />

                <Input
                  value={l.pricePerUnit}
                  type="number"
                  onChange={(e) =>
                    updateLivestock(l.id, { pricePerUnit: Number(e.target.value) })
                  }
                />

                <Input
                  value={l.annualCostPerUnit}
                  type="number"
                  onChange={(e) =>
                    updateLivestock(l.id, { annualCostPerUnit: Number(e.target.value) })
                  }
                />

                <Button variant="destructive" onClick={() => removeLivestock(l.id)}>
                  Remove
                </Button>
              </div>
            );
          })}

        </CardContent>
      </Card>

    </div>
  );
}
