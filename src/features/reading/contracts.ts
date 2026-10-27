export type BirthInput = {
  calendar: "solar" | "lunar";
  leapMonth: boolean;
  birthDate: string;
  time: { kind: "known"; value: string } | { kind: "unknown" };
};

export type BirthErrors = Partial<Record<"birthDate" | "time" | "calendar", string>>;
export type SampleId = "sample-known" | "sample-unknown";

export function isSampleId(value: unknown): value is SampleId {
  return value === "sample-known" || value === "sample-unknown";
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
};

export type ReadingSection = {
  id: ReadingSectionId;
  title: string;
  paragraphs: string[];
  evidenceIds: string[];
};

export type ReadingResult = {
  id: SampleId;
  isSample: true;
  calculation: CalculationResult;
  freeParagraphs: string[];
  advice: string;
  sections: ReadingSection[];
  evidence: InterpretationEvidence[];
  generationVersion: string;
};
