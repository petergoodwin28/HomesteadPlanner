"use client";

import { useHomesteadStore } from "@/store/homestead-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PantryPage() {
  const { pantry, initializePantryFromProduction, consumePantry } =
    useHomesteadStore();

  const totalCalories = pantry.reduce(
    (sum, item) =>
      sum +
      (item.caloriesPerUnit ?? 0) * (item.quantity > 0 ? item.quantity : 0),
    0
  );

  const totalValue = pantry.reduce(
    (sum, item) =>
      sum +
      (item.costPerUnit ?? 0) * (item.quantity > 0 ? item.quantity : 0),
    0
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Pantry inventory</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => initializePantryFromProduction()}
          >
            Initialize from annual production
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm max-h-[420px] overflow-y-auto">
            {pantry.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No pantry items yet. Click &quot;Initialize from annual
                production&quot; to populate based on your crops and livestock.
              </p>
            )}
            {pantry.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-1 rounded-md border px-3 py-2 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.source} · {item.quantity.toFixed(1)} {item.unit}
                  </p>
                  {(item.caloriesPerUnit ?? 0) > 0 && (
                    <p className="text-xs text-muted-foreground">
                      ~{((item.caloriesPerUnit ?? 0) * item.quantity).toFixed(0)}{" "}
                      kcal total
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {item.costPerUnit !== undefined && (
                    <span>
                      ${item.costPerUnit.toFixed(2)}/{item.unit}
                    </span>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => consumePantry(item.id, item.quantity / 4)}
                  >
                    Use 1/4
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              Total value:{" "}
              <span className="font-semibold">
                ${totalValue.toFixed(0)}
              </span>
            </p>
            <p>
              Total calories:{" "}
              <span className="font-semibold">
                {totalCalories.toLocaleString()} kcal
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              As you log meals, you could later wire them to consume from
              pantry items (e.g., subtract potatoes, eggs, herbs) for tighter tracking.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
