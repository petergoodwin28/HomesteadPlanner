"use client";

import { useHomesteadStore } from "@/store/homestead-store";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { nanoid } from "nanoid";
import { useState } from "react";

export default function CropsPage() {
  const { crops, updateCrop, settings, } = useHomesteadStore();
  const addCrop = useHomesteadStore((s) => s.updateCrop);
  const [newCropName, setNewCropName] = useState("");

  const addNewCrop = () => {
    if (!newCropName.trim()) return;

    useHomesteadStore.setState((state) => ({
      crops: [
        ...state.crops,
        {
          id: nanoid(),
          name: newCropName,
          season: "Unknown",
          beds: 1,
          yieldPerBed: 10,
          unit: "unit",
          pricePerUnit: 1,
          caloriesPerUnit: 0,
        },
      ],
    }));

    setNewCropName("");
  };

  const removeCrop = (id: string) => {
    useHomesteadStore.setState((state) => ({
      crops: state.crops.filter((crop) => crop.id !== id),
    }));
  };

  const totalAnnualYield = crops.reduce((sum, crop) => {
    return (
      sum +
      crop.yieldPerBed *
        crop.beds *
        (settings.numberOfBeds / 2 || 1)
    );
  }, 0);

  const totalValue = crops.reduce((sum, crop) => {
    const y =
      crop.yieldPerBed * crop.beds * (settings.numberOfBeds / 2 || 1);
    return sum + y * crop.pricePerUnit;
  }, 0);

  const totalCalories = crops.reduce((sum, crop) => {
    const y =
      crop.yieldPerBed * crop.beds * (settings.numberOfBeds / 2 || 1);
    return sum + y * crop.caloriesPerUnit;
  }, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Crops</h2>
        <p className="text-sm text-muted-foreground">
          Manage your vegetables, herbs, and root crops. All changes persist automatically.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Annual Yield</CardTitle>
            <CardDescription>Across all beds</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{totalAnnualYield.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">units / year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Market Value</CardTitle>
            <CardDescription>Based on crop prices</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">${totalValue.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">per year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Calories</CardTitle>
            <CardDescription>Food energy produced</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{totalCalories.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">kcal / year</p>
          </CardContent>
        </Card>
      </div>

      {/* Crop editor */}
      <Card>
        <CardHeader>
          <CardTitle>Edit crops</CardTitle>
          <CardDescription>Adjust yields, prices, calories, and more.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Add new crop */}
          <div className="flex gap-2">
            <Input
              placeholder="Add a new crop..."
              value={newCropName}
              onChange={(e) => setNewCropName(e.target.value)}
            />
            <Button onClick={addNewCrop}>Add</Button>
          </div>

          <Separator />

          <div className="space-y-4">
            {crops.map((crop) => {
              const totalYield =
                crop.beds *
                crop.yieldPerBed *
                (settings.numberOfBeds / 2);

              return (
                <div
                  key={crop.id}
                  className="rounded border p-4 grid gap-4 sm:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))_auto]"
                >
                  <div>
                    <p className="font-medium">{crop.name}</p>
                    <p className="text-xs text-muted-foreground">{crop.season}</p>
                  </div>

                  <Input
                    type="number"
                    value={crop.beds}
                    onChange={(e) =>
                      updateCrop(crop.id, { beds: Number(e.target.value) })
                    }
                    className="h-8 text-sm"
                  />

                  <Input
                    type="number"
                    value={crop.yieldPerBed}
                    onChange={(e) =>
                      updateCrop(crop.id, {
                        yieldPerBed: Number(e.target.value),
                      })
                    }
                    className="h-8 text-sm"
                  />

                  <Input
                    type="number"
                    value={crop.pricePerUnit}
                    onChange={(e) =>
                      updateCrop(crop.id, {
                        pricePerUnit: Number(e.target.value),
                      })
                    }
                    className="h-8 text-sm"
                  />

                  <Input
                    type="number"
                    value={crop.caloriesPerUnit}
                    onChange={(e) =>
                      updateCrop(crop.id, {
                        caloriesPerUnit: Number(e.target.value),
                      })
                    }
                    className="h-8 text-sm"
                  />

                  <Button
                    variant="destructive"
                    onClick={() => removeCrop(crop.id)}
                    className="h-8"
                  >
                    Remove
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
