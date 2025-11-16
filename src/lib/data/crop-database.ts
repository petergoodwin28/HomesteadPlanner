// lib/data/crop-database.ts

export type Season = "spring" | "summer" | "fall" | "winter" | "year-round";
export type StorageMethod = "fresh" | "canned" | "frozen" | "dried" | "root-cellar" | "fermented";

export interface CropData {
  id: string;
  name: string;
  category: "vegetable" | "herb" | "fruit" | "grain";
  season: Season;
  plantingWindow: { start: string; end: string };
  harvestWindow: { daysToHarvest: number; harvestPeriodDays: number };
  yieldPerBedLow: number;
  yieldPerBedHigh: number;
  yieldPerBedAverage: number;
  unit: string;
  pricePerUnit: number;
  caloriesPerUnit: number;
  requirements: {
    waterNeedsGallonsPerWeek: number;
    sunRequirement: "full" | "partial" | "shade";
    spacingInches: number;
    rowSpacingInches: number;
  };
  preservation: {
    storageMethod: StorageMethod[];
    shelfLifeDays: number;
    preservationRatio: {
      inputAmount: number;
      inputUnit: string;
      outputAmount: number;
      outputUnit: string;
    };
  };
  laborHoursPerBed: number;
  companionPlants?: string[];
  avoidPlants?: string[];
  notes?: string;
}

/**
 * Comprehensive crop database with realistic growing data
 * Based on Zone 6-7 averages (adjust for your climate in settings)
 */

