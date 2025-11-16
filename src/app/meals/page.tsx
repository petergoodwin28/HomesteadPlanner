"use client";

import { useState, useMemo } from "react";
import { useHomesteadStore } from "@/store/homestead-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MealsPage() {
  const { crops, livestock, meals, addMeal } = useHomesteadStore();

  const [name, setName] = useState("");
  const [ingredientType, setIngredientType] = useState<"crop" | "livestock">(
    "crop"
  );
  const [selectedId, setSelectedId] = useState<string>("");
  const [amount, setAmount] = useState<string>("1");

  const selectedItem = useMemo(() => {
    if (!selectedId) return null;
    if (ingredientType === "crop") {
      return crops.find((c) => c.id === selectedId);
    }
    return livestock.find((l) => l.id === selectedId);
  }, [selectedId, ingredientType, crops, livestock]);

  const unit =
    ingredientType === "crop"
      ? (selectedItem as any)?.unit ?? ""
      : (selectedItem as any)?.unit ?? "";

  const estimatedCost =
    selectedItem && Number(amount) > 0
      ? Number(amount) *
        ("pricePerUnit" in selectedItem ? selectedItem.pricePerUnit : 0)
      : 0;

  const estimatedCalories =
    selectedItem && Number(amount) > 0
      ? Number(amount) *
        ("caloriesPerUnit" in selectedItem ? selectedItem.caloriesPerUnit : 0)
      : 0;

  const handleAddMeal = () => {
    const amt = Number(amount);
    if (!name || !selectedItem || amt <= 0) return;

    addMeal({
      name,
      ingredients: [
        ingredientType === "crop"
          ? {
              cropId: selectedId as any,
              amount: amt,
              unit: unit || "",
            }
          : {
              livestockId: selectedId as any,
              amount: amt,
              unit: unit || "",
            },
      ],
      estimatedCost,
      estimatedCalories,
    });

    setName("");
    setAmount("1");
  };

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)]">
      <Card>
        <CardHeader>
          <CardTitle>Create a meal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="space-y-1">
            <Label htmlFor="meal-name">Meal name</Label>
            <Input
              id="meal-name"
              placeholder="Tomato-kale pasta, egg scramble with herbs..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Ingredient source</Label>
              <Select
                value={ingredientType}
                onValueChange={(v: "crop" | "livestock") => {
                  setIngredientType(v);
                  setSelectedId("");
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crop">Garden crop</SelectItem>
                  <SelectItem value="livestock">Livestock product</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Ingredient</Label>
              <Select
                value={selectedId}
                onValueChange={(v) => setSelectedId(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ingredient" />
                </SelectTrigger>
                <SelectContent>
                  {ingredientType === "crop"
                    ? crops.map((crop) => (
                        <SelectItem key={crop.id} value={crop.id}>
                          {crop.name}
                        </SelectItem>
                      ))
                    : livestock.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ),)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Amount</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                step={0.1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="max-w-[120px]"
              />
              <span className="text-xs text-muted-foreground">{unit}</span>
            </div>
          </div>

          <div className="rounded-md border bg-muted/40 p-3 text-xs">
            <p>
              Estimated cost:{" "}
              <span className="font-semibold">
                ${estimatedCost.toFixed(2)}
              </span>
            </p>
            <p>
              Estimated calories:{" "}
              <span className="font-semibold">
                {estimatedCalories.toFixed(0)} kcal
              </span>
            </p>
          </div>

          <Button onClick={handleAddMeal} disabled={!name || !selectedItem}>
            Add meal
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Meals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {meals.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No meals yet. Create one on the left.
            </p>
          )}
          <div className="space-y-2 max-h-[420px] overflow-y-auto">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="rounded-md border p-2 text-xs flex flex-col gap-1"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-medium text-sm">{meal.name}</span>
                  <span className="text-muted-foreground">
                    ${meal.estimatedCost.toFixed(2)} ·{" "}
                    {meal.estimatedCalories.toFixed(0)} kcal
                  </span>
                </div>
                <div className="text-muted-foreground">
                  {meal.ingredients.map((ing, idx) => {
                    let label = "";
                    if (ing.cropId) {
                      const crop = crops.find((c) => c.id === ing.cropId);
                      label = crop?.name ?? ing.cropId;
                    } else if (ing.livestockId) {
                      const ls = livestock.find((l) => l.id === ing.livestockId);
                      label = ls?.name ?? ing.livestockId;
                    }
                    return (
                      <span key={idx}>
                        {idx > 0 && ", "}
                        {ing.amount} {ing.unit} {label}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
