"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";

/* ------------------------------------------------------
   Types
-------------------------------------------------------*/

export interface Crop {
  id: string;
  name: string;
  beds: number;
  season: string;
  yieldPerBed: number;
  unit: string;
  pricePerUnit: number;
  caloriesPerUnit: number;
  
  // NEW OPTIONAL FIELDS - Add these for enhanced crops
  daysToHarvest?: number;
  harvestWindowDays?: number;
  plantingWindowStart?: string;  // "Mar 15"
  plantingWindowEnd?: string;    // "Apr 30"
  waterNeedsPerWeek?: number;    // gallons per bed
  laborHoursPerBed?: number;     // hours per season
  storageMethod?: "fresh" | "canned" | "frozen" | "dried" | "root-cellar" | "fermented";
  shelfLifeDays?: number;
}

export interface LivestockItem {
  id: string;
  name: string;
  count: number;
  annualProductionPerUnit: number;
  pricePerUnit: number;
  annualCostPerUnit: number;
  caloriesPerUnit: number;
  unit: string;
}

export interface Settings {
  // Existing fields
  numberOfBeds: number;
  bedLengthFeet: number;
  bedWidthFeet: number;
  monthlyGroceryBudget: number;
  laborHourlyValue?: number;
  eggPricePerDozen: number;
  honeyPricePerLb: number;
  feedCostPerChickenMonth: number;
  hiveMaintenanceAnnual: number;

  // NEW FIELDS
  climateZone?: "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";
  experienceLevel?: "beginner" | "intermediate" | "advanced";
  seedBudget?: number;
  
  // Reality factors
  spoilageRate?: number; // 0.1 = 10%
  weatherImpact?: "low" | "moderate" | "high";
  pestPressure?: "low" | "moderate" | "high";
}

/* ------------------------------------------------------
   Labor Types
-------------------------------------------------------*/
export interface LaborEntry {
  id: string;
  category: string;   // "Garden", "Livestock", "Maintenance", etc
  task: string;
  hours: number;
  date: string;       // ISO string
}

/* ------------------------------------------------------
   Bed Types (hybrid layout)
-------------------------------------------------------*/

export interface GardenBed {
  id: string;
  crops: string[];
  grid: (string | null)[];
}

function createEmptyGrid() {
  return new Array(32).fill(null);
}

/* ------------------------------------------------------
   Store Interface
-------------------------------------------------------*/

interface HomesteadState {
  settings: Settings;
  crops: Crop[];
  livestock: LivestockItem[];

  beds: GardenBed[];

  labor: LaborEntry[];

  updateSettings: (patch: Partial<Settings>) => void;
  updateCrop: (id: string, patch: Partial<Crop>) => void;

  updateLivestock: (id: string, patch: Partial<LivestockItem>) => void;
  addLivestock: (item: Omit<LivestockItem, "id">) => void;
  removeLivestock: (id: string) => void;

  syncBedCountWithSettings: (count: number) => void;
  addBed: () => void;
  removeBed: (id: string) => void;

  assignCropToBed: (bedId: string, cropId: string) => void;
  removeCropFromBed: (bedId: string, cropId: string) => void;

  assignCropToCell: (bedId: string, index: number, cropId: string) => void;
  clearCell: (bedId: string, index: number) => void;

  /* Labor actions */
  addLabor: (entry: Omit<LaborEntry, "id">) => void;
  updateLabor: (id: string, patch: Partial<LaborEntry>) => void;
  removeLabor: (id: string) => void;

  getCropDistribution: () => Record<string, number>;
}

/* ------------------------------------------------------
   Store Implementation
-------------------------------------------------------*/

