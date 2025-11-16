"use client";

import { useState } from "react";
import { useHomesteadStore } from "@/store/homestead-store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { NumericInput } from "@/app/settings/NumericInput";
import { OptionalNumericInput } from "@/app/settings/OptionalNumericInput";
import { Slider } from "@/components/ui/slider";

/* ──────────────────────────────────────────────────────────────
   LIVESTOCK PRESETS
   ────────────────────────────────────────────────────────────── */
const LIVESTOCK_PRESETS = [
  {
    id: "goats",
    name: "Dairy goats",
    unit: "gallons milk",
    annualProductionPerUnit: 180,
    pricePerUnit: 5,
    annualCostPerUnit: 150,
    caloriesPerUnit: 2448,
  },
  {
    id: "rabbits",
    name: "Meat rabbits",
    unit: "lb meat",
    annualProductionPerUnit: 25,
    pricePerUnit: 6,
    annualCostPerUnit: 80,
    caloriesPerUnit: 680,
  },
  {
    id: "ducks",
    name: "Ducks (eggs)",
    unit: "egg",
    annualProductionPerUnit: 260,
    pricePerUnit: 0.5,
    annualCostPerUnit: 60,
    caloriesPerUnit: 130,
  },
  {
    id: "quail",
    name: "Quail (eggs)",
    unit: "egg",
    annualProductionPerUnit: 280,
    pricePerUnit: 0.25,
    annualCostPerUnit: 40,
    caloriesPerUnit: 14,
  },
  {
    id: "turkeys",
    name: "Turkeys (meat)",
    unit: "lb meat",
    annualProductionPerUnit: 20,
    pricePerUnit: 4,
    annualCostPerUnit: 90,
    caloriesPerUnit: 700,
  },
];

const toNumber = (v: number | undefined | null, fallback = 0) =>
  Number.isFinite(v) ? (v as number) : fallback;

