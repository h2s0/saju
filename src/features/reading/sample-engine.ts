import { validateGeneratedSections } from "./reading-prompt";
import { validateBirthInput } from "./birth-validation";
import type {
  BirthInput,
  CalculationResult,
  InterpretationEvidence,
  ReadingResult,
  ReadingSection,
  SampleId,
} from "./contracts";

function sampleCalculation(timeKnown: boolean): CalculationResult {
  return {
    isSample: true,
    version: "sample-calculation-v1",
    timeKnown,
    pillars: {
      year: { stem: "갑", branch: "자" },
      month: { stem: "병", branch: "인" },
      day: { stem: "무", branch: "진" },
      hour: timeKnown ? { stem: "경", branch: "신" } : null,
    },
    uncertainties: [
      "입력한 생년월일로 계산하지 않은 개발용 샘플 명식이에요.",
      ...(timeKnown ? [] : ["태어난 시간을 몰라 시주와 시간에 의존한 설명을 제외했어요."]),
    ],
  };
}

export function calculateSample(input: BirthInput): CalculationResult {
  if (Object.keys(validateBirthInput(input)).length > 0) {
    throw new Error("출생 입력을 확인해 주세요.");
  }
  // Date and time values deliberately do not affect these development fixtures.
  return sampleCalculation(input.time.kind === "known");
}

function evidenceFixtures(): InterpretationEvidence[] {
  return [
    ["sample-care", "신중함을 장점으로 살리되 완벽함을 기다리지 않는 작은 시도를 제안한다."],
    ["sample-listen", "관계에서는 상대의 의도를 추측하기보다 직접 묻고 경청하는 방법을 제안한다."],
    ["sample-focus", "일에서는 우선순위를 정하고 작은 단위로 완료하는 방법을 제안한다."],
    ["sample-budget", "돈을 다룰 때 지출을 기록하고 충동적인 결정을 잠시 미루는 습관을 제안한다."],
    ["sample-action", "무리한 계획보다 실천할 수 있는 한 가지 행동과 짧은 회고를 제안한다."],
  ].map(([id, allowedInterpretation]) => ({
    id,
    allowedInterpretation,
    condition: "개발용 샘플 결과를 표시할 때만 사용하는 문구 예시",
    exception: "실제 명식의 해석이나 이용자 성향을 판단하는 근거로 사용하지 않음",
    source: "development-fixture",
    version: "sample-evidence-v1",
    requiresBirthTime: false,
  }));
}

