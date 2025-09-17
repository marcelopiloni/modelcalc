const express = require('express');
const router = express.Router();
const FileController = require('../controllers/FileController');
const { uploadCAD } = require('../middleware/upload');

// File upload and management routes
router.post('/upload', uploadCAD, FileController.uploadCADFile.bind(FileController));
router.get('/', FileController.getCADFiles.bind(FileController));
router.get('/:id', FileController.getCADFileById.bind(FileController));
router.delete('/:id', FileController.deleteCADFile.bind(FileController));
router.get('/:id/download', FileController.downloadCADFile.bind(FileController));

module.exports = router;