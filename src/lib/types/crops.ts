// lib/types/crops.ts

export type Season = "spring" | "summer" | "fall" | "winter" | "year-round";

export type StorageMethod = 
  | "fresh" 
  | "canned" 
  | "frozen" 
  | "dried" 
  | "root-cellar" 
  | "fermented";

export type ClimateZone = 
  | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export interface PlantingWindow {
  start: string; // "Mar 15" format
  end: string;   // "Apr 30" format
}

export interface HarvestWindow {
  daysToHarvest: number;      // 60 days from planting
  harvestPeriodDays: number;  // 30 days harvest window
}

export interface GrowingRequirements {
  waterNeedsGallonsPerWeek: number;  // per bed
  sunRequirement: "full" | "partial" | "shade";
  spacingInches: number;             // plant spacing
  rowSpacingInches: number;          // between rows
}

export interface PreservationData {
  storageMethod: StorageMethod[];    // Can have multiple methods
  shelfLifeDays: number;             // How long it lasts
  preservationRatio: {               // 10 lbs fresh → 7 quarts canned
    inputAmount: number;
    inputUnit: string;
    outputAmount: number;
    outputUnit: string;
  };
}

// Extended crop interface with all new fields
export interface CropData {
  id: string;
  name: string;
  category: "vegetable" | "herb" | "fruit" | "grain";
  
  // Planting & Growing
  season: Season;
  plantingWindow: PlantingWindow;
  harvestWindow: HarvestWindow;
  
  // Yield data
  yieldPerBedLow: number;      // Conservative estimate
  yieldPerBedHigh: number;     // Optimal conditions
  yieldPerBedAverage: number;  // Realistic middle
  unit: string;
  
  // Economics
  pricePerUnit: number;
  caloriesPerUnit: number;
  
  // Growing requirements
  requirements: GrowingRequirements;
  
  // Preservation
  preservation: PreservationData;
  
  // Labor
  laborHoursPerBed: number;    // Total for season
  
  // Notes
  companionPlants?: string[];  // Good neighbors
  avoidPlants?: string[];      // Bad neighbors
  notes?: string;
}

// Your existing Crop interface for the store (we'll migrate to CropData)
export interface Crop {
  id: string;
  name: string;
  beds: number;
  season: string;
  yieldPerBed: number;
  unit: string;
  pricePerUnit: number;
  caloriesPerUnit: number;
  
  // New fields to add gradually
  daysToHarvest?: number;
  harvestWindowDays?: number;
  plantingWindowStart?: string;
  plantingWindowEnd?: string;
  storageMethod?: StorageMethod;
  shelfLifeDays?: number;
  waterNeedsPerWeek?: number;
  laborHoursPerBed?: number;
}