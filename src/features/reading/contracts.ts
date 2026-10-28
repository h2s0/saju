import { isProductId, type ProductId } from "../products/catalog";
import type { ReadingGauge } from "./flow-levels";

export type { ProductId } from "../products/catalog";
export type { ReadingGauge } from "./flow-levels";

export type BirthInput = {
  calendar: "solar" | "lunar";
  leapMonth: boolean;
  birthDate: string;
  time: { kind: "known"; value: string } | { kind: "unknown" };
};

export type BirthErrors = Partial<Record<"birthDate" | "time" | "calendar", string>>;
type TimeVariant = "known" | "unknown";
type SingleProductId = Exclude<ProductId, "basic" | "compatibility">;
export type SampleId =
  | "sample-known"
  | "sample-unknown"
  | `sample-${SingleProductId}-${TimeVariant}`
  | `sample-compatibility-${TimeVariant}-${TimeVariant}`;

export type SampleIdentity = {
  productId: ProductId;
  timeKnown: boolean;
  partnerTimeKnown?: boolean;
};

export function isSampleId(value: unknown): value is SampleId {
  if (value === "sample-known" || value === "sample-unknown") return true;
  if (typeof value !== "string") return false;
  const parts = value.split("-");
  if (parts[0] !== "sample" || !isProductId(parts[1]) || parts[1] === "basic") return false;
  const isTime = (part: string) => part === "known" || part === "unknown";
  return parts[1] === "compatibility"
    ? parts.length === 4 && isTime(parts[2]) && isTime(parts[3])
    : parts.length === 3 && isTime(parts[2]);
}

export function makeSampleId(
  productId: ProductId,
  timeKnown: boolean,
  partnerTimeKnown?: boolean,
): SampleId {
  if (!isProductId(productId)) throw new Error("지원하지 않는 상품이에요.");
  const time = timeKnown ? "known" : "unknown";
  if (productId === "basic") return `sample-${time}`;
  if (productId === "compatibility") {
    if (typeof partnerTimeKnown !== "boolean") throw new Error("두 사람의 시간 유무가 필요해요.");
    return `sample-compatibility-${time}-${partnerTimeKnown ? "known" : "unknown"}`;
  }
  return `sample-${productId}-${time}`;
}

export function getSampleIdentity(id: SampleId): SampleIdentity {
  if (!isSampleId(id)) throw new Error("올바른 샘플 ID가 아니에요.");
  if (id === "sample-known" || id === "sample-unknown") {
    return { productId: "basic", timeKnown: id === "sample-known" };
  }
  const parts = id.split("-");
  return {
    productId: parts[1] as ProductId,
    timeKnown: parts[2] === "known",
    ...(parts[1] === "compatibility" ? { partnerTimeKnown: parts[3] === "known" } : {}),
  };
}

export const SECTION_IDS = [
  "temperament",
  "relationships",
  "work",
  "money",
  "practice",
] as const;

export type ReadingSectionId = (typeof SECTION_IDS)[number];

export type Pillar = { stem: string; branch: string };

export type CalculationResult = {
  isSample: true;
  version: string;
  timeKnown: boolean;
  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar | null;
  };
  uncertainties: string[];
};

export type InterpretationEvidence = {
  id: string;
  allowedInterpretation: string;
  condition: string;
  exception: string;
  source: "development-fixture";
  version: string;
  requiresBirthTime: boolean;
  requiresPartnerBirthTime?: boolean;
};

export type ReadingSection = {
  id: string;
  title: string;
  paragraphs: string[];
  evidenceIds: string[];
};

export type ReadingResult = {
  id: SampleId;
  isSample: true;
  productId: ProductId;
  gauge: ReadingGauge;
  limitations: string[];
  periodLabel?: string;
  partnerCalculation?: CalculationResult;
  calculation: CalculationResult;
  freeParagraphs: string[];
  advice: string;
  sections: ReadingSection[];
  evidence: InterpretationEvidence[];
  generationVersion: string;
};
