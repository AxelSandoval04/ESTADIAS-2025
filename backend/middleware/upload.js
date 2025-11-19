const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, unique + ext);
  }
});

const fileFilter = (_req, file, cb) => {
  // Aceptar cualquier tipo de imagen que el navegador reporte como image/*
  if (/^image\//.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de imagen no soportado'), false);
  }
};

module.exports = multer({
  storage,
  // Subimos límite a 10MB para soportar capturas grandes
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter
});
