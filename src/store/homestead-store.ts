"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import {
  Crop,
  LivestockItem,
  Meal,
  LaborEntry,
  Settings,
  PantryItem,
} from "@/lib/types";

interface HomesteadState {
  crops: Crop[];
  livestock: LivestockItem[];
  meals: Meal[];
  labor: LaborEntry[];
  pantry: PantryItem[];
  settings: Settings;

  // derived helpers
  getAnnualGardenValue: () => number;
  getAnnualGardenCalories: () => number;
  getAnnualLivestockNetValue: () => number;
  getAnnualLivestockCalories: () => number;

  // mutators
  updateSettings: (partial: Partial<Settings>) => void;

  updateCrop: (id: string, partial: Partial<Crop>) => void;
  updateLivestock: (id: string, partial: Partial<LivestockItem>) => void;

  addLaborEntry: (entry: Omit<LaborEntry, "id">) => void;
  addMeal: (meal: Omit<Meal, "id">) => void;

  addPantryItem: (item: Omit<PantryItem, "id">) => void;
  consumePantry: (pantryItemId: string, amount: number) => void;
  initializePantryFromProduction: () => void;
}

const initialCrops: Crop[] = [
  { id: "tomatoes", name: "Tomatoes", season: "Summer", beds: 1, yieldPerBed: 50, unit: "lb", pricePerUnit: 3, caloriesPerUnit: 18 },
  { id: "lettuce", name: "Lettuce", season: "Spring/Fall", beds: 1, yieldPerBed: 30, unit: "head", pricePerUnit: 3, caloriesPerUnit: 15 },
  { id: "kale", name: "Kale", season: "Spring/Fall", beds: 1, yieldPerBed: 25, unit: "lb", pricePerUnit: 2.5, caloriesPerUnit: 35 },
  { id: "greenBeans", name: "Green Beans", season: "Summer", beds: 1, yieldPerBed: 15, unit: "lb", pricePerUnit: 3, caloriesPerUnit: 31 },
  { id: "carrots", name: "Carrots", season: "Spring/Fall", beds: 1, yieldPerBed: 25, unit: "lb", pricePerUnit: 1.5, caloriesPerUnit: 186 },
  { id: "herbs", name: "Herbs (dried)", season: "All", beds: 1, yieldPerBed: 2, unit: "lb", pricePerUnit: 50, caloriesPerUnit: 0 },
  { id: "potatoes", name: "Potatoes", season: "Summer", beds: 1, yieldPerBed: 40, unit: "lb", pricePerUnit: 1.2, caloriesPerUnit: 349 },
  { id: "radish", name: "Radish", season: "Spring/Fall", beds: 1, yieldPerBed: 20, unit: "lb", pricePerUnit: 1.5, caloriesPerUnit: 16 },
  { id: "ginger", name: "Ginger", season: "Summer", beds: 1, yieldPerBed: 10, unit: "lb", pricePerUnit: 4, caloriesPerUnit: 80 },
  { id: "garlic", name: "Garlic", season: "Summer", beds: 1, yieldPerBed: 10, unit: "lb", pricePerUnit: 3.5, caloriesPerUnit: 149 },
];

const initialLivestock: LivestockItem[] = [
  {
    id: "chickens",
    name: "Chickens (eggs)",
    count: 6,
    unit: "egg",
    annualProductionPerUnit: 0.75 * 365, // eggs per hen per year
    pricePerUnit: 5 / 12, // $/egg from $5/dozen
    annualCostPerUnit: 4 * 12, // $4/mo feed x 12
    caloriesPerUnit: 70,
  },
  {
    id: "bees",
    name: "Honey bees (hive)",
    count: 1,
    unit: "lb honey",
    annualProductionPerUnit: 40, // lbs per hive
    pricePerUnit: 8,
    annualCostPerUnit: 60,
    caloriesPerUnit: 1390,
  },
];

function computeTotalCropYield(crop: Crop, bedsSetting: number): number {
  // crude scaling vs baseline 2 beds as before
  const bedFactor = bedsSetting || 2;
  return crop.yieldPerBed * crop.beds * (bedFactor / 2);
}

