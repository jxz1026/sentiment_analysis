# 01 — 프로젝트 생성 및 개발 환경

## 목적
HTML/CSS/JavaScript와 Node.js를 사용하는 단순한 정적 프론트엔드 + Vercel 서버리스 API 구조를 만든다.

## 확정 기술
- Node.js 20 이상 권장
- npm
- 순수 HTML/CSS/Vanilla JavaScript
- Vercel Functions (`api/` 디렉터리)
- OpenAI 공식 Node.js SDK
- Supabase 공식 JavaScript SDK
- Vercel 배포

## 폴더 구조
아래 구조를 기준으로 만든다. 별도 프레임워크의 `src/`, `app/`, `pages/` 구조를 임의로 추가하지 않는다.

```text
mellow-sentiment/
├── AGENTS.md
├── PRD.md
├── package.json
├── index.html
├── .gitignore
├── .env.example
├── api/
│   └── analyze.js
├── assets/
│   └── hero.jpg
├── css/
│   └── style.css
├── js/
│   └── app.js
└── docs/
    ├── 01_PROJECT_SETUP.md
    ├── 02_UI_DESIGN.md
    ├── 03_FRONTEND.md
    ├── 04_BACKEND_API.md
    ├── 05_AI_SENTIMENT.md
    └── 06_DATABASE_DEPLOY.md
```

## 생성 순서
1. 새 폴더 `mellow-sentiment`를 만든다.
2. 터미널에서 해당 폴더로 이동한다.
3. `npm init -y`를 실행한다.
4. `openai`와 `@supabase/supabase-js`를 설치한다.
5. `package.json`에 `"type": "module"`을 설정한다.
6. 위 폴더 구조를 만든다.
7. `.gitignore`에 `.env`, `.env.*`, `!.env.example`, `node_modules/`, `.vercel/`을 추가한다.
8. `.env.example`에 필요한 환경변수 이름만 기록한다.

## package.json 기준
- `"type": "module"`을 사용한다.
- 실행·배포 스크립트는 실제 프로젝트 설정에 맞게 구성한다.
- 필요 이상의 의존성을 추가하지 않는다.
- OpenAI SDK와 Supabase SDK 버전은 설치 시점의 안정 버전을 사용하고 lock 파일을 커밋한다.

## 환경변수 이름
```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```
실제 값은 사용자가 발급한 키를 로컬 `.env` 파일과 Vercel 프로젝트 환경변수에 직접 입력한다. `.env.example`에는 실제 값을 절대 넣지 않는다.

## 로컬 실행
Vercel CLI를 개발 환경에서 사용해 `/api/analyze` 서버리스 함수를 포함한 동일 출처 테스트를 수행한다. 정적 파일만 여는 방식(`file://`)으로는 API 테스트를 하지 않는다.

## 검증
- [ ] Node.js와 npm 버전 확인
- [ ] `npm install` 성공
- [ ] `package.json`에 ESM 설정 확인
- [ ] 필수 폴더와 파일 존재 확인
- [ ] `.env`가 Git 추적 대상이 아닌지 확인
- [ ] 로컬 Vercel 개발 서버에서 랜딩 페이지가 열림
- [ ] `/api/analyze` 경로가 존재함

## 완료 기준
프로젝트 기본 구조가 만들어지고, 환경변수 이름과 실행 방법이 문서화되어 있으며, 비밀키 없이도 정적 화면을 실행할 수 있어야 한다.
