const express = require('express');
const router = express.Router();
const FileController = require('../controllers/FileController');
const { uploadCAD } = require('../middleware/upload');
const auth = require('../middleware/auth');
const downloadAuth = require('../middleware/downloadAuth');

// File upload and management routes
router.post('/upload', auth, uploadCAD, FileController.uploadCADFile.bind(FileController));
router.get('/', auth, FileController.getCADFiles.bind(FileController));
router.get('/:id', auth, FileController.getCADFileById.bind(FileController));
router.delete('/:id', auth, FileController.deleteCADFile.bind(FileController));
router.get('/:id/download', downloadAuth, FileController.downloadCADFile.bind(FileController));

module.exports = router;