export const useHomesteadStore = create<HomesteadState>()(
  persist(
    (set, get) => ({
      crops: initialCrops,
      livestock: initialLivestock,
      meals: [],
      labor: [],
      pantry: [],
      settings: {
        monthlyGroceryBudget: 300,
        laborHourlyValue: undefined,
        numberOfBeds: 2,
        bedLengthFeet: 8,
        bedWidthFeet: 4,
        eggPricePerDozen: 5,
        honeyPricePerLb: 8,
        feedCostPerChickenMonth: 4,
        hiveMaintenanceAnnual: 60,
      },

      getAnnualGardenValue: () => {
        const { crops, settings } = get();
        return crops.reduce((sum, crop) => {
          const totalYield = computeTotalCropYield(crop, settings.numberOfBeds);
          return sum + totalYield * crop.pricePerUnit;
        }, 0);
      },

      getAnnualGardenCalories: () => {
        const { crops, settings } = get();
        return crops.reduce((sum, crop) => {
          const totalYield = computeTotalCropYield(crop, settings.numberOfBeds);
          return sum + totalYield * crop.caloriesPerUnit;
        }, 0);
      },

      getAnnualLivestockNetValue: () => {
        const { livestock } = get();
        return livestock.reduce((sum, item) => {
          const annualProduction = item.annualProductionPerUnit * item.count;
          const value = annualProduction * item.pricePerUnit;
          const cost = item.annualCostPerUnit * item.count;
          return sum + (value - cost);
        }, 0);
      },

      getAnnualLivestockCalories: () => {
        const { livestock } = get();
        return livestock.reduce((sum, item) => {
          const annualProduction = item.annualProductionPerUnit * item.count;
          return sum + annualProduction * item.caloriesPerUnit;
        }, 0);
      },

      updateSettings: (partial) =>
        set((state) => ({
          settings: { ...state.settings, ...partial },
        })),

      updateCrop: (id, partial) =>
        set((state) => ({
          crops: state.crops.map((crop) =>
            crop.id === id ? { ...crop, ...partial } : crop
          ),
        })),

      updateLivestock: (id, partial) =>
        set((state) => ({
          livestock: state.livestock.map((item) =>
            item.id === id ? { ...item, ...partial } : item
          ),
        })),

      addLaborEntry: (entry) =>
        set((state) => ({
          labor: [...state.labor, { ...entry, id: nanoid() }],
        })),

      addMeal: (meal) =>
        set((state) => ({
          meals: [...state.meals, { ...meal, id: nanoid() }],
        })),

      addPantryItem: (item) =>
        set((state) => ({
          pantry: [...state.pantry, { ...item, id: nanoid() }],
        })),

      consumePantry: (pantryItemId, amount) =>
        set((state) => ({
          pantry: state.pantry
            .map((item) =>
              item.id === pantryItemId
                ? { ...item, quantity: Math.max(item.quantity - amount, 0) }
                : item
            )
            .filter((item) => item.quantity > 0),
        })),

      initializePantryFromProduction: () => {
        const { crops, livestock, settings } = get();

        const cropItems: PantryItem[] = crops.map((crop) => {
          const totalYield = computeTotalCropYield(crop, settings.numberOfBeds);
          return {
            id: nanoid(),
            name: crop.name,
            source: "garden",
            unit: crop.unit,
            quantity: totalYield,
            caloriesPerUnit: crop.caloriesPerUnit,
            costPerUnit: crop.pricePerUnit,
            linkedCropId: crop.id,
          };
        });

        const livestockItems: PantryItem[] = livestock.map((item) => {
          const annualProduction = item.annualProductionPerUnit * item.count;
          return {
            id: nanoid(),
            name: item.name,
            source: "livestock",
            unit: item.unit,
            quantity: annualProduction,
            caloriesPerUnit: item.caloriesPerUnit,
            costPerUnit: item.pricePerUnit,
            linkedLivestockId: item.id,
          };
        });

        set(() => ({
          pantry: [...cropItems, ...livestockItems],
        }));
      },
    }),
    {
      name: "homestead-planner-state",
      partialize: (state) => ({
        crops: state.crops,
        livestock: state.livestock,
        pantry: state.pantry,
        meals: state.meals,
        settings: state.settings,
        labor: state.labor,
      }),
    }
  )
);