export const useHomesteadStore = create<HomesteadState>()(
  persist(
    (set, get) => ({
      /* Defaults */
      settings: {
        numberOfBeds: 4,
        bedLengthFeet: 8,
        bedWidthFeet: 4,
        monthlyGroceryBudget: 400,
        laborHourlyValue: undefined,
        eggPricePerDozen: 4,
        honeyPricePerLb: 8,
        feedCostPerChickenMonth: 3,
        hiveMaintenanceAnnual: 50,
        
        // NEW DEFAULTS
        climateZone: "7",
        experienceLevel: "intermediate",
        seedBudget: 200,
        spoilageRate: 0.1,
        weatherImpact: "moderate",
        pestPressure: "moderate",
      },

      crops: [],
      livestock: [
        {
          id: "chickens",
          name: "Chickens",
          count: 6,
          annualProductionPerUnit: 260,
          pricePerUnit: 0.25,
          annualCostPerUnit: 36,
          caloriesPerUnit: 70,
          unit: "egg",
        },
        {
          id: "bees",
          name: "Honey Bees",
          count: 1,
          annualProductionPerUnit: 60,
          pricePerUnit: 8,
          annualCostPerUnit: 50,
          caloriesPerUnit: 1392,
          unit: "lb honey",
        },
      ],

      beds: Array.from({ length: 4 }).map(() => ({
        id: nanoid(),
        crops: [],
        grid: createEmptyGrid(),
      })),

      /* NEW LABOR MODULE */
      labor: [],

      /* Settings */
      updateSettings: (patch) =>
        set((state) => ({ settings: { ...state.settings, ...patch } })),

      updateCrop: (id, patch) =>
        set((state) => ({
          crops: state.crops.map((c) =>
            c.id === id ? { ...c, ...patch } : c
          ),
        })),

      updateLivestock: (id, patch) =>
        set((state) => ({
          livestock: state.livestock.map((l) =>
            l.id === id ? { ...l, ...patch } : l
          ),
        })),

      addLivestock: (item) =>
        set((state) => ({
          livestock: [...state.livestock, { ...item, id: nanoid() }],
        })),

      removeLivestock: (id) =>
        set((state) => ({
          livestock: state.livestock.filter((l) => l.id !== id),
        })),

      /* Garden beds */
      syncBedCountWithSettings: (count) =>
        set((state) => {
          const current = state.beds.length;
          if (count > current) {
            const extra = Array.from({ length: count - current }).map(() => ({
              id: nanoid(),
              crops: [],
              grid: createEmptyGrid(),
            }));
            return { beds: [...state.beds, ...extra] };
          }
          if (count < current) {
            return { beds: state.beds.slice(0, count) };
          }
          return {};
        }),

      addBed: () =>
        set((state) => ({
          beds: [
            ...state.beds,
            { id: nanoid(), crops: [], grid: createEmptyGrid() },
          ],
        })),

      removeBed: (id) =>
        set((state) => ({
          beds: state.beds.filter((b) => b.id !== id),
        })),

      assignCropToBed: (bedId, cropId) =>
        set((state) => ({
          beds: state.beds.map((b) =>
            b.id === bedId && !b.crops.includes(cropId)
              ? { ...b, crops: [...b.crops, cropId] }
              : b
          ),
        })),

      removeCropFromBed: (bedId, cropId) =>
        set((state) => ({
          beds: state.beds.map((b) =>
            b.id === bedId
              ? { ...b, crops: b.crops.filter((c) => c !== cropId) }
              : b
          ),
        })),

      assignCropToCell: (bedId, index, cropId) =>
        set((state) => ({
          beds: state.beds.map((b) =>
            b.id === bedId
              ? {
                  ...b,
                  grid: b.grid.map((cell, i) =>
                    i === index ? cropId : cell
                  ),
                }
              : b
          ),
        })),

      clearCell: (bedId, index) =>
        set((state) => ({
          beds: state.beds.map((b) =>
            b.id === bedId
              ? {
                  ...b,
                  grid: b.grid.map((cell, i) =>
                    i === index ? null : cell
                  ),
                }
              : b
          ),
        })),

      /* LABOR ACTIONS */
      addLabor: (entry) =>
        set((state) => ({
          labor: [...state.labor, { ...entry, id: nanoid() }],
        })),

      updateLabor: (id, patch) =>
        set((state) => ({
          labor: state.labor.map((e) =>
            e.id === id ? { ...e, ...patch } : e
          ),
        })),

      removeLabor: (id) =>
        set((state) => ({
          labor: state.labor.filter((e) => e.id !== id),
        })),

      /* Distribution selector */
      getCropDistribution: () => {
        const { beds } = get();
        const dist: Record<string, number> = {};
        beds.forEach((bed) =>
          bed.grid.forEach((cell) => {
            if (cell) dist[cell] = (dist[cell] || 0) + 1;
          })
        );
        return dist;
      },
    }),
    { name: "homestead-store" }
  )
);