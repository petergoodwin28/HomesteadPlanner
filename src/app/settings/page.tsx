"use client";

import { useHomesteadStore } from "@/store/homestead-store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const {
    settings,
    updateSettings,
    crops,
    livestock,
    updateCrop,
    updateLivestock,
  } = useHomesteadStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure your garden, livestock, and financial assumptions. Changes
          here update the whole app.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)]">
        {/* Garden & beds */}
        <Card>
          <CardHeader>
            <CardTitle>Garden configuration</CardTitle>
            <CardDescription>
              Number of raised beds, bed size, and general layout assumptions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-1">
              <Label htmlFor="beds">Number of beds</Label>
              <Input
                id="beds"
                type="number"
                min={1}
                value={settings.numberOfBeds}
                onChange={(e) =>
                  updateSettings({
                    numberOfBeds: Math.max(1, Number(e.target.value) || 1),
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                This scales total yield across all crops.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="bed-length">Bed length (ft)</Label>
                <Input
                  id="bed-length"
                  type="number"
                  min={1}
                  value={settings.bedLengthFeet}
                  onChange={(e) =>
                    updateSettings({
                      bedLengthFeet: Math.max(1, Number(e.target.value) || 1),
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="bed-width">Bed width (ft)</Label>
                <Input
                  id="bed-width"
                  type="number"
                  min={1}
                  value={settings.bedWidthFeet}
                  onChange={(e) =>
                    updateSettings({
                      bedWidthFeet: Math.max(1, Number(e.target.value) || 1),
                    })
                  }
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Total growing area:{" "}
              <span className="font-semibold">
                {settings.numberOfBeds *
                  settings.bedLengthFeet *
                  settings.bedWidthFeet}{" "}
                sq ft
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Money & labor */}
        <Card>
          <CardHeader>
            <CardTitle>Money & labor</CardTitle>
            <CardDescription>
              Budget, labor value, and key commodity prices.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-1">
              <Label htmlFor="budget">Monthly grocery budget ($)</Label>
              <Input
                id="budget"
                type="number"
                min={0}
                value={settings.monthlyGroceryBudget}
                onChange={(e) =>
                  updateSettings({
                    monthlyGroceryBudget: Math.max(
                      0,
                      Number(e.target.value) || 0
                    ),
                  })
                }
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="labor">Labor value ($/hr)</Label>
              <Input
                id="labor"
                type="number"
                min={0}
                value={settings.laborHourlyValue ?? ""}
                onChange={(e) =>
                  updateSettings({
                    laborHourlyValue:
                      e.target.value === ""
                        ? undefined
                        : Math.max(0, Number(e.target.value) || 0),
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                Optional. If set, we can factor your time into ROI later.
              </p>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="egg-price">Egg price (per dozen, $)</Label>
                <Input
                  id="egg-price"
                  type="number"
                  min={0}
                  value={settings.eggPricePerDozen}
                  onChange={(e) => {
                    const val = Math.max(0, Number(e.target.value) || 0);
                    updateSettings({ eggPricePerDozen: val });
                    // also sync into livestock eggs pricePerUnit if present
                    const perEgg = val / 12;
                    updateLivestock("chickens", { pricePerUnit: perEgg });
                  }}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="honey-price">Honey price ($/lb)</Label>
                <Input
                  id="honey-price"
                  type="number"
                  min={0}
                  value={settings.honeyPricePerLb}
                  onChange={(e) => {
                    const val = Math.max(0, Number(e.target.value) || 0);
                    updateSettings({ honeyPricePerLb: val });
                    updateLivestock("bees", { pricePerUnit: val });
                  }}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="feed-cost">Feed cost per chicken / month ($)</Label>
                <Input
                  id="feed-cost"
                  type="number"
                  min={0}
                  value={settings.feedCostPerChickenMonth}
                  onChange={(e) => {
                    const val = Math.max(0, Number(e.target.value) || 0);
                    updateSettings({ feedCostPerChickenMonth: val });
                    updateLivestock("chickens", {
                      annualCostPerUnit: val * 12,
                    });
                  }}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="hive-maint">
                  Hive maintenance per hive / year ($)
                </Label>
                <Input
                  id="hive-maint"
                  type="number"
                  min={0}
                  value={settings.hiveMaintenanceAnnual}
                  onChange={(e) => {
                    const val = Math.max(0, Number(e.target.value) || 0);
                    updateSettings({ hiveMaintenanceAnnual: val });
                    updateLivestock("bees", { annualCostPerUnit: val });
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Livestock quick edit */}
      <Card>
        <CardHeader>
          <CardTitle>Livestock configuration</CardTitle>
          <CardDescription>
            Adjust the number of animals and their production assumptions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs sm:text-sm">
          {livestock.map((item) => {
            const annualProduction =
              item.annualProductionPerUnit * item.count;
            const value = annualProduction * item.pricePerUnit;
            const cost = item.annualCostPerUnit * item.count;
            const net = value - cost;

            return (
              <div
                key={item.id}
                className="grid gap-2 rounded-md border px-3 py-2 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.6fr)]"
              >
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <div className="mt-1 grid gap-2 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-[11px] uppercase">
                        Count
                      </Label>
                      <Input
                        type="number"
                        min={0}
                        value={item.count}
                        onChange={(e) =>
                          updateLivestock(item.id, {
                            count: Math.max(0, Number(e.target.value) || 0),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] uppercase">
                        Production per unit / year
                      </Label>
                      <Input
                        type="number"
                        min={0}
                        value={item.annualProductionPerUnit}
                        onChange={(e) =>
                          updateLivestock(item.id, {
                            annualProductionPerUnit: Math.max(
                              0,
                              Number(e.target.value) || 0
                            ),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] uppercase">
                      Price per {item.unit} ($)
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      value={item.pricePerUnit}
                      onChange={(e) =>
                        updateLivestock(item.id, {
                          pricePerUnit: Math.max(
                            0,
                            Number(e.target.value) || 0
                          ),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] uppercase">
                      Cost per unit / year ($)
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      value={item.annualCostPerUnit}
                      onChange={(e) =>
                        updateLivestock(item.id, {
                          annualCostPerUnit: Math.max(
                            0,
                            Number(e.target.value) || 0
                          ),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] uppercase">
                      Calories per {item.unit}
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      value={item.caloriesPerUnit}
                      onChange={(e) =>
                        updateLivestock(item.id, {
                          caloriesPerUnit: Math.max(
                            0,
                            Number(e.target.value) || 0
                          ),
                        })
                      }
                    />
                  </div>
                  <div className="col-span-full mt-1 flex flex-wrap justify-between gap-1 text-[11px] text-muted-foreground">
                    <span>
                      Annual production:{" "}
                      {annualProduction.toFixed(0)} {item.unit}
                    </span>
                    <span>Value: ${value.toFixed(0)}</span>
                    <span>Cost: ${cost.toFixed(0)}</span>
                    <span>Net: ${net.toFixed(0)}/yr</span>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Crops quick editor */}
      <Card>
        <CardHeader>
          <CardTitle>Crops quick configuration</CardTitle>
          <CardDescription>
            Adjust beds and yield per bed. Prices & calories are editable on
            the crops page later if you want deeper control.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-xs sm:text-sm">
          <div className="hidden grid-cols-[1.4fr_repeat(3,minmax(0,1fr))] gap-2 rounded-md bg-muted px-3 py-2 text-[11px] font-medium text-muted-foreground md:grid">
            <span>Crop</span>
            <span className="text-right">Beds</span>
            <span className="text-right">Yield / bed</span>
            <span className="text-right">Total yield</span>
          </div>
          <div className="space-y-2">
            {crops.map((crop) => {
              const totalYield =
                crop.yieldPerBed * crop.beds * (settings.numberOfBeds / 2 || 1);
              return (
                <div
                  key={crop.id}
                  className="grid grid-cols-1 gap-2 rounded-md border px-3 py-2 md:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]"
                >
                  <div>
                    <p className="font-medium text-sm">{crop.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {crop.season} · {crop.unit}
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Input
                      type="number"
                      min={0}
                      className="h-8 max-w-[90px] text-right text-xs"
                      value={crop.beds}
                      onChange={(e) =>
                        updateCrop(crop.id, {
                          beds: Math.max(0, Number(e.target.value) || 0),
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Input
                      type="number"
                      min={0}
                      className="h-8 max-w-[110px] text-right text-xs"
                      value={crop.yieldPerBed}
                      onChange={(e) =>
                        updateCrop(crop.id, {
                          yieldPerBed: Math.max(
                            0,
                            Number(e.target.value) || 0
                          ),
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-end text-xs text-muted-foreground">
                    {totalYield.toFixed(0)} {crop.unit}/yr
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
