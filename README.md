# 천명록 (天命錄) — Product Documentation

종합·애정·직업·재물·올해·대운·궁합 7개 상품을 각각 선택해 소개 → 입력 → 무료 미리보기 → 0원 모의 구매 → 상품별 다섯 영역 상세 결과 → 보관함을 체험한다. 결과 상단의 반원 게이지는 다섯 해석 방향을 보여주는 고정 샘플이며 점수·성공 확률이 아니다. 올해는 2026년 예시, 대운은 가상 구간 A·B·C로 실제 나이·연운·대운표를 계산하지 않는다. 오늘 운세도 고정 샘플이다. 실행 방법과 한계는 [로컬 시제품 안내](docs/11-local-prototype.md), 후속 생성 계약은 [풀이 프롬프트 계약](docs/12-reading-prompt-contract.md)을 따른다.

```sh
npm ci
npm run dev
```

기본 주소는 `http://127.0.0.1:3000`이다. 검사는 `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`로 실행한다. E2E는 Chromium 설치 후 빌드된 앱에서 `npm run test:e2e`로 실행한다. Node.js 24.22.1 / npm 11.19.1 환경에서 검증했다.

명리 개념·상품별 분석 기준·출처·후속 프롬프트는 [풀이 지식 팩](docs/reading-knowledge/README.md)에 정리했다. 구조 검사는 `python3 scripts/check-reading-knowledge.py`로 실행하며, 실제 계산·예측 정확도 검사가 아니다.

> **Status:** 로컬 시제품 · 2026-10-28 · 실제 사주 계산·AI·로그인·결제 미연결
>
> **Product:** 모바일 전용 웹앱으로 제공하는 캐릭터 기반 사주 풀이 서비스
>
> **Core:** 견습 신선 '운몽'이 천계 운명관리소에서 운명록을 찾고, 담당 신선에게 **결재**를 올려 유료 풀이를 열람하는 경험

## 빠른 시작

1. 개발 에이전트는 루트 [`AGENTS.md`](./AGENTS.md)를 먼저 읽는다.
2. 서비스의 목적과 결정사항: [`docs/00-product-brief.md`](./docs/00-product-brief.md)
3. 전체 페이지 목록·라우트·페이지별 상세 기능: [`docs/01-information-architecture.md`](./docs/01-information-architecture.md)
4. 버튼·에러·상태 등 UX 라이팅: [`docs/02-ux-writing.md`](./docs/02-ux-writing.md)
5. **색상·타이포·간격·컴포넌트 단일 기준:** [`DESIGN.md`](./DESIGN.md), 화면 적용 예시: [`docs/03-ui-design-system.md`](./docs/03-ui-design-system.md)
6. **원본 캐릭터 보존 규칙 및 생성 프롬프트:** [`docs/04-character-bible.md`](./docs/04-character-bible.md)
7. 상품과 결제·복원·취소 상태: [`docs/05-commerce-flow.md`](./docs/05-commerce-flow.md)
8. 공유형 차별화 기능: [`docs/06-social-viral-features.md`](./docs/06-social-viral-features.md)
9. 구현 설계와 데이터 모델 초안: [`docs/07-technical-architecture.md`](./docs/07-technical-architecture.md)
10. 이벤트·지표·수용 기준: [`docs/08-analytics-and-qa.md`](./docs/08-analytics-and-qa.md)
11. 레퍼런스 출처 및 미확정 결정: [`docs/09-competitor-research-and-decisions.md`](./docs/09-competitor-research-and-decisions.md)

12. **서비스 출시 결정 목록:** [`docs/10-launch-decisions.md`](./docs/10-launch-decisions.md)

개발 공통 기준: [ARCHITECTURE.md](./ARCHITECTURE.md)에서 파일 배치·의존 방향을, [COMMIT_CONVENTION.md](./COMMIT_CONVENTION.md)에서 한국어 Conventional Commits와 작은 목적 단위를 확인한다. 공식 문서·설치 버전 확인 절차는 [AGENTS.md](./AGENTS.md)를 따른다.

디자인 기준은 [DESIGN.md](DESIGN.md)에 정리했다. 2026-10-28 선택한 써라운드 에어 제목·Pretendard 본문과 커비 포털을 참고한 둥근 카드·별·구름은 **로컬 화면에 적용했다**. 서체 파일은 자체 호스팅하며 공식 출처·버전·라이선스는 [서체 안내](src/styles/fonts/README.md)에 보관한다. 화면별 적용과 후속 검수는 [디자인 가이드](docs/03-ui-design-system.md)를 따른다.

Next.js App Router + TypeScript, CSS Modules/CSS 변수, Vitest, Playwright는 시제품에 적용했다. 백엔드 공급자·인증·PG·운영 정책은 후속 실제 연동 단계의 추천/미결정 상태를 따른다.

## 디렉터리

```text
saju/
├─ AGENTS.md
├─ ARCHITECTURE.md
├─ COMMIT_CONVENTION.md
├─ DESIGN.md
├─ README.md
├─ src/              # app: 라우트, features: 기능, components: 공용 UI, styles: 토큰
├─ public/images/    # 로컬 확인용 캐릭터 사본 (승인 상태는 변경하지 않음)
├─ tests/e2e/        # Playwright 사용자 흐름 검사
├─ package.json
├─ package-lock.json
├─ assets/
│  └─ reference/
│     ├─ woonmong_original_landing.png  # 사용자가 확정한 원본 이미지가 들어 있는 최초 랜딩 시안
│     └─ woonmong_reference_crop.png    # 원본에서 캐릭터만 참고하기 위한 비파괴 크롭
└─ docs/
   ├─ 00-product-brief.md
   ├─ 01-information-architecture.md
   ├─ 02-ux-writing.md
   ├─ 03-ui-design-system.md
   ├─ 04-character-bible.md
   ├─ 05-commerce-flow.md
   ├─ 06-social-viral-features.md
   ├─ 07-technical-architecture.md
   ├─ 08-analytics-and-qa.md
   ├─ 09-competitor-research-and-decisions.md
   ├─ 10-launch-decisions.md
   ├─ 11-local-prototype.md
   ├─ 12-reading-prompt-contract.md
   └─ reading-knowledge/  # 상품별 분석 규칙·출처·프롬프트·검증 사례
```

## 사실·제안 구분

- **확정(사용자):** Next.js 사용, 한국어 Conventional Commits, 가벼운 기능별 코드 구조, 모바일 전용 웹앱, '견습 신선' 세계관, 원본 이미지 속 운몽이 외형, 뽀용한 하늘색 방향, 이전 UX 라이팅의 친근한 결
- **기획안(변경 가능):** 가격별 상품 구성, 하단 탭 수, 무료 콘텐츠 범위, 천계 발령장/합동결재, 미연결 백엔드 기술 스택, 데이터 지표
- **미검증:** 사주 만세력/일주 계산의 정확성, 결제 제공사·수수료·정책, 지적재산권/상표 등록 여부, 타사 상세 결제 프로세스
- 서비스의 사주 콘텐츠는 해석·엔터테인먼트이며 미래 사건이나 정확도를 보장하지 않는다.

## 원본 이미지 우선순위

`woonmong_original_landing.png` > `woonmong_reference_crop.png` > 생성된 누끼·3면도 작업 참조(검수 상태 확인) > 텍스트 프롬프트 > 신규 생성물

단, 이미지 원본에 포함된 웹페이지 글자/배경/브랜드 UI는 캐릭터 외형 기준에서 제외한다. **기본 프롬프트만으로 동일 캐릭터가 항상 생성되지는 않으므로 이미지 참조와 사람의 승인이 반드시 필요하다.**
