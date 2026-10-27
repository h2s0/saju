import { describe, expect, it } from "vitest";
import { validateBirthInput } from "./birth-validation";
import type { BirthInput } from "./contracts";

const validInput: BirthInput = {
  calendar: "solar",
  leapMonth: false,
  birthDate: "2000-02-29",
  time: { kind: "known", value: "09:30" },
};
const today = "2026-10-27";

describe("birth input validation", () => {
  it("accepts a real leap day and valid time", () => {
    expect(validateBirthInput(validInput, today)).toEqual({});
  });

  it.each(["", "2000-2-29", "2023-02-29", "2000-04-31", "2000-00-01", "2000-13-01", "0000-01-01"])(
    "rejects invalid solar date %s",
    (birthDate) => {
      expect(validateBirthInput({ ...validInput, birthDate }, today).birthDate).toBeTruthy();
    },
  );

  it("rejects future solar birth dates but accepts today", () => {
    expect(validateBirthInput({ ...validInput, birthDate: "2026-10-28" }, today).birthDate).toBeTruthy();
    expect(validateBirthInput({ ...validInput, birthDate: today }, today)).toEqual({});
  });

  it("only checks lunar shape/range, not calendar existence or leap-month validity", () => {
    expect(validateBirthInput({ ...validInput, calendar: "lunar", leapMonth: true, birthDate: "2001-02-30" }, today)).toEqual({});
    expect(validateBirthInput({ ...validInput, calendar: "lunar", birthDate: "2001-02-31" }, today).birthDate).toBeTruthy();
  });

  it("rejects leap-month solar inputs and invalid calendar identifiers", () => {
    expect(validateBirthInput({ ...validInput, leapMonth: true }, today).calendar).toBeTruthy();
    expect(validateBirthInput({ ...validInput, calendar: "other" } as unknown as BirthInput, today).calendar).toBeTruthy();
  });

  it.each(["", "9:30", "24:00", "12:60", "-1:30"])("rejects invalid known time %s", (value) => {
    expect(validateBirthInput({ ...validInput, time: { kind: "known", value } }, today).time).toBeTruthy();
  });

  it.each(["00:00", "23:59"])("accepts time boundary %s", (value) => {
    expect(validateBirthInput({ ...validInput, time: { kind: "known", value } }, today)).toEqual({});
  });

  it("keeps unknown time absent instead of filling a default", () => {
    const input: BirthInput = { ...validInput, time: { kind: "unknown" } };
    expect(validateBirthInput(input, today)).toEqual({});
    expect(input.time).toEqual({ kind: "unknown" });
  });
});
