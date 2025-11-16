export type CropId =
  | "tomatoes"
  | "lettuce"
  | "kale"
  | "greenBeans"
  | "carrots"
  | "herbs"
  | "potatoes"
  | "radish"
  | "ginger"
  | "garlic";

export interface Crop {
  id: CropId | string; // allow custom crops later
  name: string;
  season: string;
  beds: number;
  yieldPerBed: number; // units per bed per year
  unit: string;
  pricePerUnit: number; // $
  caloriesPerUnit: number; // kcal
}

export type LivestockId = "chickens" | "bees" | string;

export interface LivestockItem {
  id: LivestockId;
  name: string;
  count: number;
  unit: string;
  annualProductionPerUnit: number; // eggs / lbs honey per animal/hive
  pricePerUnit: number; // $
  annualCostPerUnit: number; // $
  caloriesPerUnit: number; // kcal
}

export interface MealIngredient {
  cropId?: CropId | string;
  livestockId?: LivestockId;
  amount: number;
  unit: string;
}

export interface Meal {
  id: string;
  name: string;
  description?: string;
  ingredients: MealIngredient[];
  estimatedCost: number;
  estimatedCalories: number;
}

export interface LaborEntry {
  id: string;
  date: string; // ISO
  category: "garden" | "livestock" | "general";
  task: string;
  hours: number;
  notes?: string;
}

export type PantrySource = "garden" | "livestock" | "store";

export interface PantryItem {
  id: string;
  name: string;
  source: PantrySource;
  unit: string;
  quantity: number;
  caloriesPerUnit?: number;
  costPerUnit?: number;
  linkedCropId?: CropId | string;
  linkedLivestockId?: LivestockId;
}

export interface Settings {
  monthlyGroceryBudget: number;
  laborHourlyValue?: number; // optional $/hr

  // garden
  numberOfBeds: number;
  bedLengthFeet: number;
  bedWidthFeet: number;

  // economics (these can also be edited via livestock page later)
  eggPricePerDozen: number;
  honeyPricePerLb: number;
  feedCostPerChickenMonth: number;
  hiveMaintenanceAnnual: number;
}
