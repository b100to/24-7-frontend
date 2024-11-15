# 24/7 Community Hub

모임 정산 및 멤버 관리를 위한 웹 애플리케이션입니다.

## 주요 기능

### 1. 정산 관리
- 다중 차수 정산 입력
- 참가자별 금액 자동 계산
- 정산 내역 저장 및 조회
- 빠른 금액 입력 기능
- 이전 차수 참가자 복사 기능

### 2. 모임원 관리
- 모임원 등록/수정/삭제
- 모임원 상태 확인
- 신규/기존 회원 구분
- 모임원 정보 관리 (이름, 출생연도, 성별, 지역 등)

### 3. 사용자 인증
- Google 로그인 연동
- 관리자 권한 관리
- 신규 가입자 정보 입력

## 기술 스택

- React
- Firebase
  - Authentication (구글 로그인)
  - Firestore Database (데이터 저장)
- Material-UI (MUI)
- React Router
- date-fns

## 데이터 구조

### Firestore Collections

1. `members`
   - 모임원 정보 저장
   - 이름, 출생연도, 성별, 지역 등

2. `meetings`
   - 정산 내역 저장
   - 차수, 금액, 참가자, 장소 등

3. `admins`
   - 관리자 권한 관리

## 설치 및 실행

# 프로젝트 클론
git clone [repository-url]

# 디렉토리 이동
cd meeting-calculator-frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm start

## 환경 변수 설정

`.env` 파일을 생성하고 Firebase 설정 정보를 입력:

REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id

## 배포

Vercel을 통해 자동 배포됩니다.

## 라이선스

MIT License
