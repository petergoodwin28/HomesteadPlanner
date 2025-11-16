// lib/utils/yield-calculations.ts

import { Crop } from "@/store/homestead-store";
import type { Settings } from "@/store/homestead-store";

/**
 * Calculate experience modifier based on skill level
 */
export function getExperienceModifier(level?: "beginner" | "intermediate" | "advanced"): number {
  switch (level) {
    case "beginner":
      return 0.7; // 70% of optimal yields
    case "advanced":
      return 0.95; // 95% of optimal yields
    case "intermediate":
    default:
      return 0.85; // 85% of optimal yields
  }
}

/**
 * Calculate spoilage modifier
 */
export function getSpoilageModifier(spoilageRate?: number): number {
  return 1 - (spoilageRate || 0.1);
}

/**
 * Get weather variability range
 */
export function getWeatherVariability(impact?: "low" | "moderate" | "high"): { min: number; max: number } {
  switch (impact) {
    case "low":
      return { min: 0.95, max: 1.05 }; // ±5%
    case "high":
      return { min: 0.75, max: 1.25 }; // ±25%
    case "moderate":
    default:
      return { min: 0.85, max: 1.15 }; // ±15%
  }
}

/**
 * Get pest pressure loss
 */
export function getPestLossModifier(pressure?: "low" | "moderate" | "high"): number {
  switch (pressure) {
    case "low":
      return 0.98; // 2% loss
    case "high":
      return 0.83; // 17% average loss
    case "moderate":
    default:
      return 0.92; // 8% loss
  }
}

/**
 * Calculate adjusted yield for a crop with all modifiers
 */
export function calculateAdjustedYield(
  crop: Crop,
  settings: Settings,
  includeWeather: boolean = false
): {
  baseYield: number;
  adjustedYield: number;
  minYield: number;
  maxYield: number;
  modifiers: {
    experience: number;
    spoilage: number;
    pest: number;
    weather?: { min: number; max: number };
  };
} {
  const baseYield = crop.beds * crop.yieldPerBed;

  const experienceMod = getExperienceModifier(settings.experienceLevel);
  const spoilageMod = getSpoilageModifier(settings.spoilageRate);
  const pestMod = getPestLossModifier(settings.pestPressure);

  // Base adjusted yield (without weather)
  const adjustedYield = baseYield * experienceMod * spoilageMod * pestMod;

  let minYield = adjustedYield;
  let maxYield = adjustedYield;

  if (includeWeather) {
    const weatherRange = getWeatherVariability(settings.weatherImpact);
    minYield = adjustedYield * weatherRange.min;
    maxYield = adjustedYield * weatherRange.max;
  }

  return {
    baseYield,
    adjustedYield,
    minYield,
    maxYield,
    modifiers: {
      experience: experienceMod,
      spoilage: spoilageMod,
      pest: pestMod,
      ...(includeWeather && { weather: getWeatherVariability(settings.weatherImpact) }),
    },
  };
}

/**
 * Calculate total annual garden value with all adjustments
 */
export function calculateTotalGardenValue(
  crops: Crop[],
  settings: Settings
): {
  totalValue: number;
  totalCalories: number;
  totalYield: number;
  breakdown: Array<{
    cropName: string;
    yield: number;
    value: number;
    calories: number;
  }>;
} {
  let totalValue = 0;
  let totalCalories = 0;
  let totalYield = 0;

  const breakdown = crops.map((crop) => {
    const { adjustedYield } = calculateAdjustedYield(crop, settings);
    const value = adjustedYield * crop.pricePerUnit;
    const calories = adjustedYield * crop.caloriesPerUnit;

    totalValue += value;
    totalCalories += calories;
    totalYield += adjustedYield;

    return {
      cropName: crop.name,
      yield: adjustedYield,
      value,
      calories,
    };
  });

  return {
    totalValue,
    totalCalories,
    totalYield,
    breakdown,
  };
}

/**
 * Calculate preservation needs for a crop
 */
export function calculatePreservationNeeds(
  cropYield: number,
  preservationRatio: { inputAmount: number; outputAmount: number }
): {
  outputQuantity: number;
  batchesNeeded: number;
} {
  const outputQuantity = (cropYield / preservationRatio.inputAmount) * preservationRatio.outputAmount;
  const batchesNeeded = Math.ceil(cropYield / preservationRatio.inputAmount);

  return {
    outputQuantity,
    batchesNeeded,
  };
}

/**
 * Estimate planting date from harvest window
 */
export function estimatePlantingDate(
  targetHarvestDate: Date,
  daysToHarvest: number
): Date {
  const plantingDate = new Date(targetHarvestDate);
  plantingDate.setDate(plantingDate.getDate() - daysToHarvest);
  return plantingDate;
}

