// lib/data/preservation-recipes.ts

export interface PreservationRecipe {
  id: string;
  name: string;
  cropId: string; // Links to crop database
  method: "canning" | "freezing" | "drying" | "fermenting" | "root-cellar";
  
  // Conversion ratios
  inputAmount: number;
  inputUnit: string;
  outputAmount: number;
  outputUnit: string;
  
  // Container info
  jarSize?: "pint" | "quart" | "half-gallon";
  containerCount?: number; // How many jars/bags per recipe
  
  // Supplies needed
  supplies: Array<{
    item: string;
    quantity: number;
    unit: string;
    costPer: number; // dollars
    reusable: boolean;
  }>;
  
  // Time estimates
  prepTimeMinutes: number;
  processingTimeMinutes: number;
  
  // Notes
  notes?: string;
  difficulty: "easy" | "medium" | "hard";
}

export const PRESERVATION_RECIPES: PreservationRecipe[] = [
  // ═══════════════════════════════════════════════════════
  // TOMATO RECIPES
  // ═══════════════════════════════════════════════════════
  {
    id: "tomato-sauce",
    name: "Tomato Sauce (Plain)",
    cropId: "tomatoes",
    method: "canning",
    inputAmount: 10,
    inputUnit: "lbs",
    outputAmount: 7,
    outputUnit: "quarts",
    jarSize: "quart",
    containerCount: 7,
    supplies: [
      { item: "Quart jars", quantity: 7, unit: "jars", costPer: 1.2, reusable: true },
      { item: "Lids", quantity: 7, unit: "lids", costPer: 0.3, reusable: false },
      { item: "Rings", quantity: 7, unit: "rings", costPer: 0.2, reusable: true },
      { item: "Lemon juice", quantity: 7, unit: "tbsp", costPer: 0.05, reusable: false },
    ],
    prepTimeMinutes: 45,
    processingTimeMinutes: 40,
    difficulty: "medium",
    notes: "Add 2 tbsp lemon juice per quart for safe acidity.",
  },

  {
    id: "tomato-salsa",
    name: "Salsa",
    cropId: "tomatoes",
    method: "canning",
    inputAmount: 8,
    inputUnit: "lbs",
    outputAmount: 8,
    outputUnit: "pints",
    jarSize: "pint",
    containerCount: 8,
    supplies: [
      { item: "Pint jars", quantity: 8, unit: "jars", costPer: 1.0, reusable: true },
      { item: "Lids", quantity: 8, unit: "lids", costPer: 0.25, reusable: false },
      { item: "Rings", quantity: 8, unit: "rings", costPer: 0.15, reusable: true },
      { item: "Vinegar", quantity: 1, unit: "cup", costPer: 0.5, reusable: false },
      { item: "Peppers", quantity: 2, unit: "lbs", costPer: 3, reusable: false },
      { item: "Onions", quantity: 1, unit: "lbs", costPer: 1.5, reusable: false },
    ],
    prepTimeMinutes: 60,
    processingTimeMinutes: 20,
    difficulty: "medium",
    notes: "Requires additional vegetables. Recipe tested for safe canning.",
  },

  {
    id: "crushed-tomatoes",
    name: "Crushed Tomatoes",
    cropId: "tomatoes",
    method: "canning",
    inputAmount: 12,
    inputUnit: "lbs",
    outputAmount: 6,
    outputUnit: "quarts",
    jarSize: "quart",
    containerCount: 6,
    supplies: [
      { item: "Quart jars", quantity: 6, unit: "jars", costPer: 1.2, reusable: true },
      { item: "Lids", quantity: 6, unit: "lids", costPer: 0.3, reusable: false },
      { item: "Rings", quantity: 6, unit: "rings", costPer: 0.2, reusable: true },
      { item: "Citric acid", quantity: 3, unit: "tsp", costPer: 0.1, reusable: false },
    ],
    prepTimeMinutes: 30,
    processingTimeMinutes: 35,
    difficulty: "easy",
    notes: "Simple preparation. Great for pasta and pizza sauce.",
  },

  // ═══════════════════════════════════════════════════════
  // CUCUMBER RECIPES
  // ═══════════════════════════════════════════════════════
  {
    id: "dill-pickles",
    name: "Dill Pickles",
    cropId: "cucumbers",
    method: "canning",
    inputAmount: 10,
    inputUnit: "lbs",
    outputAmount: 7,
    outputUnit: "quarts",
    jarSize: "quart",
    containerCount: 7,
    supplies: [
      { item: "Quart jars", quantity: 7, unit: "jars", costPer: 1.2, reusable: true },
      { item: "Lids", quantity: 7, unit: "lids", costPer: 0.3, reusable: false },
      { item: "Rings", quantity: 7, unit: "rings", costPer: 0.2, reusable: true },
      { item: "Vinegar", quantity: 6, unit: "cups", costPer: 0.5, reusable: false },
      { item: "Pickling salt", quantity: 0.5, unit: "cups", costPer: 1.5, reusable: false },
      { item: "Dill", quantity: 1, unit: "bunch", costPer: 2, reusable: false },
    ],
    prepTimeMinutes: 45,
    processingTimeMinutes: 15,
    difficulty: "easy",
    notes: "Use pickling cucumbers, not slicing types. Kosher dill recipe.",
  },

  {
    id: "bread-and-butter-pickles",
    name: "Bread & Butter Pickles",
    cropId: "cucumbers",
    method: "canning",
    inputAmount: 8,
    inputUnit: "lbs",
    outputAmount: 8,
    outputUnit: "pints",
    jarSize: "pint",
    containerCount: 8,
    supplies: [
      { item: "Pint jars", quantity: 8, unit: "jars", costPer: 1.0, reusable: true },
      { item: "Lids", quantity: 8, unit: "lids", costPer: 0.25, reusable: false },
      { item: "Rings", quantity: 8, unit: "rings", costPer: 0.15, reusable: true },
      { item: "Vinegar", quantity: 4, unit: "cups", costPer: 0.5, reusable: false },
      { item: "Sugar", quantity: 3, unit: "cups", costPer: 1, reusable: false },
      { item: "Onions", quantity: 1, unit: "lbs", costPer: 1.5, reusable: false },
    ],
    prepTimeMinutes: 50,
    processingTimeMinutes: 10,
    difficulty: "easy",
    notes: "Sweet pickle variety. Slice thin for best results.",
  },

  // ═══════════════════════════════════════════════════════
  // GREEN BEAN RECIPES
  // ═══════════════════════════════════════════════════════
  {
    id: "canned-green-beans",
    name: "Canned Green Beans",
    cropId: "green-beans",
    method: "canning",
    inputAmount: 14,
    inputUnit: "lbs",
    outputAmount: 7,
    outputUnit: "quarts",
    jarSize: "quart",
    containerCount: 7,
    supplies: [
      { item: "Quart jars", quantity: 7, unit: "jars", costPer: 1.2, reusable: true },
      { item: "Lids", quantity: 7, unit: "lids", costPer: 0.3, reusable: false },
      { item: "Rings", quantity: 7, unit: "rings", costPer: 0.2, reusable: true },
      { item: "Salt", quantity: 7, unit: "tsp", costPer: 0.05, reusable: false },
    ],
    prepTimeMinutes: 40,
    processingTimeMinutes: 90,
    difficulty: "medium",
    notes: "REQUIRES PRESSURE CANNER. Low acid food. 90 min at 10 PSI.",
  },

  {
    id: "frozen-green-beans",
    name: "Frozen Green Beans",
    cropId: "green-beans",
    method: "freezing",
    inputAmount: 3,
    inputUnit: "lbs",
    outputAmount: 2.5,
    outputUnit: "lbs",
    containerCount: 5,
    supplies: [
      { item: "Freezer bags (quart)", quantity: 5, unit: "bags", costPer: 0.15, reusable: false },
    ],
    prepTimeMinutes: 20,
    processingTimeMinutes: 3,
    difficulty: "easy",
    notes: "Blanch 3 minutes before freezing. Very simple method.",
  },

  // ═══════════════════════════════════════════════════════
  // PEPPER RECIPES
  // ═══════════════════════════════════════════════════════
  {
    id: "roasted-peppers",
    name: "Roasted Peppers (Frozen)",
    cropId: "peppers",
    method: "freezing",
    inputAmount: 5,
    inputUnit: "lbs",
    outputAmount: 3,
    outputUnit: "lbs",
    containerCount: 6,
    supplies: [
      { item: "Freezer bags (pint)", quantity: 6, unit: "bags", costPer: 0.12, reusable: false },
    ],
    prepTimeMinutes: 45,
    processingTimeMinutes: 0,
    difficulty: "medium",
    notes: "Roast, peel, freeze. Great for winter cooking.",
  },

  {
    id: "diced-peppers-frozen",
    name: "Diced Peppers (Frozen)",
    cropId: "peppers",
    method: "freezing",
    inputAmount: 3,
    inputUnit: "lbs",
    outputAmount: 2.5,
    outputUnit: "lbs",
    containerCount: 5,
    supplies: [
      { item: "Freezer bags (quart)", quantity: 5, unit: "bags", costPer: 0.15, reusable: false },
    ],
    prepTimeMinutes: 15,
    processingTimeMinutes: 0,
    difficulty: "easy",
    notes: "No blanching needed! Flash freeze on tray first.",
  },

  // ═══════════════════════════════════════════════════════
  // BASIL RECIPES
  // ═══════════════════════════════════════════════════════
  {
    id: "basil-pesto-frozen",
    name: "Basil Pesto (Frozen)",
    cropId: "basil",
    method: "freezing",
    inputAmount: 2,
    inputUnit: "lbs",
    outputAmount: 16,
    outputUnit: "servings",
    containerCount: 16,
    supplies: [
      { item: "Ice cube trays", quantity: 2, unit: "trays", costPer: 3, reusable: true },
      { item: "Olive oil", quantity: 1, unit: "cup", costPer: 5, reusable: false },
      { item: "Garlic", quantity: 0.25, unit: "lbs", costPer: 8, reusable: false },
    ],
    prepTimeMinutes: 30,
    processingTimeMinutes: 0,
    difficulty: "easy",
    notes: "Freeze in ice cube trays. Add cheese when using, not before freezing.",
  },

  {
    id: "dried-basil",
    name: "Dried Basil",
    cropId: "basil",
    method: "drying",
    inputAmount: 4,
    inputUnit: "lbs",
    outputAmount: 1,
    outputUnit: "lbs",
    containerCount: 4,
    supplies: [
      { item: "Mason jars (pint)", quantity: 4, unit: "jars", costPer: 1.0, reusable: true },
    ],
    prepTimeMinutes: 15,
    processingTimeMinutes: 480,
    difficulty: "easy",
    notes: "Air dry or use dehydrator at 95°F. Store in airtight jars.",
  },

  // ═══════════════════════════════════════════════════════
  // POTATO RECIPES
  // ═══════════════════════════════════════════════════════
  {
    id: "root-cellar-potatoes",
    name: "Root Cellar Storage",
    cropId: "potatoes",
    method: "root-cellar",
    inputAmount: 1,
    inputUnit: "lbs",
    outputAmount: 1,
    outputUnit: "lbs",
    supplies: [],
    prepTimeMinutes: 5,
    processingTimeMinutes: 0,
    difficulty: "easy",
    notes: "Cure 2 weeks at 50-60°F, then store at 35-40°F in dark. Lasts 6+ months.",
  },

  // ═══════════════════════════════════════════════════════
  // CARROT RECIPES
  // ═══════════════════════════════════════════════════════
  {
    id: "root-cellar-carrots",
    name: "Root Cellar Storage",
    cropId: "carrots",
    method: "root-cellar",
    inputAmount: 1,
    inputUnit: "lbs",
    outputAmount: 1,
    outputUnit: "lbs",
    supplies: [
      { item: "Sand or sawdust", quantity: 1, unit: "bucket", costPer: 5, reusable: true },
    ],
    prepTimeMinutes: 10,
    processingTimeMinutes: 0,
    difficulty: "easy",
    notes: "Layer in sand/sawdust. Store at 32-40°F with high humidity.",
  },

  {
    id: "frozen-carrots",
    name: "Frozen Carrots",
    cropId: "carrots",
    method: "freezing",
    inputAmount: 3,
    inputUnit: "lbs",
    outputAmount: 2.5,
    outputUnit: "lbs",
    containerCount: 5,
    supplies: [
      { item: "Freezer bags (quart)", quantity: 5, unit: "bags", costPer: 0.15, reusable: false },
    ],
    prepTimeMinutes: 25,
    processingTimeMinutes: 3,
    difficulty: "easy",
    notes: "Peel, slice, blanch 3 min. Good for soups and stews.",
  },

  // ═══════════════════════════════════════════════════════
  // WINTER SQUASH
  // ═══════════════════════════════════════════════════════
  {
    id: "squash-storage",
    name: "Winter Squash Storage",
    cropId: "winter-squash",
    method: "root-cellar",
    inputAmount: 1,
    inputUnit: "lbs",
    outputAmount: 1,
    outputUnit: "lbs",
    supplies: [],
    prepTimeMinutes: 2,
    processingTimeMinutes: 0,
    difficulty: "easy",
    notes: "Cure 2 weeks at 80-85°F, store at 50-55°F. Lasts 3-6 months depending on variety.",
  },

  {
    id: "frozen-squash-cubes",
    name: "Frozen Squash Cubes",
    cropId: "winter-squash",
    method: "freezing",
    inputAmount: 5,
    inputUnit: "lbs",
    outputAmount: 3,
    outputUnit: "lbs",
    containerCount: 6,
    supplies: [
      { item: "Freezer bags (quart)", quantity: 6, unit: "bags", costPer: 0.15, reusable: false },
    ],
    prepTimeMinutes: 45,
    processingTimeMinutes: 0,
    difficulty: "medium",
    notes: "Roast or steam, cube, freeze. Ready for soups and purees.",
  },
];

/**
 * Get all recipes for a specific crop
 */
export function getRecipesByCrop(cropId: string): PreservationRecipe[] {
  return PRESERVATION_RECIPES.filter((recipe) => recipe.cropId === cropId);
}

/**
 * Calculate total supply costs for a recipe
 */
export function calculateSupplyCosts(recipe: PreservationRecipe): {
  oneTimeCost: number;
  recurringCost: number;
  totalFirstTime: number;
} {
  let oneTime = 0;
  let recurring = 0;

  recipe.supplies.forEach((supply) => {
    const itemCost = supply.quantity * supply.costPer;
    if (supply.reusable) {
      oneTime += itemCost;
    } else {
      recurring += itemCost;
    }
  });

  return {
    oneTimeCost: oneTime,
    recurringCost: recurring,
    totalFirstTime: oneTime + recurring,
  };
}