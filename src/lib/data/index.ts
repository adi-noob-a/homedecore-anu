// ─── Data Module Loader ───
// Reads from the Part 1 JSON modules and provides typed accessors.

import calculatorData from "../../../phase-1-deliverables/data/calculator.json";
import finishesData from "../../../phase-1-deliverables/data/finishes.json";
import comparisonsData from "../../../phase-1-deliverables/data/comparisons.json";
import materialsData from "../../../phase-1-deliverables/data/materials.json";
import hardwareData from "../../../phase-1-deliverables/data/hardware.json";
import budgetData from "../../../phase-1-deliverables/data/budget.json";
import vendorData from "../../../phase-1-deliverables/data/vendor.json";
import countertopsData from "../../../phase-1-deliverables/data/countertops.json";

import type {
  PropertyType,
  FinishId,
  WardrobeType,
  HardwareTier,
  CountertopType,
  ComparisonData,
  FinishTier,
  ArchetypeDefinition,
  StepData,
  CalculatorResult,
  CostBreakdown,
  RedFlagTrigger,
  BudgetRange,
} from "../types";

// ─── Calculator Constants ───

export const CITY_TIER_MULTIPLIERS: Record<string, number> = {
  tier1: 1.0,
  tier2: 0.85,
  tier3: 0.7,
};

export const FINISH_MULTIPLIERS: Record<string, number> = {};
finishesData.sections.costHierarchy.order.forEach((tier: any) => {
  FINISH_MULTIPLIERS[tier.id] = tier.costTier * 0.3;
});

export const WARDROBE_MULTIPLIERS: Record<string, number> = {
  swing: 1.0,
  sliding: 1.3,
  "full-height": 1.8,
};

export const HARDWARE_MULTIPLIERS: Record<string, number> = {
  indian: 1.0,
  german: 1.5,
};

export const COUNTERTOP_MULTIPLIERS: Record<string, number> = {
  granite: 1.0,
  quartz: 2.0,
};

export const BASE_SPACE_COST: Record<string, number> = {
  kitchen: 180000,
  bedroom: 95000,
  "living-room": 85000,
  "crockery-unit": 55000,
  "pooja-unit": 35000,
  utility: 40000,
  "shoe-unit": 25000,
  foyer: 70000,
  "study-room": 60000,
  "family-room": 65000,
  gazebo: 80000,
};

// ─── Archetypes ───

export function getArchetype(type: PropertyType): ArchetypeDefinition | undefined {
  return (calculatorData as any).propertyArchetypes?.find(
    (a: any) => a.type === type
  );
}

export function getArchetypes(): ArchetypeDefinition[] {
  return (calculatorData as any).propertyArchetypes ?? [];
}

export function getBudgetRange(propertyValue: number, type: PropertyType): BudgetRange {
  const archetype = getArchetype(type);
  if (!archetype) return { min: 0, max: 0 };
  return {
    min: propertyValue * (archetype.budgetPercentage.min / 100),
    max: propertyValue * (archetype.budgetPercentage.max / 100),
  };
}

// ─── Finish Cost Ladder ───

export function getFinishTiers(): FinishTier[] {
  return (finishesData as any).sections.costHierarchy.order ?? [];
}

export function getFinishMultiplier(finishId: FinishId): number {
  return FINISH_MULTIPLIERS[finishId] ?? 1.0;
}

// ─── Comparisons ───

export function getComparisons(): ComparisonData[] {
  return (comparisonsData as any).comparisons ?? [];
}

export function getComparisonById(id: string): ComparisonData | undefined {
  return getComparisons().find((c) => c.id === id);
}

// ─── Calculator Engine ───

