"use client";

import { useMemo, useSyncExternalStore } from "react";
import { getSampleIdentity, isSampleId, type ProductId, type SampleId } from "../reading/contracts";

export const DEMO_SESSION_KEY = "cheonmyeongrok-demo-v1";

export type DemoSessionData = {
  visited: SampleId[];
  purchased: SampleId[];
};

export function purchasedSampleForProduct(purchased: readonly SampleId[], productId: ProductId): SampleId | undefined {
  return purchased.find((id) => getSampleIdentity(id).productId === productId);
}

type DemoSessionSnapshot = DemoSessionData & {
  ready: boolean;
  storageAvailable: boolean;
};

function emptySession(): DemoSessionData {
  return { visited: [], purchased: [] };
}

function sanitizeSession(value: unknown): DemoSessionData {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return emptySession();
  }
  const record = value as Record<string, unknown>;
  const visited = Array.isArray(record.visited)
    ? [...new Set(record.visited.filter(isSampleId))]
    : [];
  const purchased = Array.isArray(record.purchased)
    ? [...new Set(record.purchased.filter(isSampleId))].filter((id) => visited.includes(id))
    : [];
  return { visited, purchased };
}

/** Stored values are untrusted and can never grant a real purchase entitlement. */
export function parseDemoSession(raw: string | null): DemoSessionData {
  if (raw === null) return emptySession();
  try {
    return sanitizeSession(JSON.parse(raw));
  } catch {
    return emptySession();
  }
}

export function serializeDemoSession(session: DemoSessionData): string {
  // Project only IDs and mock status even if callers pass an object with extra fields.
  return JSON.stringify(sanitizeSession(session));
}

const serverSnapshot = JSON.stringify({
  ready: false,
  storageAvailable: true,
  ...emptySession(),
} satisfies DemoSessionSnapshot);

let current: DemoSessionSnapshot | undefined;
let snapshot = serverSnapshot;
const listeners = new Set<() => void>();

function update(data: DemoSessionData, storageAvailable: boolean): void {
  const next = { ready: true, storageAvailable, ...sanitizeSession(data) };
  const serialized = JSON.stringify(next);
  if (serialized === snapshot) return;
  current = next;
  snapshot = serialized;
  listeners.forEach((listener) => listener());
}

function initialize(): void {
  if (current || typeof window === "undefined") return;
  try {
    const data = parseDemoSession(window.sessionStorage.getItem(DEMO_SESSION_KEY));
    current = { ready: true, storageAvailable: true, ...data };
  } catch {
    current = { ready: true, storageAvailable: false, ...emptySession() };
  }
  snapshot = JSON.stringify(current);
}

function getSnapshot(): string {
  initialize();
  return snapshot;
}

function getServerSnapshot(): string {
  return serverSnapshot;
}

function refreshFromStorage(event: StorageEvent): void {
  if (event.key !== null && event.key !== DEMO_SESSION_KEY) return;
  try {
    // Session storage events concern other documents in the same browser tab.
    if (event.storageArea && event.storageArea !== window.sessionStorage) return;
    update(parseDemoSession(window.sessionStorage.getItem(DEMO_SESSION_KEY)), true);
  } catch {
    update(current ?? emptySession(), false);
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (typeof window !== "undefined") window.addEventListener("storage", refreshFromStorage);
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined" && listeners.size === 0) {
      window.removeEventListener("storage", refreshFromStorage);
    }
  };
}

export function useDemoSession(): DemoSessionSnapshot {
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => JSON.parse(value) as DemoSessionSnapshot, [value]);
}

function persist(data: DemoSessionData): void {
  let storageAvailable = true;
  try {
    window.sessionStorage.setItem(DEMO_SESSION_KEY, serializeDemoSession(data));
  } catch {
    storageAvailable = false;
  }
  // A disabled browser store must not stop the in-memory prototype journey.
  update(data, storageAvailable);
}

/** True means the action was accepted, including in-memory fallback. */
export function rememberSample(id: SampleId): boolean {
  if (typeof window === "undefined" || !isSampleId(id)) return false;
  initialize();
  const data = current ?? emptySession();
  persist({ visited: [...data.visited, id], purchased: data.purchased });
  return true;
}

export function purchaseSample(id: SampleId): boolean {
  if (typeof window === "undefined" || !isSampleId(id)) return false;
  initialize();
  const data = current ?? emptySession();
  if (!data.visited.includes(id)) return false;
  const existing = purchasedSampleForProduct(data.purchased, getSampleIdentity(id).productId);
  if (existing) return existing === id;
  persist({ visited: data.visited, purchased: [...data.purchased, id] });
  return true;
}

export function resetDemo(): boolean {
  if (typeof window === "undefined") return false;
  let storageAvailable = true;
  try {
    window.sessionStorage.removeItem(DEMO_SESSION_KEY);
  } catch {
    storageAvailable = false;
  }
  update(emptySession(), storageAvailable);
  return true;
}
