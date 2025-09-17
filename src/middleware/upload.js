const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Storage configuration for CAD files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4();
    const fileExtension = path.extname(file.originalname);
    cb(null, `cad-${uniqueSuffix}${fileExtension}`);
  }
});

// File filter for CAD files
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/octet-stream', // .x_t files
    'application/stp', // .stp files
    'application/step', // .step files
    'model/step', // Alternative MIME type for STEP
    'application/x-step', // Another alternative
  ];

  const fileExtension = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.x_t', '.stp', '.step'];

  // Check both MIME type and file extension
  if (allowedExtensions.includes(fileExtension) || allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Formato de arquivo não suportado: ${fileExtension}. Formatos aceitos: .x_t, .stp, .step`), false);
  }
};

// Multer configuration for CAD files
const uploadCAD = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  }
}).single('cadFile');

// Error handling middleware for upload
const handleUploadError = (err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          status: 'error',
          message: 'Arquivo muito grande. Tamanho máximo: 100MB'
        });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          status: 'error',
          message: 'Campo de arquivo inesperado. Use "cadFile" como nome do campo'
        });
      }
    }
    if (err.message && err.message.includes('Formato de arquivo não suportado')) {
      return res.status(400).json({
        status: 'error',
        message: err.message
      });
    }
    return next(err);
  }
  next();
};

module.exports = {
  uploadCAD: (req, res, next) => {
    uploadCAD(req, res, (err) => {
      handleUploadError(err, req, res, next);
    });
  }
};