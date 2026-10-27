import type { BirthErrors, BirthInput } from "./contracts";

function todayInKorea(): string {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((part) => part.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function validateBirthInput(
  input: BirthInput,
  today = todayInKorea(),
): BirthErrors {
  const errors: BirthErrors = {};

  if (input.calendar !== "solar" && input.calendar !== "lunar") {
    errors.calendar = "양력 또는 음력을 선택해 주세요.";
  } else if (input.calendar === "solar" && input.leapMonth) {
    errors.calendar = "윤달은 음력에서만 선택할 수 있어요.";
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.birthDate);
  if (!match) {
    errors.birthDate = "생년월일을 연도 4자리, 월 2자리, 일 2자리로 입력해 주세요.";
  } else {
    const [, yearText, monthText, dayText] = match;
    const year = Number(yearText);
    const month = Number(monthText);
    const day = Number(dayText);
    if (year < 1 || month < 1 || month > 12 || day < 1) {
      errors.birthDate = "생년월일의 연도, 월, 일을 다시 확인해 주세요.";
    } else if (input.calendar === "lunar") {
      // Only shape/range validation: no lunar conversion or leap-month claims.
      if (day > 30) errors.birthDate = "음력 날짜는 1일부터 30일까지 입력해 주세요.";
    } else if (input.calendar === "solar") {
      const date = new Date(0);
      date.setUTCFullYear(year, month - 1, day);
      if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day
      ) {
        errors.birthDate = "실제로 존재하는 양력 날짜를 입력해 주세요.";
      } else if (input.birthDate > today) {
        errors.birthDate = "태어난 날짜는 오늘보다 늦을 수 없어요.";
      }
    }
  }

  if (
    input.time.kind !== "unknown" &&
    (input.time.kind !== "known" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.time.value))
  ) {
    errors.time = "태어난 시각을 00:00부터 23:59 사이로 입력하거나 모름을 선택해 주세요.";
  }
  return errors;
}