function sectionFixtures(): ReadingSection[] {
  return [
    {
      id: "temperament",
      title: "기질 · 나만의 속도를 알아가기",
      paragraphs: [
        "이 예시에서는 차분히 살피는 태도를 하나의 강점으로 소개해요. 급하게 결론을 내리지 않는 여유는 선택지를 비교하고 마음에 맞는 방향을 찾는 데 도움이 될 수 있어요. 다만 이것은 입력 정보에서 알아낸 성격이 아니라, 풀이의 구성과 말투를 살펴보기 위한 샘플이에요.",
        "준비가 완벽해질 때까지 기다리기보다는 작은 시도를 먼저 정해 보세요. 결정을 내린 뒤에는 잘한 점 하나와 다음에 바꾸고 싶은 점 하나만 적어도 충분해요. 신중함과 실행을 함께 연습하는 방법이랍니다.",
      ],
      evidenceIds: ["sample-care"],
    },
    {
      id: "relationships",
      title: "관계 · 마음을 확인하는 대화",
      paragraphs: [
        "상대의 짧은 말이나 표정에는 여러 이유가 있을 수 있어요. 마음을 먼저 단정하기보다 ‘어떤 뜻으로 이야기한 거야?’라고 부드럽게 확인하는 대화를 연습해 보세요. 서로의 생각을 확인하면 오해를 줄이는 데 도움이 될 수 있어요.",
        "나의 부탁도 구체적으로 전해 보세요. ‘좀 더 신경 써 줘’ 대신 ‘오늘은 내 이야기를 잠깐 들어 줄 수 있을까?’처럼요. 이 내용은 특정 인연이나 관계의 미래를 예측하지 않는, 소통 방법의 개발용 예시예요.",
      ],
      evidenceIds: ["sample-listen"],
    },
    {
      id: "work",
      title: "일 · 하나씩 끝내는 힘",
      paragraphs: [
        "해야 할 일이 많을 때는 가장 중요한 한 가지를 먼저 골라 보세요. 큰 일을 바로 끝내려 하기보다 오늘 마칠 수 있는 작은 단위로 나누면 시작하기가 한결 수월해질 수 있어요. 이 예시의 핵심은 직업을 정해 주는 것이 아니라, 일하는 방식을 돌아보는 데 있어요.",
        "일을 마친 뒤에는 들인 시간보다 무엇을 배웠는지 기록해 보세요. 어려웠던 부분과 도움을 요청할 부분을 구분하면 다음 계획을 세우기 쉬워져요. 특정 직업의 적성이나 합격·승진을 판단하는 실제 사주 풀이는 아니에요.",
      ],
      evidenceIds: ["sample-focus"],
    },
    {
      id: "money",
      title: "돈 관리 · 흐름을 살피는 습관",
      paragraphs: [
        "이 샘플에서는 돈의 많고 적음을 예측하기보다 일상에서 확인할 수 있는 습관을 다뤄요. 최근 지출을 필요한 것, 즐거움을 위한 것, 돌아보고 싶은 것으로 나눠 보면 스스로 중요하게 여기는 것을 이해하는 데 도움이 될 수 있어요.",
        "갑자기 사고 싶은 것이 생겼다면 결정을 잠시 미루고 사용 목적을 적어 보세요. 무엇을 사거나 투자해야 한다는 추천은 하지 않아요. 자신의 상황과 예산을 확인하는 작은 습관을 보여 드리는 예시랍니다.",
      ],
      evidenceIds: ["sample-budget"],
    },
    {
      id: "practice",
      title: "실천 · 오늘 한 가지면 충분해요",
      paragraphs: [
        "오늘은 이 예시에서 마음에 남는 행동 하나만 골라 보세요. 해야 할 일을 한 줄 적거나, 가까운 사람에게 마음을 확인하는 질문을 하거나, 지출 한 건을 기록하는 정도면 충분해요. 모든 조언을 한 번에 실천할 필요는 없어요.",
        "하루가 끝나면 해 본 일과 느낀 점을 짧게 남겨 보세요. 잘 맞지 않았다면 다음에는 더 작은 행동으로 바꾸면 돼요. 이 기록은 미래를 맞히기 위한 것이 아니라, 스스로에게 맞는 생활 방식을 찾아가는 연습이에요.",
      ],
      evidenceIds: ["sample-action"],
    },
  ];
}

/** Replace this boundary with a server-side provider after real evidence is verified. */
export function generateSampleDetails(
  calculation: CalculationResult,
  evidence: InterpretationEvidence[],
): ReadingSection[] {
  const result = validateGeneratedSections(
    { sections: sectionFixtures() },
    calculation,
    evidence,
  );
  if (!result.valid) {
    throw new Error("샘플 설명에 필요한 해석 근거가 없거나 사용할 수 없어요.");
  }
  return result.sections;
}

export function generateSampleReading(id: SampleId): ReadingResult {
  const evidence = evidenceFixtures();
  const calculation = sampleCalculation(id === "sample-known");
  const previewByRule: Record<string, string> = {
    "sample-care": "작은 마음의 움직임도 천천히 살펴보는 시간을 가져 봐요. 이 개발용 예시에서는 신중함을 살리면서도 작은 시도를 시작하는 방법을 소개해요. 입력하신 생년월일에서 알아낸 성향은 아니에요.",
    "sample-listen": "관계에서는 상대의 뜻을 혼자 추측하기보다 다정하게 물어보는 연습을 해 봐요. 나의 생각도 구체적인 말로 전하면 서로를 이해하는 데 도움이 될 수 있어요.",
  };
  return {
    id,
    isSample: true,
    calculation,
    freeParagraphs: evidence.flatMap((item) =>
      previewByRule[item.id] ? [previewByRule[item.id]] : [],
    ),
    advice: "오늘 하고 싶은 일 하나를 적고, 시작할 수 있는 가장 작은 행동을 골라 보세요.",
    sections: generateSampleDetails(calculation, evidence),
    evidence,
    generationVersion: "sample-reading-v1",
  };
}
