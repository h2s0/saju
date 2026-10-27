# 04. 캐릭터 원본 가이드 (Character Bible) + 이미지 생성 프롬프트

> **최우선 규칙:** 이 문서만으로 매번 동일한 캐릭터가 자동 생성되는 것은 아니다. 반드시 **사용자가 지정한 최초 랜딩 이미지** 또는 그 크롭을 **이미지 참조(reference image)**로 넣고, 완성물을 육안 검수한다. 텍스트 프롬프트는 재현 가능성을 높이는 보조 수단이다.

## 1. 공식 원본 및 기준 이미지

| 구분 | 파일 | 규칙 |
| --- | --- | --- |
| **공식 최상위 기준** | `../assets/reference/woonmong_original_landing.png` | 사용자가 `x 73.8%, y 23.2%`로 지정한 최초 랜딩의 우측 상단 캐릭터 (이미지 속 전체 인물과 소품 포함) |
| **참조용 크롭** | `../assets/reference/woonmong_reference_crop.png` | 같은 원본에서 인물 중심으로 자른 참고 영역. 웹 UI나 배경 일부가 포함됨 |
| 단독 편집 참조 | `../assets/generated/woonmong-cutout_smile_v01.png` | 얼굴·붓·착용 장식 및 투명 실루엣 참조. AI 재구성본 |
| 다각도 작업 참조 | `../assets/generated/woonmong-turnaround_neutral_v01.png` | 왼쪽 정면 / 가운데 오른쪽 측면 / 오른쪽 후면. 이번 사용자 요청에 따라 후속 프롬프트의 작업 기준으로 사용. 원본과 충돌하면 원본 우선, 공식 마스터 승격은 별도 |

원본을 절대로 덮어쓰지 말 것. 원본으로부터 파생한 이미지는 원본을 대체하지 않는다.

## 2. 캐릭터 설정 (확정·제안 구분)

- **이름(기획상):** 운몽이 (雲夢, 읽기 쉬운 한글 호칭은 '운몽이')
- **역할:** 천계 운명관리소의 견습 신선
- **키워드:** 구름, 두루마리, 붓, 서투르지만 성실한 안내자, 신입 사무원, 귀여운 동양 판타지
- **동행:** 몽실이 — 둥글고 새하얀 구름 친구. 작은 검은 눈·작은 미소·복숭아색 볼
- **고정 말투:** '제가 먼저 찾아볼게요!', '담당 신선님께 여쭤볼게요!', '승인 났어요!'
- **성격:** 다정함, 활발함, 실수 후 바로 고치는 책임감; 현란한 마법사·무속인·저승사자는 아님.

## 3. 외형 고정 명세 (원본에서 관찰 가능한 특징)

### 얼굴/비율

- 작고 동글동글한 **치비(chibi)·SD** 체형, 상대적으로 큰 머리.
- 하얗고 부드러운 피부, 볼의 연한 복숭아 홍조.
- 넓고 큰 **회갈색~그레이브라운 계열**의 반짝이는 눈(주변 빛에 따라 푸른 기운이 느껴져도 무방), 부드러운 눈꼬리.
- 작고 둥근 코, 작게 벌린 웃는 입, 친근한 표정.
- 성별을 과장하지 않는 **소년 같은 어린 견습 신선** 분위기. 실제 인물처럼 성숙하게 변화시키지 않음.

### 머리

- **은백색/백금색** 머리. 파스텔 푸른색 반사광, 결이 고운 풍성한 앞머리.
- 윗머리는 가볍게 올려 묶었고, 뒤로 리본·머리카락이 둥글게 흐름.
- 크고 얇은 **하늘색/흰색 반투명 리본 장식**이 위쪽과 뒤로 자연스럽게 퍼짐.
- 정수리의 작은 **하늘색 보석이 박힌 금빛 관·머리장식**이 핵심 식별점.

### 의상

- **흰색 기본 저고리/도포** + 어두운 파랑/하늘색 깃과 허리 장식.
- 푸른 외투의 소매/자락, 넓은 동양풍 원단, 가는 금빛 문양.
- 허리의 금빛 장식과 푸른색 매듭, 망토처럼 흐르는 푸른 리본.
- 손목 및 소매 장식은 청금색, 옷은 서양식 정장/마법사 망토가 아님.

### 소품/동행

- 손에 든 **작은 붓** (운명을 기록하는 상징).
- 펼쳐진 오래된 아이보리색 **두루마리/운명록**.
- 아래 또는 옆에 둥근 흰 **몽실이** (조그만 표정과 푸른 꽃 모양 장식).
- 금색·파랑 구름문양, 아주 작은 별 입자. 배경은 은은한 구름/천계.

### 선화/채색