export function calculateCost(state: StepData): CalculatorResult {
  const {
    propertyValue,
    propertyType,
    cityTier,
    rooms,
    kitchenFinish,
    wardrobeType,
    wardrobeFinish,
    countertop,
    hardwareTier,
    includeTallUnit,
    includeWickerBaskets,
  } = state;

  const cityMultiplier = CITY_TIER_MULTIPLIERS[cityTier] ?? 1.0;
  const finishMult = getFinishMultiplier(kitchenFinish);
  const hardwareMult = HARDWARE_MULTIPLIERS[hardwareTier];
  const wardrobeMult = WARDROBE_MULTIPLIERS[wardrobeType];
  const wardrobeFinishMult = getFinishMultiplier(wardrobeFinish);
  const countertopMult = COUNTERTOP_MULTIPLIERS[countertop];

  let totalCost = 0;
  const breakdown: CostBreakdown[] = [];

  // Kitchen
  let kitchenCost = BASE_SPACE_COST.kitchen * finishMult * hardwareMult * cityMultiplier;
  if (includeTallUnit) kitchenCost += 45000 * finishMult;
  if (includeWickerBaskets) kitchenCost += 12000;
  kitchenCost += BASE_SPACE_COST.kitchen * 0.15 * countertopMult; // countertop portion
  totalCost += kitchenCost;

  // Wardrobes (per bedroom)
  const bedroomRooms = rooms.filter((r) => r.id.startsWith("bedroom") && r.selected);
  let wardrobeCost = 0;
  bedroomRooms.forEach((room) => {
    const base = BASE_SPACE_COST.bedroom * wardrobeMult * wardrobeFinishMult * hardwareMult * cityMultiplier;
    wardrobeCost += base * room.quantity;
  });
  totalCost += wardrobeCost;

  // Living room
  const livingRoom = rooms.find((r) => r.id === "living-room");
  if (livingRoom?.selected) {
    const lrCost = BASE_SPACE_COST["living-room"] * cityMultiplier;
    totalCost += lrCost;
    breakdown.push({ category: "Living & Dining", percent: 0, amount: lrCost, color: "#6366f1" });
  }

  // Other rooms
  const otherRoomIds = ["crockery-unit", "pooja-unit", "utility", "shoe-unit", "foyer", "study-room", "family-room", "gazebo"];
  for (const rid of otherRoomIds) {
    const room = rooms.find((r) => r.id === rid);
    if (room?.selected) {
      const cost = (BASE_SPACE_COST[rid] ?? 30000) * cityMultiplier;
      totalCost += cost;
    }
  }

  // Build breakdown
  const budgetRange = getBudgetRange(propertyValue, propertyType);
  breakdown.push({ category: "Kitchen", percent: Math.round((kitchenCost / totalCost) * 100), amount: kitchenCost, color: "#10b981" });
  breakdown.push({ category: "Wardrobes", percent: Math.round((wardrobeCost / totalCost) * 100), amount: wardrobeCost, color: "#6366f1" });

  // Red flags
  const redFlags: RedFlagTrigger[] = [];
  if (wardrobeType === "sliding" && hardwareTier === "indian") {
    redFlags.push({
      id: "sliding-with-indian-hw",
      severity: "warning",
      message: "Sliding wardrobes with Indian hardware risk wobbling over time. German hardware strongly recommended for sliding systems.",
    });
  }
  if (countertop === "quartz" && propertyType === "rental") {
    redFlags.push({
      id: "quartz-rental",
      severity: "info",
      message: "Quartz at nearly 2x granite cost may not be optimal for rental/ investment projects.",
    });
  }
  if (totalCost > budgetRange.max) {
    redFlags.push({
      id: "over-budget",
      severity: "critical",
      message: `Estimated cost (₹${(totalCost / 100000).toFixed(1)}L) exceeds your recommended budget range (₹${(budgetRange.min / 100000).toFixed(1)}L – ₹${(budgetRange.max / 100000).toFixed(1)}L).`,
    });
  }

  return {
    totalCost,
    budgetRange,
    breakdown,
    redFlags,
    selections: {
      propertyType,
      kitchenFinish,
      wardrobeType,
      hardwareTier,
      countertop,
      roomCount: rooms.filter((r) => r.selected).length,
    },
  };
}

// ─── Room Presets ───

export function getDefaultRooms(type: PropertyType) {
  const archetype = getArchetype(type);
  if (!archetype) return [];

  const archetypeData = (calculatorData as any).propertyArchetypes?.find((a: any) => a.type === type);
  return (archetypeData?.defaultRooms ?? []).map((r: any) => ({
    id: r.room.toLowerCase().replace(/\s+/g, "-"),
    label: r.room,
    selected: r.required !== false,
    quantity: r.quantity ?? 1,
    finish: r.finishDefault ?? "laminate",
    wardrobeType: r.wardrobeType ?? "swing",
  }));
}
