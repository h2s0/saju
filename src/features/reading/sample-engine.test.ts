import { describe, expect, it } from "vitest";
import { calculateSample, generateSampleReading, generateSampleDetails } from "./sample-engine";
import { isSampleId, SECTION_IDS, type BirthInput } from "./contracts";

const input: BirthInput = {
  birthDate: "1995-06-15",
  calendar: "solar",
  leapMonth: false,
  time: { kind: "known", value: "10:20" },
};

describe("sample calculation and reading", () => {
  it("never derives a personal calculation from a date or time", () => {
    const first = calculateSample(input);
    const second = calculateSample({ ...input, birthDate: "1980-01-01", time: { kind: "known", value: "23:59" } });
    expect(first).toEqual(second);
    expect(first.isSample).toBe(true);
    expect(JSON.stringify(first)).not.toContain(input.birthDate);
  });

  it("omits the hour pillar and marks uncertainty for unknown time", () => {
    const calculation = calculateSample({ ...input, time: { kind: "unknown" } });
    expect(calculation.timeKnown).toBe(false);
    expect(calculation.pillars.hour).toBeNull();
    expect(calculation.uncertainties.join(" ")).toContain("시주");
    expect(generateSampleReading("sample-unknown").calculation).toEqual(calculation);
  });

  it("rejects invalid input before producing a fixture", () => {
    expect(() => calculateSample({ ...input, birthDate: "invalid" })).toThrow();
  });

  it("provides five separate sections with fixture-only evidence and two free paragraphs", () => {
    const reading = generateSampleReading("sample-known");
    expect(reading.sections.map((section) => section.id)).toEqual(SECTION_IDS);
    expect(reading.freeParagraphs).toHaveLength(2);
    expect(reading.evidence.every((item) => item.source === "development-fixture")).toBe(true);
    expect(reading.sections.every((section) => section.evidenceIds.every((id) => reading.evidence.some((item) => item.id === id)))).toBe(true);
    expect(reading.sections.every((section) => section.paragraphs.length === 2)).toBe(true);
  });

  it("returns independent copies for every request", () => {
    const reading = generateSampleReading("sample-known");
    reading.sections[0].paragraphs[0] = "modified";
    reading.evidence[0].allowedInterpretation = "modified";
    reading.calculation.pillars.year.stem = "modified";
    const next = generateSampleReading("sample-known");
    expect(JSON.stringify(next)).not.toContain("modified");
  });

  it("only accepts known sample identifiers", () => {
    expect(isSampleId("sample-known")).toBe(true);
    expect(isSampleId("sample-unknown")).toBe(true);
    expect(isSampleId("user-1995-06-15")).toBe(false);
    expect(isSampleId(null)).toBe(false);
  });
});


describe("detail generator evidence boundary", () => {
  it("rejects missing evidence rather than inventing a justification", () => {
    const reading = generateSampleReading("sample-known");
    expect(() => generateSampleDetails(reading.calculation, reading.evidence.slice(1))).toThrow();
  });

  it("rejects time-dependent evidence when time is unknown", () => {
    const reading = generateSampleReading("sample-unknown");
    reading.evidence[0].requiresBirthTime = true;
    expect(() => generateSampleDetails(reading.calculation, reading.evidence)).toThrow();
  });
});
