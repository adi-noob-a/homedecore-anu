// ─── Calculator State Types ───

export type PropertyType = "rental" | "personal" | "villa";
export type CityTier = "tier1" | "tier2" | "tier3";
export type RoomId = string;
export type FinishId = "laminate" | "acrylic" | "duco" | "rattan" | "lacquered-glass" | "pu";
export type WardrobeType = "swing" | "sliding" | "full-height";
export type HardwareTier = "indian" | "german";
export type CountertopType = "granite" | "quartz";

export interface RoomConfig {
  id: RoomId;
  label: string;
  selected: boolean;
  quantity: number;
  finish: FinishId;
  wardrobeType?: WardrobeType;
}

export interface StepData {
  propertyValue: number;
  propertyType: PropertyType;
  cityTier: CityTier;
  rooms: RoomConfig[];
  kitchenFinish: FinishId;
  wardrobeType: WardrobeType;
  wardrobeFinish: FinishId;
  countertop: CountertopType;
  hardwareTier: HardwareTier;
  includeTallUnit: boolean;
  includeWickerBaskets: boolean;
}

export interface CostBreakdown {
  category: string;
  percent: number;
  amount: number;
  color: string;
}

export interface CalculatorResult {
  totalCost: number;
  budgetRange: BudgetRange;
  breakdown: CostBreakdown[];
  redFlags: RedFlagTrigger[];
  selections: SelectionSummary;
}

export interface BudgetRange {
  min: number;
  max: number;
}

export interface RedFlagTrigger {
  id: string;
  severity: "critical" | "warning" | "info";
  message: string;
}

export interface SelectionSummary {
  propertyType: PropertyType;
  kitchenFinish: FinishId;
  wardrobeType: WardrobeType;
  hardwareTier: HardwareTier;
  countertop: CountertopType;
  roomCount: number;
}

// ─── Data Module Types ───

export interface MediaBlock {
  card_image?: string | null;
  card_video?: string | null;
  icon?: string | null;
  diagram?: string | null;
  left_image?: string | null;
  right_image?: string | null;
  winner_badge_image?: string | null;
}

export interface AnimationBlock {
  enter: { type: string; delay: number; duration: number; trigger: string };
  hover?: { effect: string; target: string; feedback: string };
  scroll?: { parallax: boolean; progressBar: boolean; reveal: string };
  microInteraction?: { type: string; repeatable: boolean };
}

export interface ComparisonDimension {
  label: string;
  leftValue: string;
  rightValue: string;
  leftIsWinner: boolean;
  rightIsWinner: boolean;
  isDraw?: boolean;
  contextDependent?: boolean;
  leftWinsWhen?: string;
  rightWinsWhen?: string;
  rightCondition?: string;
  rightCaution?: string;
  leftRiskLevel?: string;
  rightRiskLevel?: string;
  note?: string;
  media?: MediaBlock;
}

export interface ComparisonData {
  id: string;
  title: string;
  slug: string;
  source: string;
  contextQuestion: string;
  dimensions: ComparisonDimension[];
  verdicts: Record<string, { winner: string; message: string; condition?: string }>;
  takeaway: string;
  media?: MediaBlock;
  animation?: AnimationBlock;
}

// ─── Finish Cost Ladder ───

export interface FinishTier {
  rank: number;
  finish: string;
  id: string;
  costTier: number;
  parityWith?: string[];
  media?: MediaBlock;
}

// ─── Budget Archetype ───

export interface ArchetypeDefinition {
  type: PropertyType;
  label: string;
  budgetPercentage: { min: number; max: number };
  formula: string;
  description: string;
  finishDefaults: {
    kitchen: FinishId;
    wardrobe: FinishId;
    countertop: CountertopType;
  };
  hardwareDefault: HardwareTier;
  media?: MediaBlock;
  animation?: AnimationBlock;
}
