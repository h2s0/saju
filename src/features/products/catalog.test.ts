import { describe, expect, it } from "vitest";
import { PRODUCTS, PRODUCT_IDS, getProduct, isProductId } from "./catalog";
import { getSampleIdentity, isSampleId, makeSampleId } from "../reading/contracts";

describe("product catalog and sample identity", () => {
  it("offers seven independent products and only previously proposed prices", () => {
    expect(PRODUCTS.map((item) => item.id)).toEqual(PRODUCT_IDS);
    expect(new Set(PRODUCTS.map((item) => item.id)).size).toBe(7);
    for (const product of PRODUCTS) {
      expect(product.sectionIds).toHaveLength(5);
      expect(product.sectionTitles).toHaveLength(5);
      expect(new Set(product.sectionIds).size).toBe(5);
      expect(product.price).toBe(["basic", "love", "year"].includes(product.id) ? 990 : null);
      expect(getProduct(product.id)).toEqual(product);
    }
    expect(isProductId("love")).toBe(true);
    expect(isProductId("arbitrary-product")).toBe(false);
  });

  it("preserves legacy basic IDs without a storage migration", () => {
    expect(makeSampleId("basic", true)).toBe("sample-known");
    expect(makeSampleId("basic", false)).toBe("sample-unknown");
    expect(getSampleIdentity("sample-known")).toEqual({ productId: "basic", timeKnown: true });
    expect(getSampleIdentity("sample-unknown")).toEqual({ productId: "basic", timeKnown: false });
  });

  it("round trips every supported sample variant without personal data", () => {
    const ids = [];
    for (const product of PRODUCTS) {
      for (const timeKnown of [true, false]) {
        for (const partnerTimeKnown of product.id === "compatibility" ? [true, false] : [undefined]) {
          const id = makeSampleId(product.id, timeKnown, partnerTimeKnown);
          ids.push(id);
          expect(isSampleId(id)).toBe(true);
          expect(getSampleIdentity(id)).toEqual({ productId: product.id, timeKnown, ...(partnerTimeKnown === undefined ? {} : { partnerTimeKnown }) });
        }
      }
    }
    expect(new Set(ids).size).toBe(16);
  });

  it.each(["sample-basic-known", "sample-compatibility-known", "sample-love-known-unknown", "sample-love-missing", "sample-compatibility-known-unknown-extra", "sample-love-1995-06-15", {}, null])("rejects an invalid ID %j", (value) => {
    expect(isSampleId(value)).toBe(false);
  });

  it("requires both people's time availability for compatibility", () => {
    expect(() => makeSampleId("compatibility", true)).toThrow();
  });
});
