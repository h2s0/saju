# 로컬 서체 원본과 라이선스

확인·다운로드: 2026-10-28. 이 폴더의 서체 바이너리는 공식 배포 원본이다. 변환·서브셋·수정하지 않았다. 패키지를 설치하지 않았다. `.gitattributes`는 PDF를 바이너리로 표시하고 Pretendard 라이선스 원문의 공백을 그대로 보존하도록 해당 파일만 공백 검사에서 제외한다.

## 적용 버전과 굵기

| 파일 | 버전 고정 | 실제 제공 face / CSS 굵기 | 바이트 |
| --- | --- | --- | ---: |
| `Pretendard-Regular.woff2` | Pretendard 공식 v1.3.9 태그 | Regular / 400 | 765,892 |
| `Pretendard-Medium.woff2` | Pretendard 공식 v1.3.9 태그 | Medium / 500 | 778,432 |
| `Pretendard-SemiBold.woff2` | Pretendard 공식 v1.3.9 태그 | SemiBold / 600 | 785,856 |
| `Pretendard-Bold.woff2` | Pretendard 공식 v1.3.9 태그 | Bold / 700 | 791,156 |
| `Cafe24SsurroundAir-v1.1.woff2` | Cafe24 공식 v1.1 ZIP | Light / 300 | 338,620 |

