# 13. 검색 노출·SEO 설계서

확인일: **2026-10-28**. 적용 기술: **Next.js 16.4.3 App Router**. 상태: **공식 자료 조사·프로젝트 정책 문서화 / SEO 구현·검색 등록 전**. 실행 증거를 채우는 서식은 [SEO 출시 점검표](14-seo-launch-checklist.md)다. 도메인·호스팅·운영 상품은 아직 미정이다.

## 1. 목표와 현재 상태

검색자가 천명록과 공개 상품의 내용을 이해하고 방문하도록 돕는다. 개인 풀이를 검색 콘텐츠로 사용하지 않는다. 검색 노출·순위·리치 결과는 보장하지 않는다. Google의 [SEO 기본 가이드](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)를 출발점으로 삼되, 아래 노출 범위는 **프로젝트 선택**이다.

| 항목 | 현재 코드 확인 결과 | 후속 작업 |
| --- | --- | --- |
| 기본 메타데이터 | `src/app/layout.tsx`에 공통 제목·시제품 설명·`index: false, follow: false`, 문서 언어 `ko` | 환경별 정책과 공개 페이지별 제목·설명 |
| 라우트별 메타데이터 | 별도 설정 없음 | 검수한 홈·상품 소개에만 공개 정책 적용 |
| robots·사이트맵 | `src/app/robots.ts`, `sitemap.ts` 없음 | 아래 허용 목록으로 생성·검사 |
| 공유 이미지·검색 등록 | 전용 OG 메타데이터 파일·소유 확인 설정 없음 | 승인 에셋·실제 도메인 확정 후 연결 |
| 실제 접근 제어 | 공개 fixture와 클라이언트 모의 구매 상태 | 실제 개인 결과는 서버 인증·인가 필요 |

현재 전체 `noindex, nofollow`를 유지한다. 이 문서는 앱 코드나 설정을 변경하지 않는다. 개발용 주소 `localhost`, `127.0.0.1`, `100.64.0.8`은 운영 대표 URL이나 등록 대상이 아니다.

## 2. 환경·페이지별 노출 정책

| 환경·경로 | 검색 정책 | 사이트맵 | 조건 |
| --- | --- | --- | --- |
| 로컬·미리보기·스테이징 전체 | `noindex` | 공개 URL 목록 제공 안 함 | 배포 환경에서는 접근 보호도 검토 |
| 운영 `/` | 공개 후보 | 승인 후 포함 | 서비스·샘플 여부·운영 정보 검수 |
| 운영 `/products/{product}` | 상품별 공개 후보 | 실제 공개 승인된 것만 포함 | 7개 체험 상품 모두가 출시 상품이라는 뜻이 아님 |
| `/reading/new`, `/reading/processing/*`, `/reading/preview/*` | `noindex` | 제외 | 입력·처리·개인 미리보기 |
| `/checkout/*`, `/readings/*`, `/library` | `noindex` | 제외 | 구매·결과·보관함; 실제 연동 시 서버 인가 필수 |
| `/today` | 현재 고정 샘플은 `noindex` | 제외 | 향후 검수된 공개 콘텐츠를 제공할 때 재결정 |
| `/support` | 현재 시제품 안내는 `noindex` | 제외 | 실제 공개 도움말·정책이 준비되면 재검수 |
| 향후 로그인·계정·개인 공유 URL | 기본 `noindex` | 제외 | 공유 동의·철회·접근 범위 별도 설계 |
| 존재하지 않는 상품·결과 | 적절한 404/410 또는 권한 응답 | 제외 | 빈 페이지를 200으로 반환하지 않음 |