- 고운 일본/한국 애니풍 캐릭터 일러스트 + 동양 판타지 + 고급 파스텔 수채화 질감.
- 부드럽고 얇은 선, 강한 검정 테두리 최소화, 밝고 희미한 채도, 하늘색·백색 중심.
- 머리카락 하이라이트, 금속 장식의 미세한 금빛 질감, 섬세한 옷 문양은 유지.

## 4. 절대 바꾸지 않을 부분 / 변경 가능 부분

| 고정(LOCK) | 변경 가능(VARIABLE) |
| --- | --- |
| 은백색 머리·앞머리 모양·기본 올림머리 | 표정: 미소/놀람/당황/집중/축하/잠듦 |
| 같은 큰 회갈색 눈·볼 홍조·치비 얼굴 | 팔·다리 포즈, 손 제스처 |
| 금빛 관 + 푸른 보석 + 큰 푸른 리본 | 두루마리·붓·도장 등 소품 위치 |
| 흰색·푸른색 도포, 금빛 문양/매듭 | 카메라 각도, 전신/반신/클로즈업 |
| 둥글고 귀여운 키 비율/화풍 | 배경의 구름·책상·서고·천계 창문 |
| 몽실이의 구름 모양·작은 눈/입 | 몽실이 위치/감정(동일 디자인) |

**금지:** 머리색 검정/갈색 변경, 눈 색 포화 파랑으로 과도한 변경, 새로운 왕관 디자인, 뿔/날개/고양이 귀 추가, 도포를 서양식 마법사 옷으로 변경, 3D/Pixar/실사/픽셀아트 전환, 성숙한 인체 비율, 새 캐릭터의 얼굴로 교체.

## 5. 마스터 이미지 생성 프롬프트 (영어 / 복사해서 사용)

다음 3개를 실제 이미지 입력으로 첨부한다. 경로를 프롬프트에 적기만 하는 것은 이미지 첨부가 아니다.

1. `assets/reference/woonmong_reference_crop.png` — 최상위 얼굴·화풍 기준.
2. `assets/generated/woonmong-cutout_smile_v01.png` — 캐릭터 단독 실루엣과 얼굴 확대 참고.
3. `assets/generated/woonmong-turnaround_neutral_v01.png` — 정면·측면·후면 의상 구성의 작업 기준.

이번 요청은 생성된 이미지를 **작업 참조**로 사용하는 근거다. 원본에 없던 후면 디테일을 공식 확정하거나 제품에 자동 적용하는 승인과는 구분한다. 실제 생성 당시의 `assets/generated/prompts/*_v01.txt`는 이력으로 보존하고, 앞으로의 생성에는 아래 개정 프롬프트를 사용한다.

```text
Use case: identity-preserve
Create a new asset of the SAME Woonmong character using ALL attached images.
REFERENCE ROLES:
Image 1: original crop, highest authority for identity, face and rendering style. Ignore all web UI, lettering and scenery.
Image 2: isolated smiling cutout, supporting reference for face, crown, brush and costume silhouette. Do not copy its raised-arm pose unless requested.
Image 3: turnaround WORKING reference. Left = front, center = right-facing profile, right = back. Use it for consistent construction, not as three separate characters. Its unseen rear details are provisional; original visible features override any conflict.

IDENTITY LOCK:
Keep the same very large round head and small chibi body, soft rounded cheeks, peach blush, large gray-brown eyes with restrained warm highlights, tiny nose and cheerful mouth. No saturated blue eyes or mature proportions.
Keep fluffy silver-white hair, center-parted curved wispy bangs, cool pale blue shadows, tied upper hair. Match the existing gold crown silhouette, blue inset and central blue jewel; do not substitute a generic crown.
Preserve the pale-blue/translucent-white ribbon loops and blue tails, their attachment points and relative length. Do not add ribbons or change their construction between angles.
Match the white wrap robe, blue collar/cuffs and lower panels, blue-and-gold shoulder details, waist knot and dangling gold ornament. Keep delicate gold cloud embroidery sparse and consistent. For full-body/rear poses, use the simple pale shoes and tied rear hair/waist construction in Image 3 without adding new accessories.
Render with the same fine soft linework, pastel watercolor shading, airy white/sky-blue/warm-gold palette. Do not flatten into vector art or switch to 3D.

TASK:
Pose: [one action]
Expression: [one expression]
View/framing: [front / profile / back / three-quarter; full-body / upper-body]
Props: [none by default; explicitly list brush, blank scroll or stamp if required]
Mongsil: [absent by default; if requested attach the original cloud reference]

OUTPUT:
Exactly one Woonmong, unless TASK explicitly requests a turnaround. True transparent alpha background for standalone assets; do not paint a white background or checkerboard. Keep crown, ribbon ends and requested body framing inside safe margins. No website, text, logos, scenery, extra characters or floor shadows. Change only the requested pose/expression. Compare the result to the fixed references, not only to the previous generated output. If transparency is unavailable, report that limitation rather than labeling an opaque image as a cutout.
```