/**
 * Parse planting window (e.g., "Mar 15") into a date for current year
 */
export function parsePlantingWindow(windowString: string): Date {
  const [monthStr, dayStr] = windowString.split(" ");
  const monthMap: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };

  const month = monthMap[monthStr];
  const day = parseInt(dayStr);
  const year = new Date().getFullYear();

  return new Date(year, month, day);
}

/**
 * Calculate water costs
 */
export function calculateWaterCosts(
  crops: Crop[],
  settings: Settings,
  waterCostPerGallon: number = 0.01 // $0.01 per gallon default
): {
  weeklyGallons: number;
  weeklyCost: number;
  annualCost: number;
} {
  const weeklyGallons = crops.reduce((sum, crop) => {
    return sum + (crop.waterNeedsPerWeek || 5) * crop.beds;
  }, 0);

  const weeklyCost = weeklyGallons * waterCostPerGallon;
  
  // Assume 20 weeks of active growing season
  const annualCost = weeklyCost * 20;

  return {
    weeklyGallons,
    weeklyCost,
    annualCost,
  };
}

/**
 * Calculate total labor requirements
 */
export function calculateLaborRequirements(
  crops: Crop[],
  settings: Settings
): {
  totalSeasonHours: number;
  weeklyHoursAverage: number;
  laborCost?: number;
  breakdown: Array<{
    cropName: string;
    hours: number;
    cost?: number;
  }>;
} {
  let totalHours = 0;

  const breakdown = crops.map((crop) => {
    const hours = (crop.laborHoursPerBed || 4) * crop.beds;
    totalHours += hours;

    return {
      cropName: crop.name,
      hours,
      cost: settings.laborHourlyValue ? hours * settings.laborHourlyValue : undefined,
    };
  });

  // Spread over ~20 week growing season
  const weeklyHoursAverage = totalHours / 20;

  const laborCost = settings.laborHourlyValue 
    ? totalHours * settings.laborHourlyValue 
    : undefined;

  return {
    totalSeasonHours: totalHours,
    weeklyHoursAverage,
    laborCost,
    breakdown,
  };
}

/**
 * Calculate ROI for the garden
 */
export function calculateGardenROI(
  crops: Crop[],
  settings: Settings
): {
  annualValue: number;
  annualCosts: number;
  netValue: number;
  roi: number;
  breakEvenMonths?: number;
  includesLaborCost: boolean;
} {
  const { totalValue } = calculateTotalGardenValue(crops, settings);
  const { annualCost: waterCost } = calculateWaterCosts(crops, settings);
  const { laborCost } = calculateLaborRequirements(crops, settings);

  const seedBudget = settings.seedBudget || 0;
  
  let annualCosts = seedBudget + waterCost;
  if (laborCost) {
    annualCosts += laborCost;
  }

  const netValue = totalValue - annualCosts;
  const roi = annualCosts > 0 ? (netValue / annualCosts) * 100 : 0;

  // Estimate initial setup cost (beds, soil, tools)
  const initialInvestment = settings.numberOfBeds * 50; // $50 per bed estimate
  const breakEvenMonths = netValue > 0 
    ? Math.ceil((initialInvestment / netValue) * 12)
    : undefined;

  return {
    annualValue: totalValue,
    annualCosts,
    netValue,
    roi,
    breakEvenMonths,
    includesLaborCost: !!laborCost,
  };
}

/**
 * Get food security score (0-100)
 */
export function calculateFoodSecurityScore(
  totalCalories: number,
  peopleInHousehold: number = 1
): {
  score: number;
  daysOfFood: number;
  percentageOfNeeds: number;
} {
  const dailyCaloriesPerPerson = 2500;
  const annualCaloriesNeeded = dailyCaloriesPerPerson * 365 * peopleInHousehold;
  
  const percentageOfNeeds = (totalCalories / annualCaloriesNeeded) * 100;
  const daysOfFood = Math.floor(totalCalories / (dailyCaloriesPerPerson * peopleInHousehold));
  
  // Score calculation: 0-25% = 0-40 points, 25-50% = 40-70, 50-100% = 70-100
  let score = 0;
  if (percentageOfNeeds <= 25) {
    score = percentageOfNeeds * 1.6; // 0-40
  } else if (percentageOfNeeds <= 50) {
    score = 40 + ((percentageOfNeeds - 25) * 1.2); // 40-70
  } else {
    score = 70 + ((percentageOfNeeds - 50) * 0.6); // 70-100
  }
  
  return {
    score: Math.min(100, Math.round(score)),
    daysOfFood,
    percentageOfNeeds: Math.round(percentageOfNeeds),
  };
}