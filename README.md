# Flower Platform MVP

간단한 축하 화분 등록 웹/백엔드 (Express + SQLite + multer 2.x).

## 실행
1. 의존성 설치: `npm install`
2. 서버 시작: `npm run dev` → http://localhost:3000 열기
3. 정적 파일: `index.html`, 업로드 파일: `/uploads` (자동 생성), DB: `data.db`

## 배포 (예: Render)
- 레포를 Render에 연결 → New Web Service
- Build command: `npm install`
- Start command: `npm start`
- Environment: `PORT`는 Render가 주입 (코드는 PORT 또는 3000 사용)
- 지속 스토리지: `uploads/`, `data.db`가 필요하면 Render의 Persistent Disk를 설정하거나 S3 같은 외부 스토리지를 사용하세요.
- 헬스 체크: GET `/` 또는 `/index.html`

## 배포 (Docker)
- 이미지 빌드: `docker build -t reuse-flower .`
- 실행: `docker run -p 3000:3000 reuse-flower`
- 데이터 보존 필요 시 볼륨 마운트: `docker run -p 3000:3000 -v ${PWD}/uploads:/app/uploads -v ${PWD}/data.db:/app/data.db reuse-flower`

## 배포 (Fly.io)
- Fly CLI 설치 후: `fly launch --copy-config --now` (이미 생성된 fly.toml 사용)
- 이미지 빌드/배포: `fly deploy`
- 볼륨 생성(업로드/DB 보존): `fly volumes create flower_data --region iad --size 1` 후 `fly.toml`에 `[[mounts]]` 설정 추가 필요 (예: source="flower_data", destination="/app/uploads" 그리고 DB는 `/app/data.db` 파일로 관리)

다른 옵션
- Vercel/Netlify: 정적만 가능하므로(백엔드 필요) 이 프로젝트엔 부적합. Express 백엔드를 함께 쓰려면 Render/Fly/Heroku 대안 사용

## 엔드포인트
- `POST /api/pots` : 사진(최대 5장, 5MB, 이미지 전용) + qty + location + intent 저장
- `GET /api/pots` : 최근 등록 목록 반환
- 정적: `/uploads/<filename>` 업로드 이미지 제공

## 운영/자동 재시작 옵션 (선택)
- PM2 설치: `npm install -g pm2`
- 시작: `pm2 start server.js --name flower-platform`
- 부팅시 자동: `pm2 startup windows` 실행 후 안내 명령 따라 적용, `pm2 save`

## 기타
- 업로드/DB 파일은 동일 폴더에 생성됩니다. 백업이 필요하면 `uploads/`와 `data.db`를 복사하세요.