### 3면도 갱신 시 TASK 대체

```text
Exactly three full-body views of ONE model in a horizontal row: front, strict right-facing 90-degree profile, straight back. Same neutral standing pose, same scale, aligned crown height and foot baseline. No props or companion. Keep crown structure, ribbon attachment points, hair volume, shoulder ornaments, sleeve width, robe layers and waist decorations coherent across all three views. No labels. Preserve alpha transparency. Do not invent new rear details; retain the attached working turnaround construction unless a specific correction is requested.
```

## 6. 한국어 생성 프롬프트

```text
첨부 1(원본 크롭), 첨부 2(단독 누끼), 첨부 3(정면·측면·뒷면 시트)의 동일한 운몽이를 [표정/동작], [시점/전신 또는 반신]으로 만들어줘. 원본은 얼굴·화풍의 최상위 기준, 누끼는 단독 외형, 3면도는 의상·후면 구조의 작업 기준이야. 충돌하면 원본을 우선해. 은백색 가운데 갈라진 앞머리, 회갈색 눈과 복숭아 볼, 푸른 보석·푸른 바탕의 금빛 관, 연하늘·반투명 흰 리본 고리와 파란 꼬리, 흰 도포·푸른 깃과 소매·어깨 및 허리의 청금 장식, 큰 머리와 작은 몸 비율을 유지해. 원본의 섬세한 파스텔 수채화 선과 채색을 유지하고 새 장식을 추가하지 마. 기본은 캐릭터 한 명, 소품·몽실이·배경 없음. 필요 소품은 [없음/붓/빈 두루마리/도장]으로 별도 지정해. 실제 알파 투명 배경, 글자·UI·로고 없음. 머리장식과 리본 끝이 잘리지 않게 해줘.
```

## 7. 네거티브 프롬프트 (지원 모델에서만)

```text
new character design, different face, altered eyes, dark hair, saturated neon colors, mature realistic anatomy, realistic human portrait, Western witch costume, wizard hat, grim reaper, demon horns, wings, cat ears, animal mascot replacing the boy, heavy black outlines, 3D render, Pixar, pixel art, cyberpunk, oversaturated gold, alternate crown, different hairstyle, misplaced ribbons, extra fingers, extra limbs, text, Korean captions, fake UI, logo, watermark, cropped crown, cropped feet
```

모델이 네거티브 프롬프트를 지원하지 않으면 **피해야 할 변경을 자연어로 단단하게 기술**한다.

## 8. 필수 에셋 생성 목록 및 개별 포즈 프롬프트

| 에셋 키 | 표정/포즈 지시 (`[TASK]` 대체) | 사용 위치 | 권장 형식 |
| --- | --- | --- | --- |
| `woonmong-idle` | `friendly front-facing full-body pose, holding calligraphy brush and scroll, welcoming smile` | 홈 히어로 | 1024x1024 PNG/WebP 투명 배경 |
| `woonmong-search` | `carefully searching through a stack of scrolls with focused eyes, slightly leaning forward` | 분석 로딩 | 투명 PNG/WebP |
| `woonmong-happy` | `eyes gently closed, delighted big smile, clasping hands` | 무료 결과 | 투명 PNG/WebP |
| `woonmong-surprised` | `wide eyes, small open mouth, holding a floating scroll in surprise` | 내용 발견 | 투명 PNG/WebP |
| `woonmong-worried` | `slightly flustered but adorable, holding a scroll and looking toward an imaginary senior` | 결제 직전 상품 설명(공포 금지) | 투명 PNG/WebP |
| `woonmong-asking` | `respectfully holding a rolled scroll with both hands, looking toward off-screen senior, hopeful smile` | 담당 신선 문의 연출 | 투명 PNG/WebP |
| `woonmong-approved` | `holding up a small gold-trimmed blue approval stamp, jubilant, satisfied smile` | **실제 결제 성공 후** | 투명 PNG/WebP |
| `woonmong-sleepy` | `sleepily resting next to the same cloud companion, eyes closed, tiny peaceful smile` | 비어 있는 상태/오늘 마무리 | 투명 PNG/WebP |
| `woonmong-share` | `handing out a small blank ivory appointment certificate, lively smile` | 천계 발령장 | 투명 PNG/WebP |
| `mongsil-idle` | `the cloud companion only, white round fluffy cloud with simple dot eyes tiny mouth blue flower and blush` | 로딩/아이콘 | 투명 PNG/WebP |

