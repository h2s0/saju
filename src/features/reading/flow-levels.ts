/** Categorical interpretation directions; never probabilities or a personal score. */
export const FLOW_LEVELS = [
  "정비할 때",
  "살펴볼 때",
  "준비할 때",
  "넓혀볼 때",
  "적극 활용할 때",
] as const;

export type FlowLevel = 1 | 2 | 3 | 4 | 5;

export type ReadingGauge = {
  level: FlowLevel | null;
  summary: string;
  reason: string;
};
