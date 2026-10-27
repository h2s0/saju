# 천명록 아키텍처

상태: 개발 시 적용할 구조 규칙 / 2026-10-27. 현재 앱 코드와 설치된 프레임워크 버전은 없다. Next.js 사용은 확정이며 App Router 기준으로 구조를 설명한다. TypeScript 및 DB·인증·PG·큐·배포 공급자 선택은 [기술 설계](docs/07-technical-architecture.md)의 추천/미결정 상태를 유지한다.

## 1. 문서 역할과 설계 방향

이 문서는 **파일 배치·책임·의존 방향의 단일 기준**이다. [DESIGN.md](DESIGN.md)는 디자인 값, [기술 설계](docs/07-technical-architecture.md)는 도메인 객체·API·백엔드 동작, [결정 기록](docs/09-competitor-research-and-decisions.md)은 선택 이유를 관리한다.

가벼운 기능별 구조를 사용한다. Next.js가 정한 라우팅 파일 규약 위에 프로젝트의 책임 경계를 더한 것으로, 아래 전체 폴더 구조를 프레임워크가 강제하는 것은 아니다. 필요한 기능부터 구현하고 빈 폴더·추상 인터페이스·범용 프레임워크를 미리 만들지 않는다.

## 2. 파일 배치

| 위치 | 책임 |
| --- | --- |
| `src/app/` | page/layout/loading/error 등 라우팅 파일, HTTP·Server Action 진입점 및 화면 조립 |
| `src/features/<feature>/` | 기능별 UI·클라이언트 훅·순수 로직·검증 스키마·전송 타입 |
| `src/components/` | 여러 기능이 실제로 재사용하는 UI·셸·마스코트 |
| `src/server/<domain>/` | 서버 유스케이스·도메인 데이터 접근·권한·트랜잭션 처리 |
| `src/server/integrations/` | DB 연결·인증·PG·LLM·큐 등 외부 공급자 SDK 연동 |
| `src/shared/` | 실행 환경에 독립적이며 실제로 공유되는 타입·작은 유틸리티 |
| `src/styles/` | DESIGN.md에 대응하는 토큰과 공통 스타일 |
| `src/jobs/` | 비동기 작업 진입점·실행 환경·재시도 연결 |
| `tests/integration/`, `tests/e2e/` | 경계 간 통합·사용자 흐름 테스트 |
| `public/` | 공개 배포를 승인한 정적 파일만 보관 |
| `assets/reference/`, `assets/generated/` | 원본 및 생성 작업 에셋·검수 이력; 전부를 공개 배포하지 않음 |

단위 테스트는 대상 옆의 `*.test.ts` 또는 `*.test.tsx`에 둔다. 경로·확장자 예시는 TypeScript 채택 시 기준이며 설치나 구현 완료를 뜻하지 않는다. 마이그레이션 경로는 DB 도구 선택 후 그 도구의 공식 규약에 따라 기록한다.

Next.js의 `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx` 등 예약 이름은 그대로 따른다. 나머지 파일은 `create-order.ts`, `birth-form.tsx`처럼 책임이 드러나는 kebab-case, React 컴포넌트 export는 PascalCase를 기본으로 한다. 특정 라우트에서만 쓰는 조립용 파일은 `_components` 등 private folder에 둘 수 있지만 기능 로직의 두 번째 보관소로 사용하지 않는다.

## 3. 의존 방향과 실행 환경

```text
라우트 / Server Action / 작업 진입점
  → 서버 도메인 → 외부 연동 → DB / PG / LLM / 큐

화면 조립 → 기능 UI → 재사용 UI
기능 UI / 서버 도메인 → 필요한 순수 로직·전송 타입 → shared
```

- 라우트는 입력 검증·인증·응답 연결에 집중한다. 도메인 규칙·권한·상태 전이는 서버 도메인 함수에 둬 웹훅·작업에서도 동일 규칙을 사용한다.
- Server Component를 기본으로 하고 브라우저 API·이벤트·상태가 필요한 작은 부분만 Client Component로 분리한다. `error` 등 프레임워크가 Client Component를 요구하는 파일은 공식 규약을 따른다.
- 기능 UI는 서버 구현·DB·PG SDK를 import하지 않는다. 라우트의 Server Component가 데이터를 조회해 직렬화 가능한 최소 DTO를 전달한다. 브라우저 변경 요청은 승인된 HTTP/Action 경계를 사용한다.
- 서버 도메인은 기능의 **명시된 순수 진입 파일**만 참조할 수 있다. UI·훅·클라이언트 전용 라이브러리를 함께 내보내는 barrel을 참조하지 않는다. 예: `features/reading/contracts.ts`, `features/reading/calculate-pillars.ts`.
- 외부 연동은 서버 도메인·UI를 역참조하지 않는다. 도메인별 쿼리는 `server/<domain>/`가 소유하고 공급자 연결 코드는 integrations에 둔다.
- 기능 간 내부 파일 직접 참조·순환 의존을 금지한다. 교차 도메인 유스케이스는 소유 도메인에서 상대 도메인의 명시된 서비스 진입점을 사용하며 역방향 참조를 만들지 않는다.
- 각 모듈은 필요한 공개 파일/export만 제공한다. `export *`로 모든 구현을 공개하거나 client/server 코드를 하나의 index에서 섞지 않는다.
- 브라우저·서버 공용 코드는 비밀값·DB 연결·서버 SDK를 포함하지 않는다. 브라우저로 전달하는 계산 로직이 있어도 결과·가격·권한의 최종 결정은 서버가 수행한다.
- Next.js 서버 전용 모듈은 공식 `server-only` 보호를 적용한다. 독립 worker가 Next 전용 모듈을 실행할 수 있다고 가정하지 않는다. worker 채택 시 웹 전용 경계와 재사용 도메인 모듈을 분리하고 해당 런타임에서 import·실행 검사를 한다.
- 공개 진입점마다 인증·소유권·입력을 검증한다. UI 숨김이나 라우트 미들웨어 검사만으로 권한 검증을 대체하지 않는다. 개인 결과를 공유 캐시·공개 파일에 저장하지 않는다.

