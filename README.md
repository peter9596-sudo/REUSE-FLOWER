# Flower Platform MVP

간단한 축하 화분 등록 웹/백엔드 (Express + SQLite + multer 2.x).

## 실행
1. 의존성 설치: `npm install`
2. 서버 시작: `npm run dev` → http://localhost:3000 열기
3. 정적 파일: `index.html`, 업로드 파일: `/uploads` (자동 생성), DB: `data.db`

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