**검색 제외와 정보 보호는 별개다.** `noindex`는 검색 로봇에 대한 지시이고 인증이 아니다. Google은 [robots.txt가 크롤링 제어이며 검색 제외·비밀 보호 수단이 아님](https://developers.google.com/search/docs/crawling-indexing/robots/intro)을 설명한다. 운영 개인 데이터는 비인가 요청에 본문을 반환하지 않아야 한다. 메타데이터·OG에도 이름·출생정보·결과 문장·구매 내역을 넣지 않는다.

공개 접근 가능한 페이지를 색인에서 제외할 때는 로봇이 `noindex`를 읽을 수 있어야 한다. `robots.txt`로 먼저 막고 `noindex`도 적용했다고 제외가 보장되지는 않는다. [Google noindex 안내](https://developers.google.com/search/docs/crawling-indexing/block-indexing)와 [네이버 검색 제외 안내](https://searchadvisor.naver.com/guide/faq-serpremove)를 따른다. 개인 데이터의 접근 보호를 해제해 로봇을 들여보내는 방식은 사용하지 않는다.

## 3. Next.js 구현 명세 — 아직 미구현

[Metadata API](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)와 설치된 `node_modules/next/dist/docs/`를 함께 확인했다. 아래는 공식 파일 규약 위에 정한 구현 배치다. 빈 파일·추상 계층을 미리 만들지 않는다.

| 위치 | 후속 구현 책임 |
| --- | --- |
| `src/app/layout.tsx` | 기본 제목·템플릿·언어·검증된 `metadataBase`, 기본 검색 제외 |
| `src/app/page.tsx` | 홈 공개 조건·고유 제목·설명·canonical |
| `src/app/products/[product]/page.tsx` | 허용 상품 검증 후 `generateMetadata`, 상품별 고유 정보·canonical |
| `src/app/robots.ts` | 환경별 크롤링 정책과 운영 사이트맵 위치; 비밀 경로 목록으로 쓰지 않음 |
| `src/app/sitemap.ts` | 공개 승인된 정상 URL만 반환 |
| `src/app/`의 OG·아이콘 규약 파일 | 승인된 공용 공유 이미지·서비스 아이콘 |
| 필요할 때 `src/server/seo/` | 신뢰할 대표 origin·공개 여부의 공통 서버 설정 |

세부 경계는 [ARCHITECTURE.md](../ARCHITECTURE.md)를 따른다. 의존성·SEO 플러그인을 추가할 필요는 현재 없다.

### 환경 설정과 안전한 기본값

제안 설정명은 `SITE_URL`(대표 HTTPS origin), `SEO_INDEXING_ENABLED`(명시적 검색 공개 스위치)다. **현재 환경 변수로 구현되지 않았다.** 운영 배포 식별 + 유효한 대표 origin + 공개 스위치 + 검수된 경로 허용 목록이 모두 맞을 때만 공개한다. 설정 누락·잘못된 URL·미리보기 배포는 검색 제외로 처리한다. 미리보기도 production build일 수 있으므로 `NODE_ENV`만으로 판단하지 않는다.

대표 주소는 배포 설정에서 가져오고 요청 `Host` 헤더로 임의 생성하지 않는다. 환경 전환 시 빌드·메타데이터·캐시 반영을 확인한다. [robots](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)와 [sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)은 기본 캐시 동작이 있는 특별한 Route Handler이므로 플래그 변경만으로 즉시 갱신된다고 가정하지 않는다.

### 메타데이터와 canonical

- `metadata`/`generateMetadata`는 Server Component에서 사용한다. 클라이언트에서 `<head>`를 뒤늦게 수정해 검색 정책을 뒤집지 않는다. 초기 `noindex`가 있는 JavaScript 페이지의 처리 주의는 [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)를 따른다.
- Next.js 메타데이터는 중첩 객체를 깊게 병합하지 않는다. 하위 페이지에서 `robots`, `openGraph` 등을 정의할 때 필요한 전체 필드를 확인한다. 공개 페이지의 일반 로봇·검색엔진별 지시와 HTTP `X-Robots-Tag`가 충돌하지 않는지도 검사한다.
- 루트 `title.template`과 `default`를 정하고 하위 제목에 서비스명이 중복되지 않게 한다. 템플릿은 같은 세그먼트가 아닌 하위 세그먼트에 적용된다. 상세 API는 [generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)를 따른다.
- 공개 페이지는 대표 HTTPS 도메인의 자기 URL을 canonical로 둔다. 상품마다 자기 소개 URL을 사용하며 모든 상품을 홈으로 합치지 않는다. 추적 쿼리는 canonical에서 제외한다. HTTP/HTTPS·www 정책은 서버 리디렉션과 일치시킨다. canonical은 검색엔진의 대표 URL 선택을 돕는 신호다. [Google 중복 URL 통합](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- 메타데이터 스트리밍은 공식 기본 동작과 로봇 처리를 확인하고 실제 응답으로 검증한다. 검증 없이 전역 비활성화하지 않는다.

### 사이트맵

운영에서 승인된 공개 페이지 중 정상 200·대표 URL만 절대 HTTPS URL로 싣는다. 개인 결과·입력·결제·로그인·리디렉션·404·검색 제외 페이지는 제외한다. 카탈로그 전체를 자동으로 발행 목록으로 쓰지 않는다.

`lastmod`는 실제 주요 콘텐츠 변경 시각을 사용하고 모르면 생략한다. 빌드·요청 때마다 현재 날짜로 바꾸지 않는다. Google이 사용하지 않는 `priority`, `changefreq`는 기본 생략한다. 제출은 발견을 돕는 절차이며 색인 보장이 아니다. [Google 사이트맵 작성 지침](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

## 4. 공개 콘텐츠·공유·구조화 데이터

다음 제목은 **출시 전 검수할 초안**이다. 현재 페이지에 적용된 값이 아니다. 설명은 상품에 실제 포함되는 항목·한계를 고유하게 쓰고 샘플을 실제 계산으로 소개하지 않는다.

| 상품 | 제목 초안 | 설명에 담을 차이 |
| --- | --- | --- |
| 종합 | 종합 사주 풀이 · 천명록 | 기질·관계·일·돈 관리·실천 |
| 애정 | 애정운과 관계 성향 · 천명록 | 감정 표현·소통·관계 유지 |
| 직업 | 직업운과 일하는 방식 · 천명록 | 강점·협업·환경·진로 점검 |
| 재물 | 재물운과 돈 관리 습관 · 천명록 | 소비·관리·주의 습관; 투자 수익 보장 금지 |
| 올해 | 올해 운세 · 천명록 | 실제 공개한 대상 연도·범위; 현재 2026년은 샘플 |
| 대운 | 대운 흐름 풀이 · 천명록 | 구간·계산 관례·불확실성; 현재는 가상 구간 |
| 궁합 | 궁합과 두 사람의 소통 · 천명록 | 공통점·차이·갈등 조율; 관계 성공 보장 금지 |

본문에 읽을 수 있는 제목·목차·실제 설명·일반 링크를 제공한다. 키워드 반복이나 이미지 안 글자로 본문을 대체하지 않는다. `title`·description의 고정 글자 수를 순위 규칙으로 취급하지 않는다. 검색 제목·요약은 재작성될 수 있다. [Google 제목](https://developers.google.com/search/docs/appearance/title-link), [검색 요약](https://developers.google.com/search/docs/appearance/snippet), [네이버 콘텐츠 마크업](https://searchadvisor.naver.com/guide/markup-content)

OG는 공개 페이지의 제목·설명·공용 이미지로 작성하고 공유 미리보기에서 확인한다. 검색 순위 보장 수단이 아니다. 캐릭터는 [검수 상태](04-character-bible.md)를 확인하며 로컬 확인용 승인 대기 에셋을 운영 승인으로 바꾸지 않는다.

구조화 데이터는 필수가 아니다. 운영 주체와 내용이 확정되면 실제 보이는 정보에 맞는 WebSite·Organization·탐색 경로 등을 검토한다. Product/Offer는 판매 조건·가격·해당 검색 기능의 자격을 확인할 때까지 보류한다. 모의 체험 0원·가격 가설·가짜 리뷰나 평점을 판매 데이터로 마크업하지 않는다. 구조 검증은 리치 결과 노출 보장이 아니다. [Google 구조화 데이터](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)

JSON-LD를 구현하면 서버에서 안전하게 직렬화하고 `<` 등 위험한 문자열 처리를 검토한다. 개인정보를 넣지 않는다. [Next.js JSON-LD 가이드](https://nextjs.org/docs/app/guides/json-ld)의 예시와 실제 데이터 경계를 확인한다.

### AI 콘텐츠와 품질

개인 풀이·생년월일 조합·비슷한 운세 문장을 대량 발행해 검색 페이지 수를 늘리지 않는다. 공개 명리 안내는 출처·관점·검수일·불확실성을 밝히고 사람이 검수한다. [지식 팩](reading-knowledge/README.md)은 내부 조사 자료이며 공개 웹페이지나 검증된 예측 데이터가 아니다. 생성 여부와 별개로 독자에게 유용한 고유 콘텐츠를 제공한다. [Google 생성형 AI 콘텐츠 지침](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content)

### 모바일 성능

모바일 전용 430px 중앙 캔버스를 유지한다. 검색을 위해 별도 PC 랜딩을 만들지 않는다. 폰트·캐릭터 이미지의 전송량, 이미지 크기 지정, 로딩 중 레이아웃 이동을 확인한다. 현재 공식 WOFF2 원본 5개는 총 3,459,956바이트이며 실제 사용 페이지의 네트워크 전송량과는 구분한다. 최적화 방식은 별도 측정 후 결정한다.

Core Web Vitals의 좋은 경험 기준은 LCP 약 2.5초 이내, INP 200ms 미만, CLS 0.1 미만이다. 실사용 데이터와 실험실 측정을 구분하며 Lighthouse 점수를 검색 순위 보장으로 설명하지 않는다. [Google Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)

## 5. 검색엔진 등록과 운영

공개 도메인·HTTPS·출시 콘텐츠가 준비되면 [출시 점검표](14-seo-launch-checklist.md)를 채운다. 이번에는 계정 접속·도메인 구매·DNS 변경·사이트 등록·색인 요청을 수행하지 않았다.

| 검색엔진 | 공식 절차·근거 | 프로젝트 적용 |
| --- | --- | --- |
| Google | [소유권 확인](https://support.google.com/webmasters/answer/9008080), [URL 검사](https://support.google.com/webmasters/answer/9012289) | DNS 권한이 있으면 도메인 속성 검토, 검증 후 사이트맵·공개 URL 검사 |
| 네이버 | [SEO 시작](https://searchadvisor.naver.com/guide/seo-basic-intro), [사이트맵 제출](https://searchadvisor.naver.com/guide/request-feed), [canonical·로봇 메타](https://searchadvisor.naver.com/guide/markup-structure) | 호스트 등록·HTML 태그/파일 소유 확인 후 사이트맵 제출 |
| Bing | [사이트 추가·확인](https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b), [사이트맵](https://www.bing.com/webmasters/help/sitemaps-3b5cf6ed), [가이드라인](https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a) | 파일/메타/DNS 또는 승인된 Search Console 가져오기 중 선택 |

모든 링크는 2026-10-28 공식 자료 기준이다. Google·네이버·Next.js 본문을 확인했고, Bing 도움말은 직접 열기 시 JavaScript 안내만 제공되어 공식 도메인의 검색 추출 본문으로 확인했다. 콘솔 화면·지원 방식은 실제 등록 시 다시 확인한다. 검색 도구에는 공개 검수 URL만 넣고 개인 결과 URL·토큰·출생정보를 제출하지 않는다. Search Console 사용을 위해 GA나 광고 추적을 추가할 필요는 없다.

## 6. 후속 구현 순서와 완료 근거

1. 대표 도메인·배포 환경·공개 상품·담당자를 확정하고 점검표에 기록한다.
2. 환경별 공개 허용 목록·페이지 메타데이터·canonical을 구현하고 비공개 기본값을 회귀 검사한다.
3. robots·사이트맵·승인된 OG·아이콘을 구현하고 HTML/HTTP/XML 실응답과 모바일 성능을 검증한다.
4. 공개 배포 검수 후 소유권 확인·사이트맵 제출·공개 URL 검사 결과를 기록한다.
5. 수집/색인 오류·중복 URL·검색 유입·실사용 성능을 관찰하고 콘텐츠를 개선한다.

타입·린트·빌드 통과만으로 검색 등록·노출·개인정보 보호가 완료되지는 않는다. 문서 완료, 코드 검사, 외부 등록, 실제 색인 관측을 각각 기록한다. 세부 테스트와 담당자 서식은 다음 문서에 단일 관리한다.
