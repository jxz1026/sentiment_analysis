# 03 — 프론트엔드 구현 지침

## 목적
순수 HTML, CSS, Vanilla JavaScript로 입력, 요청, 로딩, 결과, 오류 화면을 구현한다.

## 파일
- `index.html`: 시맨틱 화면 구조
- `css/style.css`: 디자인 토큰, 레이아웃, 반응형
- `js/app.js`: DOM 이벤트와 API 통신
- `assets/hero.jpg`: 사용 허가를 확인한 히어로 이미지(없으면 CSS 배경 대체)

## HTML 요소 기준
필수 요소에 아래 ID를 사용한다. 이름을 바꾸려면 문서와 JS를 함께 수정한다.
- `sentiment-form`
- `text-input`
- `char-count`
- `analyze-button`
- `status-message`
- `result-section`
- `sentiment-label`
- `confidence-value`
- `confidence-bar`
- `reason-text`

textarea는 `maxlength="2000"`을 설정하고, JS에서도 글자 수를 확인한다. `label`을 연결하고 저장 안내 문구를 가까이 배치한다.

## JavaScript 동작
1. DOM이 준비된 뒤 폼 submit 이벤트를 등록한다.
2. 입력값 앞뒤 공백을 제거하고 빈 값인지 검사한다.
3. 길이가 2,000자를 초과하면 요청하지 않고 안내한다.
4. 요청 중 버튼을 비활성화하고 로딩 문구를 표시한다.
5. `fetch('/api/analyze', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ text }) })` 호출
6. 응답의 HTTP 상태와 JSON 구조를 검사한다.
7. 성공 시 감성, 신뢰도, 이유를 결과 영역에 표시한다.
8. 실패 시 사용자 친화적인 오류를 표시한다.
9. `finally`에서 버튼을 복구한다.

## API 응답 계약
성공:
```json
{
  "success": true,
  "result": {
    "sentiment": "positive",
    "label": "긍정",
    "confidence": 87,
    "reason": "기대와 만족을 나타내는 표현이 중심입니다."
  }
}
```
실패:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "문장을 입력해 주세요."
  }
}
```

## 결과 표시 보안
- 모델이 반환한 `reason`을 `innerHTML`에 넣지 않는다.
- `textContent`로만 표시한다.
- 감성별 CSS 클래스는 허용된 세 값만 매핑한다.
- 서버가 반환한 임의의 CSS 클래스나 HTML을 적용하지 않는다.
- 신뢰도는 숫자 여부와 0~100 범위를 확인한다.

## 오류 문구 기준
- 빈 입력: `분석할 문장을 입력해 주세요.`
- 글자 수 초과: `문장은 최대 2,000자까지 입력할 수 있어요.`
- 네트워크 오류: `서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.`
- 서버/AI 오류: `분석 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.`

## 검증 시나리오
- [ ] 빈 값 제출 시 API 호출 없음
- [ ] 공백만 입력 시 API 호출 없음
- [ ] 2,000자 입력 가능
- [ ] 2,001자 입력 불가
- [ ] 정상 응답 시 결과 세 항목 표시
- [ ] 실패 응답 시 오류 문구 표시
- [ ] 요청 중 중복 클릭 방지
- [ ] 키보드 Enter(폼 submit)로 동작
- [ ] 모델 이유 문자열에 HTML 태그가 포함되어도 실행되지 않음
- [ ] 모바일에서 버튼과 입력창이 화면 밖으로 나가지 않음

## 완료 기준
사용자가 입력부터 결과 확인까지 브라우저에서 수행할 수 있고, 모든 상태가 명확하며, 개발자 콘솔에 오류가 없어야 한다.
