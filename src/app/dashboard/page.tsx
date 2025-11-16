"use client";

import { useState, useMemo, SetStateAction } from "react";
import { useHomesteadStore } from "@/store/homestead-store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Slider } from "@/components/ui/slider";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Color set for charts
const COLORS = ["#4CAF50", "#FF9800", "#03A9F4", "#9C27B0", "#FF5722"];

export default function DashboardPage() {
  const {
    crops,
    livestock,
    settings,
    getAnnualGardenValue,
    getAnnualGardenCalories,
    getAnnualLivestockNetValue,
    getAnnualLivestockCalories,
  } = useHomesteadStore();

  // ---------------------------
  // SCENARIO SLIDERS (local, temporary)
  // ---------------------------

  const [bedMultiplier, setBedMultiplier] = useState(1); // 1 = normal
  const [eggReduction, setEggReduction] = useState(0); // % reduction
  const [feedIncrease, setFeedIncrease] = useState(0); // % increase
  const [droughtPenalty, setDroughtPenalty] = useState(0); // % reduction

  // ---------------------------
  // APPLY SCENARIO EFFECTS
  // ---------------------------

  const adjustedCrops = useMemo(() => {
    return crops.map((crop) => {
      const rawYield =
        crop.beds * crop.yieldPerBed * (settings.numberOfBeds / 2 || 1);

      const modifiedYield = rawYield * bedMultiplier * (1 - droughtPenalty);

      return {
        ...crop,
        adjustedYield: Math.max(0, modifiedYield),
      };
    });
  }, [crops, settings, bedMultiplier, droughtPenalty]);

  const adjustedLivestock = useMemo(() => {
    return livestock.map((l) => {
      if (l.id === "chickens") {
        // Apply egg reduction + feed increase
        return {
          ...l,
          adjustedProduction:
            l.annualProductionPerUnit * l.count * (1 - eggReduction),
          adjustedCost: l.annualCostPerUnit * l.count * (1 + feedIncrease),
        };
      }

      // Bees & others unchanged
      return {
        ...l,
        adjustedProduction: l.annualProductionPerUnit * l.count,
        adjustedCost: l.annualCostPerUnit * l.count,
      };
    });
  }, [livestock, eggReduction, feedIncrease]);

  // ---------------------------
  // COMPUTE NEW DASHBOARD METRICS
  // ---------------------------

  const annualGardenValue = adjustedCrops.reduce(
    (sum, c) => sum + c.adjustedYield * c.pricePerUnit,
    0
  );

  const annualGardenCalories = adjustedCrops.reduce(
    (sum, c) => sum + c.adjustedYield * c.caloriesPerUnit,
    0
  );

  const annualLivestockValue = adjustedLivestock.reduce(
    (sum, l) => sum + l.adjustedProduction * l.pricePerUnit,
    0
  );

  const annualLivestockCost = adjustedLivestock.reduce(
    (sum, l) => sum + l.adjustedCost,
    0
  );

  const annualLivestockNetValue = annualLivestockValue - annualLivestockCost;

  const annualLivestockCalories = adjustedLivestock.reduce(
    (sum, l) => sum + l.adjustedProduction * l.caloriesPerUnit,
    0
  );

  const totalAnnualCalories = annualGardenCalories + annualLivestockCalories;

  const dailyCalories = 2500;
  const annualCalorieRequirement = dailyCalories * 365;

  const calorieCoverage = totalAnnualCalories / annualCalorieRequirement;
  const daysOfCalories =
    totalAnnualCalories > 0
      ? Math.floor(totalAnnualCalories / dailyCalories)
      : 0;

  const roi =
    (annualGardenValue + annualLivestockNetValue) /
    (settings.numberOfBeds * 50 + settings.feedCostPerChickenMonth * 12);

  // ---------------------------
  // CHART DATA
  // ---------------------------

  const cropValueChart = adjustedCrops.map((crop) => ({
    name: crop.name,
    value: crop.adjustedYield * crop.pricePerUnit,
    calories: crop.adjustedYield * crop.caloriesPerUnit,
  }));

  const livestockChart = adjustedLivestock.map((l) => ({
    name: l.name,
    value: l.adjustedProduction * l.pricePerUnit,
    calories: l.adjustedProduction * l.caloriesPerUnit,
    count: l.count,
  }));

  // ---------------------------
  // UI STARTS HERE
  // ---------------------------

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-semibold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Scenario modeling, food security insights, production analytics, and
          ROI.
        </p>
      </div>

      {/* SCENARIO SIMULATOR */}
      <Card>
        <CardHeader>
          <CardTitle>Scenario Simulator</CardTitle>
          <CardDescription>
            Temporary adjustments for “What-if” planning only affect this
            dashboard view.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 text-sm">
          {/* Bed multiplier */}
          <div className="space-y-1">
            <p className="font-medium">
              Increase bed count (×{bedMultiplier.toFixed(2)})
            </p>
            <Slider
              value={[bedMultiplier]}
              onValueChange={(v: number[]) => setBedMultiplier(v[0])}
              min={0.5}
              max={3}
              step={0.1}
            />
          </div>

          {/* Egg reduction */}
          <div className="space-y-1">
            <p className="font-medium">
              Egg production reduction ({(eggReduction * 100).toFixed(0)}%)
            </p>
            <Slider
              value={[eggReduction]}
              onValueChange={(v: number[]) => setEggReduction(v[0])}
              min={0}
              max={0.5}
              step={0.05}
            />
          </div>

          {/* Feed increase */}
          <div className="space-y-1">
            <p className="font-medium">
              Feed cost increase ({(feedIncrease * 100).toFixed(0)}%)
            </p>
            <Slider
              value={[feedIncrease]}
              onValueChange={(v: number[]) => setFeedIncrease(v[0])}
              min={0}
              max={1}
              step={0.05}
            />
          </div>

          {/* Drought penalty */}
          <div className="space-y-1">
            <p className="font-medium">
              Drought year yield penalty ({(droughtPenalty * 100).toFixed(0)}%)
            </p>
            <Slider
              value={[droughtPenalty]}
              onValueChange={(v: number[]) => setDroughtPenalty(v[0])}
              min={0}
              max={0.7}
              step={0.05}
            />
          </div>
        </CardContent>
      </Card>

      {/* RESPONSIVE METRICS GRID */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        <Card className="border-l-4 border-l-green-600">
          <CardHeader>
            <CardTitle>Food Security</CardTitle>
            <CardDescription>Days of calories produced</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">{daysOfCalories}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-600">
          <CardHeader>
            <CardTitle>Calorie Independence</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">
              {(calorieCoverage * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-600">
          <CardHeader>
            <CardTitle>Annual ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">{(roi * 100).toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardHeader>
            <CardTitle>Livestock Net</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">
              ${annualLivestockNetValue.toFixed(0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Crop Value Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Crop Production Value</CardTitle>
            <CardDescription>Per-crop annual value</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cropValueChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-10}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Livestock Value Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Livestock Value</CardTitle>
            <CardDescription>Eggs, honey, goat milk, etc.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={livestockChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-10}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FF9800" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* CALORIES PIE CHART + PRODUCTION TREND */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calorie Distribution</CardTitle>
            <CardDescription>Crops vs livestock</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Crops", value: annualGardenCalories },
                    { name: "Livestock", value: annualLivestockCalories },
                  ]}
                  outerRadius={100}
                  label
                  dataKey="value"
                >
                  <Cell fill="#4CAF50" />
                  <Cell fill="#FF9800" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seasonal Production Trend</CardTitle>
            <CardDescription>Simulated “peak season” curve</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart
                data={[
                  { month: "Jan", calories: totalAnnualCalories * 0.03 },
                  { month: "Feb", calories: totalAnnualCalories * 0.05 },
                  { month: "Mar", calories: totalAnnualCalories * 0.1 },
                  { month: "Apr", calories: totalAnnualCalories * 0.15 },
                  { month: "May", calories: totalAnnualCalories * 0.2 },
                  { month: "Jun", calories: totalAnnualCalories * 0.28 },
                  { month: "Jul", calories: totalAnnualCalories * 0.32 },
                  { month: "Aug", calories: totalAnnualCalories * 0.25 },
                  { month: "Sep", calories: totalAnnualCalories * 0.18 },
                  { month: "Oct", calories: totalAnnualCalories * 0.1 },
                  { month: "Nov", calories: totalAnnualCalories * 0.06 },
                  { month: "Dec", calories: totalAnnualCalories * 0.03 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="calories" stroke="#03A9F4" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