export default function SettingsPage() {
  const {
    settings,
    updateSettings,
    crops,
    livestock,
    updateCrop,
    updateLivestock,
    addLivestock,
    removeLivestock,
  } = useHomesteadStore();

  const [selectedPreset, setSelectedPreset] = useState<string | undefined>();

  const totalCropBeds = crops.reduce((sum, c) => sum + toNumber(c.beds, 0), 0);

  const safeEggPricePerDozen = toNumber(settings.eggPricePerDozen, 0);
  const safeFeedCost = toNumber(settings.feedCostPerChickenMonth, 0);

  const pricePerEgg = safeEggPricePerDozen / 12;
  const costPerChicken = safeFeedCost * 12;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure your homestead system. Tabs keep related settings together.
        </p>
      </div>

      <Tabs defaultValue="garden" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="garden">Garden</TabsTrigger>
          <TabsTrigger value="livestock">Livestock</TabsTrigger>
          <TabsTrigger value="prices">Prices & Costs</TabsTrigger>
          <TabsTrigger value="reality">Reality Factors</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* ────────────────────────────────────────────────
             GARDEN TAB
           ──────────────────────────────────────────────── */}
        <TabsContent value="garden">
          <Card>
            <CardHeader>
              <CardTitle>Garden Configuration</CardTitle>
              <CardDescription>
                Bed dimensions, climate zone, and growing experience.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
              {/* Climate zone */}
              <div className="space-y-1">
                <Label>Climate Zone (USDA Hardiness Zone)</Label>
                <Select
                  value={settings.climateZone || "7"}
                  onValueChange={(v) =>
                    updateSettings({ climateZone: v as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">Zone 3 (Very Cold)</SelectItem>
                    <SelectItem value="4">Zone 4 (Cold)</SelectItem>
                    <SelectItem value="5">Zone 5 (Cool)</SelectItem>
                    <SelectItem value="6">Zone 6 (Moderate-Cool)</SelectItem>
                    <SelectItem value="7">Zone 7 (Moderate)</SelectItem>
                    <SelectItem value="8">Zone 8 (Moderate-Warm)</SelectItem>
                    <SelectItem value="9">Zone 9 (Warm)</SelectItem>
                    <SelectItem value="10">Zone 10 (Hot)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Affects planting windows and frost dates. Maryland is typically Zone 6-7.
                </p>
              </div>

              {/* Experience level */}
              <div className="space-y-2">
                <Label>Growing Experience Level</Label>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">Beginner</span>
                  <Slider
                    value={[
                      settings.experienceLevel === "beginner"
                        ? 0
                        : settings.experienceLevel === "intermediate"
                        ? 1
                        : 2,
                    ]}
                    onValueChange={(v) => {
                      const level =
                        v[0] === 0
                          ? "beginner"
                          : v[0] === 1
                          ? "intermediate"
                          : "advanced";
                      updateSettings({ experienceLevel: level as any });
                    }}
                    min={0}
                    max={2}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground">Advanced</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Current:{" "}
                  <span className="font-semibold capitalize">
                    {settings.experienceLevel || "intermediate"}
                  </span>
                  {" "}(affects yield predictions by{" "}
                  {settings.experienceLevel === "beginner"
                    ? "70%"
                    : settings.experienceLevel === "advanced"
                    ? "95%"
                    : "85%"}
                  )
                </p>
              </div>

              <Separator />

              {/* Number of beds */}
              <div className="space-y-1">
                <Label>Number of garden beds</Label>
                <NumericInput
                  min={1}
                  value={toNumber(settings.numberOfBeds, 1)}
                  onCommit={(v) =>
                    updateSettings({
                      numberOfBeds: v,
                    })
                  }
                />
              </div>

              {/* Bed dimensions */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Bed length (ft)</Label>
                  <NumericInput
                    min={1}
                    value={toNumber(settings.bedLengthFeet, 8)}
                    onCommit={(v) =>
                      updateSettings({
                        bedLengthFeet: v,
                      })
                    }
                  />
                </div>

                <div className="space-y-1">
                  <Label>Bed width (ft)</Label>
                  <NumericInput
                    min={1}
                    value={toNumber(settings.bedWidthFeet, 4)}
                    onCommit={(v) =>
                      updateSettings({
                        bedWidthFeet: v,
                      })
                    }
                  />
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Total grow area:{" "}
                <span className="font-semibold">
                  {settings.numberOfBeds *
                    settings.bedLengthFeet *
                    settings.bedWidthFeet}{" "}
                  sq ft
                </span>
              </p>

              <Separator />

              {/* Crop bed allocation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-semibold uppercase">
                    Crop bed allocation
                  </span>
                  <span>
                    Total bed space assigned:{" "}
                    <span className="font-semibold">
                      {totalCropBeds.toFixed(2)} /{" "}
                      {settings.numberOfBeds.toFixed(2)}
                    </span>{" "}
                    beds
                  </span>
                </div>

                {crops.map((crop) => {
                  const safeBeds = toNumber(crop.beds, 0);
                  const share =
                    settings.numberOfBeds > 0
                      ? ((safeBeds / settings.numberOfBeds) * 100).toFixed(1)
                      : "0";

                  return (
                    <div
                      key={crop.id}
                      className="grid grid-cols-[1.4fr_1fr_1fr] gap-4 border rounded-md p-3 text-xs sm:text-sm"
                    >
                      <div>
                        <p className="font-medium">{crop.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {crop.season} · {crop.unit}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px] uppercase">
                          Beds for this crop
                        </Label>
                        <NumericInput
                          min={0}
                          step={0.1}
                          value={safeBeds}
                          onCommit={(v) =>
                            updateCrop(crop.id, {
                              beds: v,
                            })
                          }
                        />
                      </div>

                      <div className="flex flex-col justify-center items-end text-muted-foreground">
                        <span>Share: {share}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ────────────────────────────────────────────────
             LIVESTOCK TAB
           ──────────────────────────────────────────────── */}
        <TabsContent value="livestock">
          <Card>
            <CardHeader>
              <CardTitle>Livestock</CardTitle>
              <CardDescription>
                Manage flock size, hives, and additional animal types.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 text-sm">
              <div className="space-y-3">
                {livestock.map((item) => {
                  const isChickens = item.id === "chickens";
                  const isBees = item.id === "bees";

                  const label = isChickens
                    ? "Flock size (hens)"
                    : isBees
                    ? "Number of hives"
                    : "Animal count";

                  const safeCount = toNumber(item.count, 0);
                  const safeProd = toNumber(item.annualProductionPerUnit, 0);
                  const safePrice = toNumber(item.pricePerUnit, 0);
                  const safeCost = toNumber(item.annualCostPerUnit, 0);
                  const safeCalories = toNumber(item.caloriesPerUnit, 0);

                  const annualProduction = safeCount * safeProd;

                  return (
                    <div
                      key={item.id}
                      className="border rounded-md p-3 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Produces {item.unit}
                          </p>
                        </div>

                        {!isChickens && !isBees && (
                          <button
                            className="text-xs text-red-500 hover:underline"
                            onClick={() => removeLivestock(item.id)}
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                          <Label className="text-[11px] uppercase">
                            {label}
                          </Label>
                          <NumericInput
                            min={0}
                            value={safeCount}
                            onCommit={(v) =>
                              updateLivestock(item.id, { count: v })
                            }
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-[11px] uppercase">
                            Annual production per animal
                          </Label>
                          <NumericInput
                            min={0}
                            value={safeProd}
                            onCommit={(v) =>
                              updateLivestock(item.id, {
                                annualProductionPerUnit: v,
                              })
                            }
                          />
                        </div>
                      </div>

                      {!isChickens && !isBees && (
                        <div className="grid gap-3 sm:grid-cols-3 text-xs">
                          <div className="space-y-1">
                            <Label className="text-[11px] uppercase">
                              Price per {item.unit} ($)
                            </Label>
                            <NumericInput
                              min={0}
                              value={safePrice}
                              onCommit={(v) =>
                                updateLivestock(item.id, {
                                  pricePerUnit: v,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-[11px] uppercase">
                              Annual cost per animal ($)
                            </Label>
                            <NumericInput
                              min={0}
                              value={safeCost}
                              onCommit={(v) =>
                                updateLivestock(item.id, {
                                  annualCostPerUnit: v,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-[11px] uppercase">
                              Calories per {item.unit}
                            </Label>
                            <NumericInput
                              min={0}
                              value={safeCalories}
                              onCommit={(v) =>
                                updateLivestock(item.id, {
                                  caloriesPerUnit: v,
                                })
                              }
                            />
                          </div>
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground flex flex-wrap gap-2 justify-between">
                        <span>
                          Annual production: {annualProduction.toFixed(0)}{" "}
                          {item.unit}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator />

              {/* Add new livestock type */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Add livestock type</h3>
                <p className="text-xs text-muted-foreground">
                  Choose a preset animal type to add, then adjust details as
                  needed.
                </p>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Select
                    value={selectedPreset}
                    onValueChange={(value) => setSelectedPreset(value)}
                  >
                    <SelectTrigger className="w-full sm:w-64">
                      <SelectValue placeholder="Select an animal preset" />
                    </SelectTrigger>
                    <SelectContent>
                      {LIVESTOCK_PRESETS.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <button
                    className="px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground disabled:opacity-50"
                    disabled={!selectedPreset}
                    onClick={() => {
                      if (!selectedPreset) return;
                      const preset = LIVESTOCK_PRESETS.find(
                        (p) => p.id === selectedPreset
                      );
                      if (!preset) return;
                      addLivestock({
                        name: preset.name,
                        count: 1,
                        unit: preset.unit,
                        annualProductionPerUnit:
                          preset.annualProductionPerUnit,
                        pricePerUnit: preset.pricePerUnit,
                        annualCostPerUnit: preset.annualCostPerUnit,
                        caloriesPerUnit: preset.caloriesPerUnit,
                      });
                      setSelectedPreset(undefined);
                    }}
                  >
                    Add livestock
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ────────────────────────────────────────────────
             PRICES & COSTS TAB
           ──────────────────────────────────────────────── */}
        <TabsContent value="prices">
          <Card>
            <CardHeader>
              <CardTitle>Prices & Costs</CardTitle>
              <CardDescription>
                Market prices and basic operating costs.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
              {/* Grocery budget */}
              <div className="space-y-1">
                <Label>Monthly grocery budget ($)</Label>
                <NumericInput
                  min={0}
                  value={toNumber(settings.monthlyGroceryBudget, 0)}
                  onCommit={(v) =>
                    updateSettings({ monthlyGroceryBudget: v })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Used to calculate savings from homegrown food.
                </p>
              </div>

              {/* Labor value (optional) */}
              <div className="space-y-1">
                <Label>Labor value ($/hr) - Optional</Label>
                <OptionalNumericInput
                  min={0}
                  value={settings.laborHourlyValue}
                  onCommit={(v) =>
                    updateSettings({
                      laborHourlyValue: v,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Optional: used in ROI calculations to account for your time.
                </p>
              </div>

              {/* Seed budget */}
              <div className="space-y-1">
                <Label>Annual seed & supply budget ($)</Label>
                <NumericInput
                  min={0}
                  value={toNumber(settings.seedBudget, 0)}
                  onCommit={(v) =>
                    updateSettings({ seedBudget: v })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Seeds, transplants, amendments, pest control, etc.
                </p>
              </div>

              <Separator />

              <h3 className="font-semibold">Market prices</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Egg price per dozen ($)</Label>
                  <NumericInput
                    min={0}
                    value={safeEggPricePerDozen}
                    onCommit={(v) => {
                      updateSettings({ eggPricePerDozen: v });
                      updateLivestock("chickens", { pricePerUnit: v / 12 });
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <Label>Honey price per pound ($)</Label>
                  <NumericInput
                    min={0}
                    value={toNumber(settings.honeyPricePerLb, 0)}
                    onCommit={(v) => {
                      updateSettings({ honeyPricePerLb: v });
                      updateLivestock("bees", { pricePerUnit: v });
                    }}
                  />
                </div>
              </div>

              <Separator />

              <h3 className="font-semibold">Operating costs</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Feed cost per chicken / month ($)</Label>
                  <NumericInput
                    min={0}
                    value={safeFeedCost}
                    onCommit={(v) => {
                      updateSettings({ feedCostPerChickenMonth: v });
                      updateLivestock("chickens", {
                        annualCostPerUnit: v * 12,
                      });
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <Label>Hive maintenance per hive / year ($)</Label>
                  <NumericInput
                    min={0}
                    value={toNumber(settings.hiveMaintenanceAnnual, 0)}
                    onCommit={(v) => {
                      updateSettings({ hiveMaintenanceAnnual: v });
                      updateLivestock("bees", {
                        annualCostPerUnit: v,
                      });
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ────────────────────────────────────────────────
             NEW: REALITY FACTORS TAB
           ──────────────────────────────────────────────── */}
        <TabsContent value="reality">
          <Card>
            <CardHeader>
              <CardTitle>Reality Factors</CardTitle>
              <CardDescription>
                Account for real-world unpredictability in yields and costs.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 text-sm">
              <p className="text-muted-foreground">
                These modifiers make predictions more realistic by accounting for
                spoilage, weather, pests, and other variables.
              </p>

              {/* Spoilage rate */}
              <div className="space-y-2">
                <Label>Expected spoilage / waste rate</Label>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground w-12">0%</span>
                  <Slider
                    value={[(settings.spoilageRate || 0.1) * 100]}
                    onValueChange={(v) => {
                      updateSettings({ spoilageRate: v[0] / 100 });
                    }}
                    min={0}
                    max={30}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-12">30%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Current: <span className="font-semibold">{((settings.spoilageRate || 0.1) * 100).toFixed(0)}%</span>
                  {" "}(not everything makes it to the jar)
                </p>
              </div>

              {/* Weather variability */}
              <div className="space-y-2">
                <Label>Weather variability impact</Label>
                <Select
                  value={settings.weatherImpact || "moderate"}
                  onValueChange={(v) =>
                    updateSettings({ weatherImpact: v as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (±5% yield swing)</SelectItem>
                    <SelectItem value="moderate">Moderate (±15% yield swing)</SelectItem>
                    <SelectItem value="high">High (±25% yield swing)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  How much do droughts, floods, or unexpected frosts affect your yields?
                </p>
              </div>

              {/* Pest pressure */}
              <div className="space-y-2">
                <Label>Pest pressure in your area</Label>
                <Select
                  value={settings.pestPressure || "moderate"}
                  onValueChange={(v) =>
                    updateSettings({ pestPressure: v as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (minimal impact)</SelectItem>
                    <SelectItem value="moderate">Moderate (5-10% loss)</SelectItem>
                    <SelectItem value="high">High (15-20% loss)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Deer, rabbits, insects, diseases – what's the typical pressure?
                </p>
              </div>

              <Separator />

              <div className="rounded-md bg-muted/50 p-3 text-xs">
                <p className="font-semibold mb-1">How reality factors work:</p>
                <p className="text-muted-foreground">
                  These settings adjust yield predictions across the app. For example,
                  a 10% spoilage rate means you'll need to grow 10% more to hit your
                  preservation goals. Weather and pest impacts add variability to
                  dashboard forecasts.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ────────────────────────────────────────────────
             SYSTEM DEFAULTS TAB
           ──────────────────────────────────────────────── */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Defaults</CardTitle>
              <CardDescription>
                Biological constants and automatic calculations (read-only).
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[11px] uppercase text-muted-foreground">
                    Calories per egg
                  </Label>
                  <p className="text-sm font-medium">70 cal</p>
                </div>
                <div>
                  <Label className="text-[11px] uppercase text-muted-foreground">
                    Calories per lb honey
                  </Label>
                  <p className="text-sm font-medium">1392 cal</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[11px] uppercase text-muted-foreground">
                    Price per egg (derived)
                  </Label>
                  <p className="text-sm font-medium">
                    ${pricePerEgg.toFixed(2)}
                  </p>
                </div>
                <div>
                  <Label className="text-[11px] uppercase text-muted-foreground">
                    Cost per chicken per year (derived)
                  </Label>
                  <p className="text-sm font-medium">
                    ${costPerChicken.toFixed(2)}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="rounded-md bg-muted/50 p-3 text-xs">
                <p className="font-semibold mb-1">Database info:</p>
                <p className="text-muted-foreground">
                  The app includes a comprehensive crop database with 15+ vegetables,
                  planting windows, harvest times, and preservation data. Use the
                  Crops page to add them to your garden.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}