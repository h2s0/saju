import { describe, expect, it } from "vitest";
import { buildReadingPrompt, validateGeneratedSections } from "./reading-prompt";
import { generateSampleReading } from "./sample-engine";

function fixture() {
  const reading = generateSampleReading("sample-known");
  return { reading, output: { sections: reading.sections } };
}

describe("reading prompt boundary", () => {
  it("projects only calculation and evidence data, never arbitrary raw personal fields", () => {
    const { reading } = fixture();
    const calculation = { ...reading.calculation, birthDate: "1995-06-15", name: "비밀이름", email: "private@example.com" };
    const evidence = reading.evidence.map((item) => ({ ...item, paymentId: "private-order" }));
    const prompt = buildReadingPrompt(calculation, evidence);
    const text = JSON.stringify(prompt);
    for (const secret of ["1995-06-15", "비밀이름", "private@example.com", "private-order"]) {
      expect(text).not.toContain(secret);
    }
    expect(prompt.system).toContain("재계산");
    expect(prompt.system).toContain("개발용 예시");
  });

  it("excludes time-dependent evidence and hour data when time is unknown", () => {
    const reading = generateSampleReading("sample-unknown");
    const evidence = [...reading.evidence, { ...reading.evidence[0], id: "hour-only", requiresBirthTime: true }];
    const prompt = buildReadingPrompt(reading.calculation, evidence);
    expect(prompt.user).not.toContain("hour-only");
    expect(JSON.parse(prompt.user).calculation.pillars.hour).toBeNull();
  });
});

describe("generated sections validation", () => {
  it("accepts a complete five-section fixture and returns an independent copy", () => {
    const { reading, output } = fixture();
    const result = validateGeneratedSections(output, reading.calculation, reading.evidence);
    expect(result.valid).toBe(true);
    if (result.valid) {
      result.sections[0].title = "modified";
      expect(output.sections[0].title).not.toBe("modified");
    }
  });

  it.each([null, "text", {}, { sections: "text" }, { sections: [] }])("rejects invalid structure %j", (output) => {
    const { reading } = fixture();
    expect(validateGeneratedSections(output, reading.calculation, reading.evidence).valid).toBe(false);
  });

  it("rejects missing, extra, duplicate and unknown sections", () => {
    const { reading, output } = fixture();
    for (const sections of [
      output.sections.slice(1),
      [...output.sections, output.sections[0]],
      [output.sections[0], output.sections[0], ...output.sections.slice(2)],
      [{ ...output.sections[0], id: "year" }, ...output.sections.slice(1)],
    ]) {
      expect(validateGeneratedSections({ sections }, reading.calculation, reading.evidence).valid).toBe(false);
    }
  });

  it.each([
    { title: " " },
    { paragraphs: [] },
    { paragraphs: ["a"] },
    { paragraphs: ["a", " "] },
    { paragraphs: ["a", 3] },
    { evidenceIds: [] },
    { evidenceIds: ["unknown-evidence"] },
    { evidenceIds: [3] },
    { score: 100 },
  ])("rejects invalid section fields %j", (patch) => {
    const { reading, output } = fixture();
    const sections = [{ ...output.sections[0], ...patch }, ...output.sections.slice(1)];
    expect(validateGeneratedSections({ sections }, reading.calculation, reading.evidence).valid).toBe(false);
  });

  it("rejects extra top-level content outside the contract", () => {
    const { reading, output } = fixture();
    expect(validateGeneratedSections({ ...output, prediction: "extra" }, reading.calculation, reading.evidence).valid).toBe(false);
  });

  it("rejects a known evidence ID when it requires an unknown birth time", () => {
    const reading = generateSampleReading("sample-unknown");
    const evidence = reading.evidence.map((item, index) => ({ ...item, requiresBirthTime: index === 0 }));
    expect(validateGeneratedSections({ sections: reading.sections }, reading.calculation, evidence).valid).toBe(false);
  });
});