export const CROP_DATABASE: CropData[] = [
  // ═══════════════════════════════════════════════════════
  // SPRING CROPS
  // ═══════════════════════════════════════════════════════
  {
    id: "lettuce",
    name: "Lettuce",
    category: "vegetable",
    season: "spring",
    plantingWindow: { start: "Mar 15", end: "Apr 30" },
    harvestWindow: { daysToHarvest: 45, harvestPeriodDays: 30 },
    yieldPerBedLow: 15,
    yieldPerBedHigh: 30,
    yieldPerBedAverage: 22,
    unit: "lbs",
    pricePerUnit: 3.5,
    caloriesPerUnit: 68,
    requirements: {
      waterNeedsGallonsPerWeek: 5,
      sunRequirement: "partial",
      spacingInches: 8,
      rowSpacingInches: 12,
    },
    preservation: {
      storageMethod: ["fresh"],
      shelfLifeDays: 7,
      preservationRatio: {
        inputAmount: 1,
        inputUnit: "lbs",
        outputAmount: 1,
        outputUnit: "lbs",
      },
    },
    laborHoursPerBed: 3,
    companionPlants: ["carrots", "radishes", "strawberries"],
    avoidPlants: ["broccoli", "cabbage"],
  },

  {
    id: "spinach",
    name: "Spinach",
    category: "vegetable",
    season: "spring",
    plantingWindow: { start: "Mar 1", end: "Apr 15" },
    harvestWindow: { daysToHarvest: 40, harvestPeriodDays: 25 },
    yieldPerBedLow: 8,
    yieldPerBedHigh: 18,
    yieldPerBedAverage: 12,
    unit: "lbs",
    pricePerUnit: 4,
    caloriesPerUnit: 104,
    requirements: {
      waterNeedsGallonsPerWeek: 6,
      sunRequirement: "partial",
      spacingInches: 6,
      rowSpacingInches: 12,
    },
    preservation: {
      storageMethod: ["fresh", "frozen"],
      shelfLifeDays: 5,
      preservationRatio: {
        inputAmount: 2,
        inputUnit: "lbs",
        outputAmount: 1,
        outputUnit: "lbs frozen",
      },
    },
    laborHoursPerBed: 2.5,
    companionPlants: ["strawberries", "peas", "radishes"],
    avoidPlants: ["potatoes"],
  },

  {
    id: "peas",
    name: "Peas",
    category: "vegetable",
    season: "spring",
    plantingWindow: { start: "Mar 15", end: "Apr 30" },
    harvestWindow: { daysToHarvest: 60, harvestPeriodDays: 20 },
    yieldPerBedLow: 4,
    yieldPerBedHigh: 12,
    yieldPerBedAverage: 8,
    unit: "lbs",
    pricePerUnit: 3,
    caloriesPerUnit: 367,
    requirements: {
      waterNeedsGallonsPerWeek: 4,
      sunRequirement: "full",
      spacingInches: 2,
      rowSpacingInches: 18,
    },
    preservation: {
      storageMethod: ["fresh", "frozen", "dried"],
      shelfLifeDays: 3,
      preservationRatio: {
        inputAmount: 3,
        inputUnit: "lbs",
        outputAmount: 2,
        outputUnit: "lbs frozen",
      },
    },
    laborHoursPerBed: 4,
    companionPlants: ["carrots", "radishes", "turnips"],
    avoidPlants: ["onions", "garlic"],
  },

  {
    id: "radishes",
    name: "Radishes",
    category: "vegetable",
    season: "spring",
    plantingWindow: { start: "Mar 15", end: "May 15" },
    harvestWindow: { daysToHarvest: 25, harvestPeriodDays: 10 },
    yieldPerBedLow: 8,
    yieldPerBedHigh: 15,
    yieldPerBedAverage: 12,
    unit: "lbs",
    pricePerUnit: 2.5,
    caloriesPerUnit: 73,
    requirements: {
      waterNeedsGallonsPerWeek: 5,
      sunRequirement: "full",
      spacingInches: 2,
      rowSpacingInches: 6,
    },
    preservation: {
      storageMethod: ["fresh", "fermented"],
      shelfLifeDays: 14,
      preservationRatio: {
        inputAmount: 2,
        inputUnit: "lbs",
        outputAmount: 1,
        outputUnit: "quarts pickled",
      },
    },
    laborHoursPerBed: 1.5,
    companionPlants: ["lettuce", "peas", "cucumbers"],
  },

  // ═══════════════════════════════════════════════════════
  // SUMMER CROPS
  // ═══════════════════════════════════════════════════════
  {
    id: "tomatoes",
    name: "Tomatoes",
    category: "vegetable",
    season: "summer",
    plantingWindow: { start: "May 1", end: "Jun 15" },
    harvestWindow: { daysToHarvest: 70, harvestPeriodDays: 60 },
    yieldPerBedLow: 20,
    yieldPerBedHigh: 60,
    yieldPerBedAverage: 40,
    unit: "lbs",
    pricePerUnit: 2.5,
    caloriesPerUnit: 82,
    requirements: {
      waterNeedsGallonsPerWeek: 8,
      sunRequirement: "full",
      spacingInches: 24,
      rowSpacingInches: 36,
    },
    preservation: {
      storageMethod: ["canned", "frozen", "dried"],
      shelfLifeDays: 7,
      preservationRatio: {
        inputAmount: 10,
        inputUnit: "lbs",
        outputAmount: 7,
        outputUnit: "quarts",
      },
    },
    laborHoursPerBed: 8,
    companionPlants: ["basil", "carrots", "onions"],
    avoidPlants: ["potatoes", "fennel", "corn"],
    notes: "Requires staking/caging. High maintenance but rewarding.",
  },

  {
    id: "cucumbers",
    name: "Cucumbers",
    category: "vegetable",
    season: "summer",
    plantingWindow: { start: "May 15", end: "Jun 30" },
    harvestWindow: { daysToHarvest: 55, harvestPeriodDays: 45 },
    yieldPerBedLow: 15,
    yieldPerBedHigh: 35,
    yieldPerBedAverage: 25,
    unit: "lbs",
    pricePerUnit: 1.5,
    caloriesPerUnit: 68,
    requirements: {
      waterNeedsGallonsPerWeek: 10,
      sunRequirement: "full",
      spacingInches: 12,
      rowSpacingInches: 36,
    },
    preservation: {
      storageMethod: ["fresh", "canned", "fermented"],
      shelfLifeDays: 7,
      preservationRatio: {
        inputAmount: 10,
        inputUnit: "lbs",
        outputAmount: 4,
        outputUnit: "quarts pickled",
      },
    },
    laborHoursPerBed: 5,
    companionPlants: ["beans", "peas", "radishes"],
    avoidPlants: ["sage", "potatoes"],
  },

  {
    id: "zucchini",
    name: "Zucchini",
    category: "vegetable",
    season: "summer",
    plantingWindow: { start: "May 15", end: "Jul 1" },
    harvestWindow: { daysToHarvest: 50, harvestPeriodDays: 50 },
    yieldPerBedLow: 25,
    yieldPerBedHigh: 60,
    yieldPerBedAverage: 40,
    unit: "lbs",
    pricePerUnit: 1.2,
    caloriesPerUnit: 75,
    requirements: {
      waterNeedsGallonsPerWeek: 8,
      sunRequirement: "full",
      spacingInches: 36,
      rowSpacingInches: 48,
    },
    preservation: {
      storageMethod: ["fresh", "frozen", "canned"],
      shelfLifeDays: 7,
      preservationRatio: {
        inputAmount: 5,
        inputUnit: "lbs",
        outputAmount: 3,
        outputUnit: "lbs frozen",
      },
    },
    laborHoursPerBed: 4,
    companionPlants: ["beans", "corn", "peas"],
    avoidPlants: ["potatoes"],
    notes: "Very productive. Watch for overproduction!",
  },

  {
    id: "peppers",
    name: "Peppers (Bell)",
    category: "vegetable",
    season: "summer",
    plantingWindow: { start: "May 1", end: "Jun 15" },
    harvestWindow: { daysToHarvest: 70, harvestPeriodDays: 50 },
    yieldPerBedLow: 10,
    yieldPerBedHigh: 25,
    yieldPerBedAverage: 18,
    unit: "lbs",
    pricePerUnit: 3,
    caloriesPerUnit: 118,
    requirements: {
      waterNeedsGallonsPerWeek: 7,
      sunRequirement: "full",
      spacingInches: 18,
      rowSpacingInches: 24,
    },
    preservation: {
      storageMethod: ["fresh", "frozen", "canned", "dried"],
      shelfLifeDays: 10,
      preservationRatio: {
        inputAmount: 3,
        inputUnit: "lbs",
        outputAmount: 2,
        outputUnit: "lbs frozen",
      },
    },
    laborHoursPerBed: 6,
    companionPlants: ["basil", "onions", "tomatoes"],
    avoidPlants: ["fennel", "beans"],
  },

  {
    id: "green-beans",
    name: "Green Beans",
    category: "vegetable",
    season: "summer",
    plantingWindow: { start: "May 15", end: "Jul 15" },
    harvestWindow: { daysToHarvest: 55, harvestPeriodDays: 30 },
    yieldPerBedLow: 8,
    yieldPerBedHigh: 20,
    yieldPerBedAverage: 14,
    unit: "lbs",
    pricePerUnit: 3,
    caloriesPerUnit: 141,
    requirements: {
      waterNeedsGallonsPerWeek: 6,
      sunRequirement: "full",
      spacingInches: 4,
      rowSpacingInches: 18,
    },
    preservation: {
      storageMethod: ["fresh", "frozen", "canned"],
      shelfLifeDays: 5,
      preservationRatio: {
        inputAmount: 3,
        inputUnit: "lbs",
        outputAmount: 2,
        outputUnit: "quarts",
      },
    },
    laborHoursPerBed: 5,
    companionPlants: ["corn", "cucumbers", "potatoes"],
    avoidPlants: ["onions", "garlic"],
  },

  {
    id: "basil",
    name: "Basil",
    category: "herb",
    season: "summer",
    plantingWindow: { start: "May 1", end: "Jun 30" },
    harvestWindow: { daysToHarvest: 60, harvestPeriodDays: 90 },
    yieldPerBedLow: 2,
    yieldPerBedHigh: 6,
    yieldPerBedAverage: 4,
    unit: "lbs",
    pricePerUnit: 12,
    caloriesPerUnit: 104,
    requirements: {
      waterNeedsGallonsPerWeek: 5,
      sunRequirement: "full",
      spacingInches: 12,
      rowSpacingInches: 18,
    },
    preservation: {
      storageMethod: ["fresh", "dried", "frozen"],
      shelfLifeDays: 5,
      preservationRatio: {
        inputAmount: 4,
        inputUnit: "lbs",
        outputAmount: 1,
        outputUnit: "lbs dried",
      },
    },
    laborHoursPerBed: 2,
    companionPlants: ["tomatoes", "peppers"],
    avoidPlants: ["rue", "sage"],
  },

  // ═══════════════════════════════════════════════════════
  // FALL CROPS
  // ═══════════════════════════════════════════════════════
  {
    id: "carrots",
    name: "Carrots",
    category: "vegetable",
    season: "fall",
    plantingWindow: { start: "Jul 15", end: "Aug 31" },
    harvestWindow: { daysToHarvest: 70, harvestPeriodDays: 30 },
    yieldPerBedLow: 12,
    yieldPerBedHigh: 25,
    yieldPerBedAverage: 18,
    unit: "lbs",
    pricePerUnit: 2,
    caloriesPerUnit: 186,
    requirements: {
      waterNeedsGallonsPerWeek: 5,
      sunRequirement: "full",
      spacingInches: 3,
      rowSpacingInches: 12,
    },
    preservation: {
      storageMethod: ["fresh", "root-cellar", "frozen", "canned"],
      shelfLifeDays: 120,
      preservationRatio: {
        inputAmount: 1,
        inputUnit: "lbs",
        outputAmount: 1,
        outputUnit: "lbs",
      },
    },
    laborHoursPerBed: 3,
    companionPlants: ["onions", "lettuce", "peas"],
    avoidPlants: ["dill", "parsnips"],
  },

  {
    id: "kale",
    name: "Kale",
    category: "vegetable",
    season: "fall",
    plantingWindow: { start: "Aug 1", end: "Sep 15" },
    harvestWindow: { daysToHarvest: 55, harvestPeriodDays: 60 },
    yieldPerBedLow: 10,
    yieldPerBedHigh: 22,
    yieldPerBedAverage: 16,
    unit: "lbs",
    pricePerUnit: 3.5,
    caloriesPerUnit: 227,
    requirements: {
      waterNeedsGallonsPerWeek: 6,
      sunRequirement: "full",
      spacingInches: 12,
      rowSpacingInches: 18,
    },
    preservation: {
      storageMethod: ["fresh", "frozen", "dried"],
      shelfLifeDays: 7,
      preservationRatio: {
        inputAmount: 3,
        inputUnit: "lbs",
        outputAmount: 2,
        outputUnit: "lbs frozen",
      },
    },
    laborHoursPerBed: 3,
    companionPlants: ["beets", "onions", "potatoes"],
    notes: "Frost improves flavor!",
  },

  {
    id: "broccoli",
    name: "Broccoli",
    category: "vegetable",
    season: "fall",
    plantingWindow: { start: "Jul 15", end: "Aug 31" },
    harvestWindow: { daysToHarvest: 70, harvestPeriodDays: 20 },
    yieldPerBedLow: 6,
    yieldPerBedHigh: 15,
    yieldPerBedAverage: 10,
    unit: "lbs",
    pricePerUnit: 2.5,
    caloriesPerUnit: 154,
    requirements: {
      waterNeedsGallonsPerWeek: 7,
      sunRequirement: "full",
      spacingInches: 18,
      rowSpacingInches: 24,
    },
    preservation: {
      storageMethod: ["fresh", "frozen"],
      shelfLifeDays: 7,
      preservationRatio: {
        inputAmount: 2,
        inputUnit: "lbs",
        outputAmount: 1.5,
        outputUnit: "lbs frozen",
      },
    },
    laborHoursPerBed: 5,
    companionPlants: ["beets", "onions", "potatoes"],
    avoidPlants: ["tomatoes", "strawberries"],
  },

  {
    id: "potatoes",
    name: "Potatoes",
    category: "vegetable",
    season: "fall",
    plantingWindow: { start: "Mar 15", end: "May 1" },
    harvestWindow: { daysToHarvest: 90, harvestPeriodDays: 14 },
    yieldPerBedLow: 15,
    yieldPerBedHigh: 40,
    yieldPerBedAverage: 28,
    unit: "lbs",
    pricePerUnit: 1.2,
    caloriesPerUnit: 350,
    requirements: {
      waterNeedsGallonsPerWeek: 6,
      sunRequirement: "full",
      spacingInches: 12,
      rowSpacingInches: 24,
    },
    preservation: {
      storageMethod: ["root-cellar", "fresh"],
      shelfLifeDays: 180,
      preservationRatio: {
        inputAmount: 1,
        inputUnit: "lbs",
        outputAmount: 1,
        outputUnit: "lbs",
      },
    },
    laborHoursPerBed: 6,
    companionPlants: ["beans", "corn", "peas"],
    avoidPlants: ["tomatoes", "cucumbers"],
    notes: "Excellent storage crop. High calorie density.",
  },

  {
    id: "winter-squash",
    name: "Winter Squash",
    category: "vegetable",
    season: "fall",
    plantingWindow: { start: "May 15", end: "Jun 30" },
    harvestWindow: { daysToHarvest: 100, harvestPeriodDays: 21 },
    yieldPerBedLow: 20,
    yieldPerBedHigh: 50,
    yieldPerBedAverage: 35,
    unit: "lbs",
    pricePerUnit: 1.5,
    caloriesPerUnit: 188,
    requirements: {
      waterNeedsGallonsPerWeek: 8,
      sunRequirement: "full",
      spacingInches: 48,
      rowSpacingInches: 60,
    },
    preservation: {
      storageMethod: ["fresh", "root-cellar"],
      shelfLifeDays: 120,
      preservationRatio: {
        inputAmount: 1,
        inputUnit: "lbs",
        outputAmount: 1,
        outputUnit: "lbs",
      },
    },
    laborHoursPerBed: 4,
    companionPlants: ["beans", "corn", "peas"],
    avoidPlants: ["potatoes"],
    notes: "Long storage life. Space hog but worth it.",
  },

  // ═══════════════════════════════════════════════════════
  // YEAR-ROUND / PERENNIALS
  // ═══════════════════════════════════════════════════════
  {
    id: "garlic",
    name: "Garlic",
    category: "vegetable",
    season: "year-round",
    plantingWindow: { start: "Oct 1", end: "Nov 15" },
    harvestWindow: { daysToHarvest: 240, harvestPeriodDays: 14 },
    yieldPerBedLow: 3,
    yieldPerBedHigh: 8,
    yieldPerBedAverage: 5,
    unit: "lbs",
    pricePerUnit: 8,
    caloriesPerUnit: 680,
    requirements: {
      waterNeedsGallonsPerWeek: 3,
      sunRequirement: "full",
      spacingInches: 6,
      rowSpacingInches: 12,
    },
    preservation: {
      storageMethod: ["fresh", "dried"],
      shelfLifeDays: 180,
      preservationRatio: {
        inputAmount: 1,
        inputUnit: "lbs",
        outputAmount: 1,
        outputUnit: "lbs",
      },
    },
    laborHoursPerBed: 2,
    companionPlants: ["tomatoes", "carrots", "beets"],
    avoidPlants: ["beans", "peas"],
    notes: "Plant in fall, harvest in summer. Very low maintenance.",
  },

  {
    id: "onions",
    name: "Onions",
    category: "vegetable",
    season: "year-round",
    plantingWindow: { start: "Mar 15", end: "Apr 30" },
    harvestWindow: { daysToHarvest: 100, harvestPeriodDays: 21 },
    yieldPerBedLow: 10,
    yieldPerBedHigh: 25,
    yieldPerBedAverage: 18,
    unit: "lbs",
    pricePerUnit: 1.5,
    caloriesPerUnit: 182,
    requirements: {
      waterNeedsGallonsPerWeek: 4,
      sunRequirement: "full",
      spacingInches: 4,
      rowSpacingInches: 12,
    },
    preservation: {
      storageMethod: ["fresh", "root-cellar", "dried"],
      shelfLifeDays: 120,
      preservationRatio: {
        inputAmount: 1,
        inputUnit: "lbs",
        outputAmount: 1,
        outputUnit: "lbs",
      },
    },
    laborHoursPerBed: 3,
    companionPlants: ["carrots", "lettuce", "tomatoes"],
    avoidPlants: ["beans", "peas"],
  },
];

/**
 * Helper function to get crops by season
 */
export function getCropsBySeason(season: string): CropData[] {
  return CROP_DATABASE.filter((crop) => crop.season === season);
}

/**
 * Helper function to find a crop by ID
 */
export function getCropById(id: string): CropData | undefined {
  return CROP_DATABASE.find((crop) => crop.id === id);
}

/**
 * Get crop categories for filtering
 */
export function getCropCategories(): string[] {
  return Array.from(new Set(CROP_DATABASE.map((crop) => crop.category)));
}