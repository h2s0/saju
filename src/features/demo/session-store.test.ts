import { afterEach, describe, expect, it, vi } from "vitest";
import { parseDemoSession, serializeDemoSession } from "./session-store";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("session serialization", () => {
  it.each([null, "", "broken json", "null", "[]", "1", '"text"'])
    ("falls back safely for %j", (value) => {
      expect(parseDemoSession(value)).toEqual({ visited: [], purchased: [] });
    });

  it("filters unknown IDs, removes duplicates, and requires visits before purchases", () => {
    expect(parseDemoSession(JSON.stringify({
      visited: ["sample-known", "sample-known", "personal-id", null],
      purchased: ["sample-known", "sample-unknown", "sample-known", "personal-id"],
    }))).toEqual({ visited: ["sample-known"], purchased: ["sample-known"] });
  });

  it("does not serialize personal input or arbitrary runtime fields", () => {
    const input = {
      visited: ["sample-known" as const],
      purchased: [],
      birthDate: "1992-04-10",
      birthTime: "04:30",
      name: "개인정보",
    };
    expect(serializeDemoSession(input)).toBe('{"visited":["sample-known"],"purchased":[]}');
  });

  it("handles missing or non-array fields", () => {
    expect(parseDemoSession('{"visited":{},"purchased":"sample-known"}'))
      .toEqual({ visited: [], purchased: [] });
  });
});

async function browserStore(initial?: string) {
  const values = new Map<string, string>();
  if (initial) values.set("cheonmyeongrok-demo-v1", initial);
  const storage = {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => { values.set(key, value); }),
    removeItem: vi.fn((key: string) => { values.delete(key); }),
  };
  vi.stubGlobal("window", { sessionStorage: storage });
  vi.resetModules();
  return { storage, values, store: await import("./session-store") };
}

describe("mock session actions", () => {
  it("requires a visited sample and deduplicates repeat purchases", async () => {
    const { store, values } = await browserStore();
    expect(store.purchaseSample("sample-known")).toBe(false);
    expect(store.rememberSample("sample-known")).toBe(true);
    expect(store.purchaseSample("sample-known")).toBe(true);
    expect(store.purchaseSample("sample-known")).toBe(true);
    expect(JSON.parse(values.get(store.DEMO_SESSION_KEY)!)).toEqual({
      visited: ["sample-known"], purchased: ["sample-known"],
    });
  });

  it("restores a previously visited sample after a module reload", async () => {
    const { store, values } = await browserStore('{"visited":["sample-unknown"],"purchased":[]}');
    expect(store.purchaseSample("sample-unknown")).toBe(true);
    expect(parseDemoSession(values.get(store.DEMO_SESSION_KEY)!)).toEqual({
      visited: ["sample-unknown"], purchased: ["sample-unknown"],
    });
  });

  it("recovers from corrupted storage on the next accepted action", async () => {
    const { store, values } = await browserStore("corrupted");
    expect(store.rememberSample("sample-known")).toBe(true);
    expect(parseDemoSession(values.get(store.DEMO_SESSION_KEY)!)).toEqual({
      visited: ["sample-known"], purchased: [],
    });
  });

  it("keeps actions working in memory when storage throws", async () => {
    const { store, storage } = await browserStore();
    storage.getItem.mockImplementation(() => { throw new Error("blocked"); });
    storage.setItem.mockImplementation(() => { throw new Error("quota"); });
    storage.removeItem.mockImplementation(() => { throw new Error("blocked"); });
    expect(store.rememberSample("sample-known")).toBe(true);
    expect(store.purchaseSample("sample-known")).toBe(true);
    expect(store.resetDemo()).toBe(true);
    expect(store.purchaseSample("sample-known")).toBe(false);
  });

  it("clears only the prototype key", async () => {
    const { store, storage, values } = await browserStore();
    values.set("another-app", "preserve me");
    store.rememberSample("sample-known");
    store.purchaseSample("sample-known");
    expect(store.resetDemo()).toBe(true);
    expect(storage.removeItem).toHaveBeenCalledWith(store.DEMO_SESSION_KEY);
    expect(values.has(store.DEMO_SESSION_KEY)).toBe(false);
    expect(values.get("another-app")).toBe("preserve me");
  });

  it("does not mutate storage for a forged sample identifier", async () => {
    const { store, storage } = await browserStore();
    expect(store.rememberSample("forged" as "sample-known")).toBe(false);
    expect(store.purchaseSample("forged" as "sample-known")).toBe(false);
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it("does not create a server-side global session", async () => {
    vi.resetModules();
    const store = await import("./session-store");
    expect(store.rememberSample("sample-known")).toBe(false);
    expect(store.purchaseSample("sample-known")).toBe(false);
    expect(store.resetDemo()).toBe(false);
  });
});
