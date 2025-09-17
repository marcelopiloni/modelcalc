const CADFile = require('../models/CADFile');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs-extra');

class FileController {
  constructor() {
    this.cadFiles = new Map(); // In-memory storage
  }

  async uploadCADFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: 'error',
          message: 'Nenhum arquivo foi enviado'
        });
      }

      const file = req.file;
      const fileExtension = path.extname(file.originalname).toLowerCase().replace('.', '');
      
      // Validate file format
      const validFormats = ['x_t', 'stp', 'step'];
      if (!validFormats.includes(fileExtension)) {
        // Remove uploaded file
        await fs.remove(file.path);
        
        return res.status(400).json({
          status: 'error',
          message: `Formato de arquivo não suportado. Formatos aceitos: ${validFormats.join(', ')}`
        });
      }

      const cadFileData = {
        id: uuidv4(),
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        size: file.size,
        format: fileExtension,
        mimetype: file.mimetype,
        uploadedAt: new Date(),
        budgetId: req.body.budgetId || null
      };

      const cadFile = new CADFile(cadFileData);
      this.cadFiles.set(cadFile.id, cadFile);

      // Simulate CAD file analysis (aqui você integraria com biblioteca de análise CAD)
      setTimeout(() => {
        this.simulateCADAnalysis(cadFile.id);
      }, 1000);

      res.status(201).json({
        status: 'success',
        message: 'Arquivo CAD enviado com sucesso',
        data: cadFile.toJSON()
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Erro ao fazer upload do arquivo',
        error: error.message
      });
    }
  }

  async getCADFiles(req, res) {
    try {
      const files = Array.from(this.cadFiles.values()).map(file => file.toJSON());
      
      res.status(200).json({
        status: 'success',
        results: files.length,
        data: files
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Erro ao buscar arquivos',
        error: error.message
      });
    }
  }

  async getCADFileById(req, res) {
    try {
      const { id } = req.params;
      const cadFile = this.cadFiles.get(id);

      if (!cadFile) {
        return res.status(404).json({
          status: 'error',
          message: 'Arquivo não encontrado'
        });
      }

      res.status(200).json({
        status: 'success',
        data: cadFile.toJSON()
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Erro ao buscar arquivo',
        error: error.message
      });
    }
  }

  async deleteCADFile(req, res) {
    try {
      const { id } = req.params;
      const cadFile = this.cadFiles.get(id);

      if (!cadFile) {
        return res.status(404).json({
          status: 'error',
          message: 'Arquivo não encontrado'
        });
      }

      // Remove file from filesystem
      await fs.remove(cadFile.path);
      
      // Remove from memory storage
      this.cadFiles.delete(id);

      res.status(200).json({
        status: 'success',
        message: 'Arquivo excluído com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Erro ao excluir arquivo',
        error: error.message
      });
    }
  }

  async downloadCADFile(req, res) {
    try {
      const { id } = req.params;
      const cadFile = this.cadFiles.get(id);

      if (!cadFile) {
        return res.status(404).json({
          status: 'error',
          message: 'Arquivo não encontrado'
        });
      }

      if (!await fs.pathExists(cadFile.path)) {
        return res.status(404).json({
          status: 'error',
          message: 'Arquivo físico não encontrado'
        });
      }

      res.download(cadFile.path, cadFile.originalName);
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Erro ao fazer download do arquivo',
        error: error.message
      });
    }
  }

  // Simulate CAD file analysis (replace with real CAD analysis library)
  simulateCADAnalysis(fileId) {
    const cadFile = this.cadFiles.get(fileId);
    if (!cadFile) return;

    const analysisData = {
      volume: Math.random() * 1000 + 50, // cm³
      surfaceArea: Math.random() * 500 + 100, // cm²
      complexity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      estimatedMachiningTime: Math.random() * 8 + 1, // hours
      suggestedMaterials: ['Alumínio 6061', 'Aço Carbono', 'Aço Inox 316'],
      manufacturingProcesses: ['Usinagem CNC', 'Torneamento', 'Fresamento']
    };

    cadFile.updateAnalysis(analysisData);
    console.log(`✅ Análise CAD concluída para arquivo: ${cadFile.originalName}`);
  }
}

module.exports = new FileController();