**MVP 우선 제작:** idle, search, happy, worried, approved, sleepy, mongsil-idle (7종). 나머지는 출시 상황에 따라.

## 9. 생성 절차 (AI agent용)

1. 5절의 원본·단독 누끼·3면도 파일 존재 및 검수 상태 확인 → 역할을 명시해 실제 이미지로 첨부.
2. `마스터 프롬프트` + 포즈 지시 하나만 추가하여 생성.
3. 캐릭터 얼굴·관·리본·옷·몽실이를 원본과 나란히 비교.
4. 불일치하면 실패 판정하고 **참조 이미지를 기반으로 재편집**. 좋은 배경 때문에 다른 얼굴을 승인하지 말 것.
5. 최종 선택 이미지를 `assets/generated/<key>_v01.png`에 기록. 승인 전에는 UI에 편입하지 않음.
6. 모든 생성물의 파일명, 참조 이미지, 생성 일시, 포즈, 체크 결과와 승인 상태를 `assets/generated/manifest.json`에 기록. 승인 여부를 추정해서 변경하지 않음.
7. 최적화된 `.webp` 별도 생성. 원본은 무손실 보관.

## 10. 캐릭터 일관성 체크리스트

- [ ] 눈 형태, 눈동자 색조가 원본과 유사한가?
- [ ] 동일한 은백색 머리와 앞머리/올림머리인가?
- [ ] 푸른 중앙 보석이 박힌 동일 계열 금빛 관인가?
- [ ] 커다란 연하늘색·투명 흰 리본이 있는가?
- [ ] 도포 깃/소매/허리 매듭/금 문양이 원본과 같은가?
- [ ] SD 비율과 귀여운 표정이 유지되는가?
- [ ] 소품이 새로 추가되어 캐릭터 성격을 바꾸지 않는가?
- [ ] 몽실이를 쓰는 경우, 구름 친구의 외형이 일치하는가?
- [ ] 배경에 웹사이트 텍스트/버튼/로고가 그려지지 않았는가?
- [ ] 기존 승인 에셋과 나란히 놓았을 때 같은 캐릭터로 인식되는가?

## 11. 중요한 한계 및 업그레이드 계획

- 현재 기준 이미지는 **랜딩페이지 안에 합성되어 있는 PNG**이며, 완전히 깨끗한 정면/측면/후면 투명 원화는 아니다.
- 원본과 완전히 일치하는 에셋을 여러 번 만들고 싶다면, 향후 **운몽이 정식 3면도·표정 시트**를 원본 이미지 편집으로 제작하고 사람이 승인한 결과를 새로운 *공식 디자인 마스터*로 승격한다.
- 승인 없는 자동 승격·기존 원본 삭제 금지.
- 더 안정적인 생성이 필요하면 고정 참조 이미지, 동일 툴/모델, 샘플 시드(지원 시), LoRA/참조 어댑터(권리 검토) 등을 활용하되 **동일 결과 보장으로 표현하지 않음**.

## 12. 투명 캐릭터 및 3면도 제작 (2026-10-27)

- 캐릭터 단독: `assets/generated/woonmong-cutout_smile_v01.png`. 구름·두루마리·웹 UI를 제거하고 붓과 착용 장식은 유지한 AI 편집본. 원본 픽셀을 그대로 분리한 마스크 작업은 아니며 가려진 옷은 일부 재구성됨.
- 3면도: `assets/generated/woonmong-turnaround_neutral_v01.png`. 왼쪽 정면 / 가운데 오른쪽을 향한 90도 측면 / 오른쪽 뒷면. 소품 없는 전신, 같은 크기와 기준선, 투명 배경.
- **상태: 사용자 검수 대기.** 원본에 보이지 않는 하체·신발·뒷머리·뒷면 의상은 추정 디자인이다. 사용자 승인 전 공식 마스터 승격이나 제품 UI 적용 금지.
- 실제 생성에 사용한 프롬프트: `assets/generated/prompts/cutout_v01.txt`, `assets/generated/prompts/turnaround_v01.txt`. 도구·참조·검수 결과는 `assets/generated/manifest.json`에 기록한다.
- 후속 생성 시 5절의 세 이미지를 함께 첨부한다. 생성된 시트는 사용자 요청에 따라 작업 참조로 사용하되, 후면 추정 디테일의 공식 승인과 제품 적용은 별도다.
- 원본 대비 눈·앞머리·관의 세부 윤곽·리본 연결·의상 문양을 비교하고, 세 방향 간 장식 개수와 배치를 검수한다. 불일치한 부분을 새로운 규칙으로 학습시키지 않는다.
- 이미지 생성만으로 항상 동일한 캐릭터를 보장할 수는 없다. 고정 이미지 참조와 결과별 검수를 반복한다.