Cafe24의 [공식 서체 목록 JSON](https://img.cafe24.com/csdstatic/freefonts/data/fonts_ko.json)은 `cafe24-ssurround-air`의 `fontWeight`를 `300`, 다운로드를 `Cafe24SsurroundAir-v1.1.zip`으로 명시한다. ZIP에 포함된 원본 WOFF2만 추출했다. 파일명·공식 목록의 버전으로 고정하며, 변경 가능한 공식 URL이 영구 불변임을 가정하지 않는다. 아래 SHA-256으로 실제 수령 바이트를 식별한다. fontconfig 검사에서도 Light face를 확인했다. 여러 굵기나 가변 범위를 제공하는 파일이 아니다.

Pretendard는 [공식 최신 릴리스 v1.3.9](https://github.com/orioncactus/pretendard/releases/tag/v1.3.9)와 해당 태그의 원본 정적 WOFF2 4개를 사용한다. [같은 태그의 공식 CSS](https://github.com/orioncactus/pretendard/blob/v1.3.9/packages/pretendard/dist/web/static/pretendard.css)의 400/500/600/700 배속을 따른다. fontconfig에서도 Regular/Medium/SemiBold/Bold를 각각 확인했다. 가변 폰트 파일이나 모든 굵기 묶음을 받지 않았다.

5개 WOFF2 총량은 3,459,956바이트다. 필요한 4개 Pretendard 굵기와 제목용 Cafe24 한 face만 보관한다. 한글 완성형을 담은 공식 전체 파일이므로 작게 만들기 위한 임의 서브셋·재압축을 하지 않았다. Cafe24 원본 라이선스 PDF는 약 1.96MB이지만 저작권 안내 원문을 유지하기 위해 보관하며 브라우저의 폰트 로딩 대상이 아니다.

## 라이선스 원문

- [License-SsurroundAir.pdf](License-SsurroundAir.pdf): Cafe24 v1.1 ZIP에 동봉된 저작권 안내·사용범위 원본. Cafe24 저작권과 OFL 1.1 적용, 상업 이용·임베딩·재배포 조건을 명시한다. 추출 텍스트로 원본을 대체하지 않았다.
- [OFL-1.1-official-template.txt](OFL-1.1-official-template.txt): 위 Cafe24 안내가 참조하는 [SIL 공식 OFL 영문 전문](https://openfontlicense.org/open-font-license-official-text/)의 원본 다운로드다. 상단의 `<Copyright Holder>` 등은 공식 일반 양식 그대로이며 Cafe24의 저작권 표시는 **동봉 PDF**를 함께 참조한다. 이 파일을 Cafe24가 발행한 개별 저작권 공지로 표시하지 않는다.
- [LICENSE-Pretendard.txt](LICENSE-Pretendard.txt): Pretendard v1.3.9 태그의 LICENSE 원본. 길형진 저작권과 예약명 Pretendard, OFL 1.1 전문을 그대로 보관했다.

상업 웹 사용·임베딩은 허용된다. 폰트 자체 단독 판매는 금지되며 폰트 파일의 재배포 시 저작권 안내와 해당 라이선스를 함께 유지한다. 변경본의 예약명 조건·OFL 유지 조건도 준수해야 한다. 이 프로젝트는 폰트 바이너리를 변경하지 않았다. Cafe24 결과물의 프로모션 활용 안내와 거부 요청 절차도 동봉 PDF에 있다.

## 공식 출처와 SHA-256

각 링크는 실제 다운로드한 URL이다. Cafe24의 ZIP 내부 경로는 표 뒤에 기록한다. 다른 CDN/개인 저장소가 제공하는 변환본은 사용하지 않았다.

| 로컬 파일 | 공식 원본 URL | SHA-256 |
| --- | --- | --- |
| `Pretendard-Regular.woff2` | [원본](https://raw.githubusercontent.com/orioncactus/pretendard/v1.3.9/packages/pretendard/dist/web/static/woff2/Pretendard-Regular.woff2) | `fad853f7f47c6c8b103171e7193fa095708cdcd70850a71d93aa5379e8a61d63` |
| `Pretendard-Medium.woff2` | [원본](https://raw.githubusercontent.com/orioncactus/pretendard/v1.3.9/packages/pretendard/dist/web/static/woff2/Pretendard-Medium.woff2) | `d03481330eeba0659ab5b87f25ceb504a35de377dd90a0d0aba2982eb2d05e2c` |
| `Pretendard-SemiBold.woff2` | [원본](https://raw.githubusercontent.com/orioncactus/pretendard/v1.3.9/packages/pretendard/dist/web/static/woff2/Pretendard-SemiBold.woff2) | `c863f76a7de5c1ddc1ed8b2fa794964530774592c4f31407a84e2a2ae93f17f0` |
| `Pretendard-Bold.woff2` | [원본](https://raw.githubusercontent.com/orioncactus/pretendard/v1.3.9/packages/pretendard/dist/web/static/woff2/Pretendard-Bold.woff2) | `4609c3356e536fafe38f4add0daeceb3d8595d3057bce13c428c33ddbd43d362` |
| `LICENSE-Pretendard.txt` | [원본](https://raw.githubusercontent.com/orioncactus/pretendard/v1.3.9/LICENSE) | `d31ddd9f2bed32fd7e302a205cf2380ba0de6529152d239ef99cfb6f261bfc04` |
| `Cafe24SsurroundAir-v1.1.woff2` | [원본](https://img.cafe24.com/csdstatic/freefonts/download/kr/Cafe24SsurroundAir-v1.1.zip) | `fdeaeb1a001750e52e069410a8278f4e1855c8bdb8bf6da4a76c354053af0c8c` |
| `License-SsurroundAir.pdf` | [원본](https://img.cafe24.com/csdstatic/freefonts/download/kr/Cafe24SsurroundAir-v1.1.zip) | `cfed67d5ca9bb1aa043fef0578bada646543578fbe966390a6e916944be60696` |
| `OFL-1.1-official-template.txt` | [원본](https://openfontlicense.org/documents/OFL.txt) | `1d361a8f8e8ce6e68457dcd93fb56e162e6baa3bbb7e7573a290d44399f6b57e` |

Cafe24 ZIP 내부 경로:

```text
Cafe24SsurroundAir-v1.1/webfont/Cafe24SsurroundAir-v1.1.woff2
Cafe24SsurroundAir-v1.1/License-SsurroundAir.pdf
```

원본 압축 파일과 나머지 TTF/OTF/WOFF, macOS 보조 파일은 프로젝트에 넣지 않았다. SHA-256은 내려받은 각 파일의 무결성 식별이며 서체의 권리나 진위를 단독으로 증명하는 전자서명이 아니다.

## next/font/local 연결

실제 설정은 [fonts.ts](../fonts.ts), 루트 변수 클래스 연결은 [layout.tsx](../../app/layout.tsx), CSS 역할 매핑은 [globals.css](../globals.css)에서 관리한다. 고정 face에 가변 굵기 범위를 선언하지 않는다. 다섯 전체 한글 파일을 모두 선행 로드하지 않도록 `preload: false`, 로딩 중 시스템 서체로 읽도록 `display: swap`을 사용한다. 제목은 300, 본문·버튼은 실제 제공하는 Pretendard 굵기를 지정한다. Air에는 `font-synthesis: none`을 적용한다. 공식 권장 크기는 [Cafe24 출시 안내](https://shopnotice.cafe24.com/view?bbs_no=5&limit=10&no=345162&page=48&search_keyword=&subject_head=) 기준 14pt 이상이며 프로젝트 타이포 값은 루트 DESIGN.md를 따른다.

## 수행한 검사와 한계

원본 다운로드, ZIP 경로 확인, WOFF2 매직/헤더 파일 길이 검사, fontconfig의 실제 family/style/weight 인식, SHA-256 계산, 라이선스 PDF 텍스트와 Pretendard LICENSE 확인을 수행했다. fontconfig의 weight 숫자는 CSS 숫자 체계와 다르므로 README의 CSS 굵기는 공식 배포 메타데이터/CSS로 정했다. 브라우저 렌더링·로컬 로딩·실패 시 fallback·확대 검사는 앱 연결 후 수행하며 결과는 시제품 안내에 기록한다. 실제 기기와 운영 네트워크 성능 검증은 별도다.
