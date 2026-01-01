const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const DB_PATH = path.join(__dirname, 'data.db');

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const db = new sqlite3.Database(DB_PATH);
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS pots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      qty INTEGER NOT NULL,
      location TEXT NOT NULL,
      intent TEXT NOT NULL,
      photos TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: {
    files: 5,
    fileSize: 5 * 1024 * 1024, // 5MB per file
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'photos'));
    }
    cb(null, true);
  },
});

app.use(cors());
app.use(express.static(__dirname));
app.use('/uploads', express.static(UPLOAD_DIR));

app.post('/api/pots', upload.array('photos', 5), (req, res) => {
  const { qty, location, intent } = req.body;
  const qtyNum = Number(qty);

  if (!qtyNum || qtyNum < 1 || !location || !intent) {
    return res.status(400).json({ ok: false, message: '필수 항목을 확인해 주세요.' });
  }

  const photos = (req.files || []).map((f) => f.filename);

  db.run(
    'INSERT INTO pots (qty, location, intent, photos) VALUES (?, ?, ?, ?)',
    [qtyNum, location.trim(), intent, JSON.stringify(photos)],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ ok: false, message: '저장 중 오류가 발생했습니다.' });
      }
      return res.json({ ok: true, id: this.lastID });
    }
  );
});

// Multer and other errors
app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ ok: false, message: '각 사진은 5MB 이하만 업로드 가능합니다.' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ ok: false, message: '이미지 파일만 업로드 가능합니다.' });
    }
    return res.status(400).json({ ok: false, message: '업로드 제한을 확인해 주세요.' });
  }
  console.error(err);
  return res.status(500).json({ ok: false, message: '서버 오류가 발생했습니다.' });
});

app.get('/api/pots', (_req, res) => {
  db.all('SELECT * FROM pots ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ ok: false, message: '조회 실패' });
    res.json({ ok: true, data: rows });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
