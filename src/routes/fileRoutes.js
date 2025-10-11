const express = require('express');
const router = express.Router();
const FileController = require('../controllers/FileController');
const { uploadCAD } = require('../middleware/upload');
const auth = require('../middleware/auth');
const downloadAuth = require('../middleware/downloadAuth');
const { isAuthenticated, isManagerOrOperator } = require('../middleware/rbac');

// File upload and management routes
// Todos usuários autenticados podem fazer upload de arquivos CAD
router.post('/upload', auth, isAuthenticated, uploadCAD, FileController.uploadCADFile.bind(FileController));

// Todos usuários autenticados podem visualizar arquivos (com filtros no controller)
router.get('/', auth, isAuthenticated, FileController.getCADFiles.bind(FileController));
router.get('/:id', auth, isAuthenticated, FileController.getCADFileById.bind(FileController));

// Apenas gerentes e operadores podem deletar arquivos
router.delete('/:id', auth, isManagerOrOperator, FileController.deleteCADFile.bind(FileController));

// Todos podem fazer download
router.get('/:id/download', downloadAuth, FileController.downloadCADFile.bind(FileController));

module.exports = router;