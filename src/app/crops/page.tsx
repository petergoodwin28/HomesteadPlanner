"use client";

import { useState, useMemo } from "react";
import { useHomesteadStore } from "@/store/homestead-store";
import { CROP_DATABASE, getCropsBySeason } from "@/lib/data/crop-database";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, Calendar, Droplets, Clock, Archive } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const SEASON_COLORS = {
  spring: "#10b981",
  summer: "#f59e0b",
  fall: "#ef4444",
  winter: "#3b82f6",
  "year-round": "#8b5cf6",
};

const CHART_COLORS = ["#4CAF50", "#FF9800", "#03A9F4", "#E91E63", "#9C27B0", "#FFC107", "#00BCD4"];

export default function CropsPage() {
  const { crops, settings, updateCrop } = useHomesteadStore();
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<string>("all");

  // Calculate experience modifier
  const experienceModifier = 
    settings.experienceLevel === "beginner" ? 0.7 :
    settings.experienceLevel === "advanced" ? 0.95 : 0.85;

  // Calculate spoilage modifier
  const spoilageModifier = 1 - (settings.spoilageRate || 0.1);

  // Add crop from library
  const addCropFromLibrary = (cropData: typeof CROP_DATABASE[0]) => {
    useHomesteadStore.setState((state) => {
      // Check if already exists
      if (state.crops.find(c => c.id === cropData.id)) {
        return state; // Don't add duplicates
      }

      return {
        crops: [
          ...state.crops,
          {
            id: cropData.id,
            name: cropData.name,
            season: cropData.season,
            beds: 0.5, // Default allocation
            yieldPerBed: cropData.yieldPerBedAverage,
            unit: cropData.unit,
            pricePerUnit: cropData.pricePerUnit,
            caloriesPerUnit: cropData.caloriesPerUnit,
            
            // Add new optional fields
            daysToHarvest: cropData.harvestWindow.daysToHarvest,
            harvestWindowDays: cropData.harvestWindow.harvestPeriodDays,
            plantingWindowStart: cropData.plantingWindow.start,
            plantingWindowEnd: cropData.plantingWindow.end,
            waterNeedsPerWeek: cropData.requirements.waterNeedsGallonsPerWeek,
            laborHoursPerBed: cropData.laborHoursPerBed,
            storageMethod: cropData.preservation.storageMethod[0],
            shelfLifeDays: cropData.preservation.shelfLifeDays,
          },
        ],
      };
    });
    setLibraryOpen(false);
  };

  const removeCrop = (id: string) => {
    useHomesteadStore.setState((state) => ({
      crops: state.crops.filter((crop) => crop.id !== id),
    }));
  };

  // Calculate metrics with modifiers
  const metrics = useMemo(() => {
    const totalYield = crops.reduce((sum, crop) => {
      const baseYield = crop.yieldPerBed * crop.beds;
      return sum + (baseYield * experienceModifier * spoilageModifier);
    }, 0);

    const totalValue = crops.reduce((sum, crop) => {
      const baseYield = crop.yieldPerBed * crop.beds;
      const adjustedYield = baseYield * experienceModifier * spoilageModifier;
      return sum + (adjustedYield * crop.pricePerUnit);
    }, 0);

    const totalCalories = crops.reduce((sum, crop) => {
      const baseYield = crop.yieldPerBed * crop.beds;
      const adjustedYield = baseYield * experienceModifier * spoilageModifier;
      return sum + (adjustedYield * crop.caloriesPerUnit);
    }, 0);

    const totalLaborHours = crops.reduce((sum, crop) => {
      return sum + ((crop.laborHoursPerBed || 4) * crop.beds);
    }, 0);

    const totalWaterNeeds = crops.reduce((sum, crop) => {
      return sum + ((crop.waterNeedsPerWeek || 5) * crop.beds);
    }, 0);

    return {
      totalYield,
      totalValue,
      totalCalories,
      totalLaborHours,
      totalWaterNeeds,
    };
  }, [crops, experienceModifier, spoilageModifier]);

  // Chart data
  const valueBySeasonData = useMemo(() => {
    const seasonMap: Record<string, number> = {};
    
    crops.forEach(crop => {
      const baseYield = crop.yieldPerBed * crop.beds;
      const adjustedYield = baseYield * experienceModifier * spoilageModifier;
      const value = adjustedYield * crop.pricePerUnit;
      
      seasonMap[crop.season] = (seasonMap[crop.season] || 0) + value;
    });

    return Object.entries(seasonMap).map(([season, value]) => ({
      season: season.charAt(0).toUpperCase() + season.slice(1),
      value: Math.round(value),
    }));
  }, [crops, experienceModifier, spoilageModifier]);

  const cropValueData = useMemo(() => {
    return crops.map(crop => {
      const baseYield = crop.yieldPerBed * crop.beds;
      const adjustedYield = baseYield * experienceModifier * spoilageModifier;
      return {
        name: crop.name,
        value: Math.round(adjustedYield * crop.pricePerUnit),
        calories: Math.round(adjustedYield * crop.caloriesPerUnit),
      };
    }).sort((a, b) => b.value - a.value);
  }, [crops, experienceModifier, spoilageModifier]);

  const filteredLibrary = selectedSeason === "all" 
    ? CROP_DATABASE 
    : getCropsBySeason(selectedSeason);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Crops</h2>
          <p className="text-sm text-muted-foreground">
            Plan your garden, track yields, and visualize production.
          </p>
        </div>

        <Dialog open={libraryOpen} onOpenChange={setLibraryOpen}>
          <DialogTrigger asChild>
            <Button>
              <Leaf className="w-4 h-4 mr-2" />
              Add from Library
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crop Library</DialogTitle>
              <DialogDescription>
                Choose from {CROP_DATABASE.length} vegetables with realistic growing data
              </DialogDescription>
            </DialogHeader>

            <Tabs value={selectedSeason} onValueChange={setSelectedSeason}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="spring">Spring</TabsTrigger>
                <TabsTrigger value="summer">Summer</TabsTrigger>
                <TabsTrigger value="fall">Fall</TabsTrigger>
                <TabsTrigger value="year-round">Year-round</TabsTrigger>
              </TabsList>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {filteredLibrary.map((cropData) => {
                  const alreadyAdded = crops.find(c => c.id === cropData.id);
                  
                  return (
                    <Card key={cropData.id} className={alreadyAdded ? "opacity-50" : ""}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{cropData.name}</CardTitle>
                            <div className="flex gap-2 mt-1">
                              <Badge 
                                variant="secondary" 
                                style={{ backgroundColor: SEASON_COLORS[cropData.season] + "20" }}
                              >
                                {cropData.season}
                              </Badge>
                              <Badge variant="outline">{cropData.category}</Badge>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            disabled={!!alreadyAdded}
                            onClick={() => addCropFromLibrary(cropData)}
                          >
                            {alreadyAdded ? "Added" : "Add"}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="text-xs space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <span>{cropData.harvestWindow.daysToHarvest} days</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Archive className="w-3 h-3 text-muted-foreground" />
                            <span>{cropData.yieldPerBedAverage} {cropData.unit}/bed</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-1">
                            <Droplets className="w-3 h-3 text-muted-foreground" />
                            <span>{cropData.requirements.waterNeedsGallonsPerWeek} gal/wk</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span>{cropData.laborHoursPerBed} hrs/bed</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          Plant: {cropData.plantingWindow.start} - {cropData.plantingWindow.end}
                        </p>
                        {cropData.notes && (
                          <p className="text-muted-foreground italic">
                            {cropData.notes}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Yield</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{metrics.totalYield.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">units / year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Market Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">${metrics.totalValue.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">annual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{(metrics.totalCalories / 1000).toFixed(0)}k</p>
            <p className="text-xs text-muted-foreground">kcal / year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Labor</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{metrics.totalLaborHours.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">hours / season</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Water Needs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{metrics.totalWaterNeeds.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">gallons / week</p>
          </CardContent>
        </Card>
      </div>

      {/* Reality Modifier Info */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="pt-4 text-sm">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <p className="font-semibold text-amber-900">Reality Adjustments Active</p>
              <p className="text-amber-700 text-xs mt-1">
                Yields adjusted for {settings.experienceLevel || "intermediate"} experience 
                ({(experienceModifier * 100).toFixed(0)}% of optimal) and {((settings.spoilageRate || 0.1) * 100).toFixed(0)}% 
                spoilage. Change in Settings → Reality Factors.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Value by Season */}
        <Card>
          <CardHeader>
            <CardTitle>Production Value by Season</CardTitle>
            <CardDescription>Annual value split across growing seasons</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={valueBySeasonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="season" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Bar dataKey="value" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Crop Value Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Top Crops by Value</CardTitle>
            <CardDescription>Which crops generate the most value</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cropValueData.slice(0, 8)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip formatter={(value) => `$${value}`} />
                <Bar dataKey="value" fill="#FF9800" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Calorie Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Calorie Distribution</CardTitle>
            <CardDescription>Which crops provide the most food energy</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cropValueData.filter(c => c.calories > 0).slice(0, 7)}
                  dataKey="calories"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => entry.name}
                >
                  {cropValueData.slice(0, 7).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${Number(value).toLocaleString()} kcal`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Labor Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Labor Requirements</CardTitle>
            <CardDescription>Time commitment per crop</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={crops.map(c => ({
                  name: c.name,
                  hours: (c.laborHoursPerBed || 4) * c.beds,
                })).sort((a, b) => b.hours - a.hours).slice(0, 8)}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip formatter={(value) => `${value} hours`} />
                <Bar dataKey="hours" fill="#9C27B0" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Crop Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Your Garden Plan</CardTitle>
          <CardDescription>
            Edit bed allocations and adjust yields. Click "Add from Library" to add more crops.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {crops.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Leaf className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No crops yet. Click "Add from Library" to get started!</p>
            </div>
          )}

          {crops.map((crop) => {
            const baseYield = crop.beds * crop.yieldPerBed;
            const adjustedYield = baseYield * experienceModifier * spoilageModifier;
            const totalValue = adjustedYield * crop.pricePerUnit;
            const totalCalories = adjustedYield * crop.caloriesPerUnit;

            return (
              <Card key={crop.id} className="border-l-4" style={{ borderLeftColor: SEASON_COLORS[crop.season as keyof typeof SEASON_COLORS] || "#gray" }}>
                <CardContent className="pt-4">
                  <div className="grid gap-4 sm:grid-cols-[1.5fr_repeat(3,1fr)_auto]">
                    <div>
                      <p className="font-medium">{crop.name}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {crop.season}
                        </Badge>
                        {crop.daysToHarvest && (
                          <span className="text-xs text-muted-foreground">
                            {crop.daysToHarvest} days
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Beds</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        value={crop.beds}
                        onChange={(e) =>
                          updateCrop(crop.id, { beds: Number(e.target.value) })
                        }
                        className="h-8"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Yield/bed</Label>
                      <Input
                        type="number"
                        value={crop.yieldPerBed}
                        onChange={(e) =>
                          updateCrop(crop.id, {
                            yieldPerBed: Number(e.target.value),
                          })
                        }
                        className="h-8"
                      />
                      <p className="text-xs text-muted-foreground">{crop.unit}</p>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Production</Label>
                      <div className="text-sm">
                        <p className="font-semibold">{adjustedYield.toFixed(1)} {crop.unit}</p>
                        <p className="text-xs text-muted-foreground">
                          ${totalValue.toFixed(0)} value
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCrop(crop.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>

                  {/* Additional info row */}
                  <div className="mt-3 pt-3 border-t grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
                    {crop.waterNeedsPerWeek && (
                      <div className="flex items-center gap-1">
                        <Droplets className="w-3 h-3" />
                        <span>{(crop.waterNeedsPerWeek * crop.beds).toFixed(0)} gal/wk</span>
                      </div>
                    )}
                    {crop.laborHoursPerBed && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{(crop.laborHoursPerBed * crop.beds).toFixed(1)} hrs total</span>
                      </div>
                    )}
                    {crop.storageMethod && (
                      <div className="flex items-center gap-1">
                        <Archive className="w-3 h-3" />
                        <span className="capitalize">{crop.storageMethod}</span>
                      </div>
                    )}
                    {crop.caloriesPerUnit > 0 && (
                      <div>
                        {totalCalories.toLocaleString()} kcal
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}