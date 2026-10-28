import { describe, expect, it } from "vitest";
import { PRODUCTS } from "../products/catalog";
import { makeSampleId } from "./contracts";
import { FLOW_LEVELS } from "./flow-levels";
import { generateSampleReading, generateSampleDetails } from "./sample-engine";
import { buildReadingPrompt, validateGeneratedSections } from "./reading-prompt";

describe("product-specific reading fixtures", () => {
  it.each(PRODUCTS)("provides distinct, traceable chapters for $id", (product) => {
    const reading = generateSampleReading(makeSampleId(product.id, true, product.id === "compatibility" ? true : undefined));
    expect(reading.productId).toBe(product.id);
    expect(reading.sections.map((item) => item.id)).toEqual(product.sectionIds);
    expect(reading.sections.map((item) => item.title)).toEqual(product.sectionTitles);
    expect(reading.sections.every((item) => item.paragraphs.length === 2)).toBe(true);
    expect(reading.freeParagraphs).toHaveLength(2);
    expect(reading.isSample).toBe(true);
    expect(reading.evidence.every((item) => item.source === "development-fixture")).toBe(true);
    expect(reading.gauge.level).not.toBeNull();
    expect(FLOW_LEVELS[reading.gauge.level! - 1]).toBeTruthy();
    expect(reading.gauge.reason).toContain("샘플");
    expect(validateGeneratedSections({ sections: reading.sections }, reading.calculation, reading.evidence, product.id).valid).toBe(true);
    const prompt = buildReadingPrompt(reading.calculation, reading.evidence, product.id, reading.partnerCalculation);
    expect(JSON.parse(prompt.user).requiredSections).toEqual(product.sectionIds);
    expect(prompt.system).toContain(product.title);
    expect(prompt.system).toContain("게이지의 단계나 점수는 생성하지 마세요");
    expect(() => generateSampleDetails(reading.calculation, reading.evidence.slice(1), product.id)).toThrow();
  });

  it("does not copy paragraphs or evidence IDs across products", () => {
    const readings = PRODUCTS.map((product) => generateSampleReading(makeSampleId(product.id, true, product.id === "compatibility" ? true : undefined)));
    const paragraphs = readings.flatMap((reading) => reading.sections.flatMap((section) => section.paragraphs));
    const previews = readings.flatMap((reading) => reading.freeParagraphs);
    const evidenceIds = readings.flatMap((reading) => reading.evidence.map((item) => item.id));
    expect(new Set(paragraphs).size).toBe(paragraphs.length);
    expect(new Set(previews).size).toBe(previews.length);
    expect(new Set(evidenceIds).size).toBe(evidenceIds.length);
  });

  it("distinguishes each person's unknown birth time without substitution", () => {
    for (const timeKnown of [true, false]) {
      for (const partnerTimeKnown of [true, false]) {
        const reading = generateSampleReading(makeSampleId("compatibility", timeKnown, partnerTimeKnown));
        expect(reading.calculation.timeKnown).toBe(timeKnown);
        expect(reading.calculation.pillars.hour !== null).toBe(timeKnown);
        expect(reading.partnerCalculation?.timeKnown).toBe(partnerTimeKnown);
        expect(reading.partnerCalculation?.pillars.hour !== null).toBe(partnerTimeKnown);
        expect(reading.gauge).toEqual(generateSampleReading("sample-compatibility-known-known").gauge);
      }
    }
  });

  it("labels temporal fixtures without invented individual ages or cycles", () => {
    const year = generateSampleReading("sample-year-known");
    const decade = generateSampleReading("sample-decade-unknown");
    expect(year.periodLabel).toContain("2026년 예시");
    expect(decade.periodLabel).toContain("가상 구간 A·B·C");
    expect(decade.calculation.pillars.hour).toBeNull();
    for (const reading of [year, decade]) {
      expect(buildReadingPrompt(reading.calculation, reading.evidence, reading.productId).system).toContain("실제 나이·연도");
      expect(JSON.stringify(reading)).not.toMatch(/\d+세|\d+살/);
    }
  });

  it("does not accept another product's section IDs or evidence", () => {
    const love = generateSampleReading("sample-love-known");
    const career = generateSampleReading("sample-career-known");
    expect(validateGeneratedSections({ sections: love.sections }, love.calculation, love.evidence, "career").valid).toBe(false);
    expect(validateGeneratedSections({ sections: career.sections }, career.calculation, love.evidence, "career").valid).toBe(false);
  });

  it("returns isolated fixture copies including gauge and limitations", () => {
    const first = generateSampleReading("sample-love-known");
    first.gauge.level = null;
    first.limitations.push("modified");
    first.sections[0].paragraphs[0] = "modified";
    const next = generateSampleReading("sample-love-known");
    expect(next.gauge.level).toBe(4);
    expect(JSON.stringify(next)).not.toContain("modified");
  });

  it("projects partner data and excludes rules requiring missing partner time", () => {
    const reading = generateSampleReading("sample-compatibility-known-unknown");
    const evidence = [...reading.evidence, { ...reading.evidence[0], id: "partner-hour-only", requiresPartnerBirthTime: true }];
    const partner = { ...reading.partnerCalculation!, birthDate: "1990-02-03", name: "private-partner" };
    const prompt = buildReadingPrompt(reading.calculation, evidence, "compatibility", partner);
    expect(prompt.user).not.toContain("1990-02-03");
    expect(prompt.user).not.toContain("private-partner");
    expect(prompt.user).not.toContain("partner-hour-only");
    expect(JSON.parse(prompt.user).partnerCalculation.pillars.hour).toBeNull();
    const output = { sections: reading.sections.map((section, index) => index === 0 ? { ...section, evidenceIds: ["partner-hour-only"] } : section) };
    expect(validateGeneratedSections(output, reading.calculation, evidence, "compatibility", partner).valid).toBe(false);
    expect(validateGeneratedSections(output, reading.calculation, evidence, "compatibility").valid).toBe(false);
  });
});