공용화는 실제 재사용이 확인된 뒤 진행한다. 거대한 `utils.ts`, `types.ts`, 만능 서비스 대신 역할이 드러나는 파일을 쓴다. 줄 수보다 책임·변경 이유가 달라지는 지점을 분리 기준으로 삼는다.

## 4. 주요 데이터 흐름

### 무료 조회

입력 UI → reading 요청 진입점 → 세션 소유권·입력 검증 → 서버 reading 유스케이스 → 순수 명식 계산 → 무료 설명 생성·저장 → 무료 DTO 반환. 장시간 처리가 필요하면 영속 작업으로 넘기고 소유권을 검사하는 상태 조회로 표시한다. 유료 내용을 내려준 뒤 CSS로 가리지 않는다.

### 결제 승인

주문 진입점 → 서버의 가격·기존 권한 확인 → 주문 저장 → PG 진행 → 서버 승인 확인 또는 webhook → 동일 payment 서비스 → 주문·권한·생성 outbox 저장. 중복·역순 이벤트에도 단일 권한을 유지한다. 외부 PG 승인과 DB 갱신 사이 실패는 대사로 복구한다. 실제 성공 확인 뒤에만 결재 연출을 표시한다.

### 비동기 생성

영속 큐 → jobs 진입점 → reading 서비스 → 계산 결과 기반 LLM/템플릿 → 품질 검증 → 버전 있는 리포트 저장 → 사용자 상태 조회. 재시도·중복 수신에 멱등하게 처리하고 실패 상한 이후 운영 재처리 경로를 제공한다. 결제 상태와 생성 상태를 분리하며 생성 실패로 재청구하지 않는다. 세부 정책·공급자는 기술 설계에서 결정한다.

## 5. 새 기능을 추가하는 순서와 예시

1. 관련 기획과 확정 상태를 확인하고 기존 기능 안에 둘 수 있는지 먼저 판단한다.
2. 화면은 app에서 조립하고 기능 UI는 features, 서버 동작은 server의 해당 도메인에 둔다.
3. 공개 입력·출력 타입을 소유 기능 가까이에 두고 내부 DB 모델을 브라우저 계약으로 그대로 노출하지 않는다.
4. 필요한 연동만 integrations에 추가하고 단위·통합·E2E 검증을 책임에 맞춰 배치한다.
5. 구조·정책 변경을 해당 기준 문서에 반영하고 [커밋 규칙](COMMIT_CONVENTION.md)에 따라 목적별로 묶는다.

예: 무료 미리보기에서 사용자의 결과를 조회하는 기능.

| 예시 파일 | 책임 |
| --- | --- |
| `src/app/reading/preview/[readingId]/page.tsx` | 세션 확인 후 서비스 호출, 화면 조립 |
| `src/features/reading/preview-card.tsx` | 전달받은 무료 DTO 표시 |
| `src/features/reading/contracts.ts` | 무료 결과의 최소 전송 타입 |
| `src/server/reading/get-preview.ts` | 소유권 검증·무료 필드 선택 |
| `src/server/reading/get-preview.test.ts` | 무료/유료 필드 분리 등 단위 검증 |
| `tests/integration/reading-preview.test.ts` | 다른 사용자 접근 차단·DB 경계 검증 |
| `tests/e2e/reading-preview.spec.ts` | 입력 후 무료 결과 열람 흐름 |

이 기능의 구현·관련 테스트·동작 문서는 하나의 목적 단위로 묶는다. 독립적인 기반 구축이 필요하면 먼저 정상 동작하는 기반 커밋을 만들고, 무관한 UI 정리는 별도 커밋으로 분리한다. 위 파일들은 배치 예시이며 현재 생성된 파일이 아니다.

## 6. 검증·변경 관리와 공식 근거

코드가 생기면 관련 테스트·타입 검사·린트·빌드로 동작과 import 경계를 검증한다. 서버 코드의 클라이언트 유입, 순환 의존, 권한 누락, 중복 결제/생성, 새로고침 복원을 점검한다. 도구 설정이 없는 현재는 문서 링크·경로·책임의 일관성을 검사하며 앱 테스트가 통과했다고 표현하지 않는다.

공식 문서 확인일: 2026-10-27. 아래는 App Router 가이드이며 **설치 버전이 확정되지 않았으므로 특정 버전에 대한 구현 검증은 아니다.** 구현 시 package manifest와 lockfile의 실제 버전에 맞춰 다시 확인한다.

- [Next.js 프로젝트 구조](https://nextjs.org/docs/app/getting-started/project-structure) — 예약 파일·src·route/private folder 규약.
- [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — 기본 서버 렌더링, 클라이언트 경계, server-only 보호.
- [Backend for Frontend](https://nextjs.org/docs/app/guides/backend-for-frontend) — 공개 HTTP 진입점과 서버 기능의 범위.

기능별 폴더·의존 방향·명명 규칙은 프로젝트 선택이다. 변경 시 이유·영향·대안과 공식 근거를 결정 기록에 남기고 이 문서 및 관련 예시를 함께 갱신한다.
