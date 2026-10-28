export const PRODUCT_IDS = ["basic", "love", "career", "money", "year", "decade", "compatibility"] as const;
export type ProductId = (typeof PRODUCT_IDS)[number];

export type ProductDefinition = {
  id: ProductId;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  price: number | null;
  sectionIds: string[];
  sectionTitles: string[];
  periodLabel?: string;
};

export const PRODUCTS: readonly ProductDefinition[] = [
  {
    id: "basic", title: "종합 사주", subtitle: "내 운명록", icon: "命", price: 990,
    description: "기질부터 관계, 일과 생활의 작은 힌트까지 한 권에 담았어요.",
    sectionIds: ["temperament", "relationships", "work", "money", "practice"],
    sectionTitles: ["기질 · 나만의 속도를 알아가기", "관계 · 마음을 확인하는 대화", "일 · 하나씩 끝내는 힘", "돈 관리 · 흐름을 살피는 습관", "실천 · 오늘 한 가지면 충분해요"],
  },
  {
    id: "love", title: "애정운", subtitle: "인연부", icon: "♡", price: 990,
    description: "마음을 표현하고 서로의 속도를 알아가는 다섯 가지 이야기예요.",
    sectionIds: ["love-pattern", "love-expression", "love-communication", "love-care", "love-practice"],
    sectionTitles: ["관계 성향 · 가까워지는 나의 속도", "감정 표현 · 마음을 말로 옮기기", "소통 · 추측보다 확인하는 대화", "관계 유지 · 편안한 경계 세우기", "실천 · 다정한 질문 하나"],
  },
  {
    id: "career", title: "직업운", subtitle: "관운부", icon: "✎", price: null,
    description: "일하는 방식과 협업, 나에게 맞는 환경을 돌아보는 기록이에요.",
    sectionIds: ["career-style", "career-strength", "career-team", "career-environment", "career-next"],
    sectionTitles: ["일하는 방식 · 집중의 리듬", "강점 · 배운 것을 남기는 힘", "협업 · 기대를 맞추는 과정", "업무 환경 · 나에게 필요한 조건", "진로 점검 · 작은 실험부터"],
  },
  {
    id: "money", title: "재물운", subtitle: "재물부", icon: "◈", price: null,
    description: "소비와 관리 습관을 살피고 내 기준을 세워보는 이야기예요.",
    sectionIds: ["money-pattern", "money-spending", "money-management", "money-caution", "money-practice"],
    sectionTitles: ["돈을 대하는 태도 · 나의 기준", "소비 · 만족이 남는 선택", "관리 · 흐름을 보이게 하기", "점검 · 급한 결정 앞에서", "실천 · 한 주의 기록"],
  },
  {
    id: "year", title: "올해 운세", subtitle: "올해의 운명록", icon: "☀", price: 990,
    description: "예시 연도의 네 계절을 나누어 생활의 점검 주제를 살펴봐요.",
    sectionIds: ["year-theme", "year-q1", "year-q2", "year-q3", "year-q4"],
    sectionTitles: ["연간 주제 · 기준을 다지는 해", "1분기 · 정리와 관찰", "2분기 · 준비와 작은 시도", "3분기 · 연결과 조율", "4분기 · 회고와 다음 준비"],
    periodLabel: "2026년 예시 · 실제 연운 계산 아님",
  },
  {
    id: "decade", title: "대운", subtitle: "시간의 운명록", icon: "⌛", price: null,
    description: "가상의 세 구간을 통해 긴 흐름과 전환기를 읽는 구성을 체험해요.",
    sectionIds: ["decade-origin", "decade-first", "decade-second", "decade-third", "decade-transition"],
    sectionTitles: ["원국과 운 · 함께 읽는 두 층", "가상 구간 A · 기반을 살피기", "가상 구간 B · 선택지를 넓히기", "가상 구간 C · 경험을 정리하기", "전환기 · 바뀌는 조건 점검"],
    periodLabel: "가상 구간 A·B·C · 실제 나이·대운표 아님",
  },
  {
    id: "compatibility", title: "궁합", subtitle: "두 사람의 인연록", icon: "∞", price: null,
    description: "서로 다른 두 사람이 대화와 일상을 맞추는 방법을 살펴봐요.",
    sectionIds: ["pair-pattern", "pair-communication", "pair-common", "pair-conflict", "pair-practice"],
    sectionTitles: ["두 사람의 성향 · 다른 속도 이해하기", "소통 · 대답을 기다리는 방법", "공통점과 차이 · 함께 고를 기준", "갈등 조율 · 쉬었다 다시 이야기하기", "실천 · 둘이 만드는 약속"],
  },
];

export function isProductId(value: unknown): value is ProductId {
  return typeof value === "string" && PRODUCT_IDS.some((id) => id === value);
}

export function getProduct(id: ProductId): ProductDefinition {
  const product = PRODUCTS.find((item) => item.id === id);
  if (!product) throw new Error("지원하지 않는 상품이에요.");
  return product;
}
