const CADFile = require('../models/CADFileMongo');
const CADAnalyzer = require('../utils/cadAnalyzer');
const path = require('path');
const fs = require('fs-extra');

class FileController {

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
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        size: file.size,
        format: fileExtension,
        mimetype: file.mimetype,
        budgetId: req.body.budgetId || null,
        projectId: req.body.projectId || null,
        uploadedBy: req.user.userId
      };

      const cadFile = new CADFile(cadFileData);
      await cadFile.save();

      // Analyze CAD file in background
      setImmediate(() => {
        this.analyzeCADFile(cadFile._id, cadFile.path, cadFile.format);
      });

      res.status(201).json({
        status: 'success',
        message: 'Arquivo CAD enviado com sucesso',
        data: cadFile
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
      const { budgetId, projectId } = req.query;
      let query = {};
      
      // Filter by budget or project if specified
      if (budgetId) query.budgetId = budgetId;
      if (projectId) query.projectId = projectId;
      
      // Filter by user permissions
      if (req.user.userType === 'client') {
        // Clients can only see files from their own budgets/projects
        query.uploadedBy = req.user.userId;
      }
      
      const files = await CADFile.find(query)
        .populate('budgetId', 'description')
        .populate('projectId', 'name')
        .populate('uploadedBy', 'name email')
        .sort({ createdAt: -1 });
      
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
      const cadFile = await CADFile.findById(id)
        .populate('budgetId', 'description')
        .populate('projectId', 'name')
        .populate('uploadedBy', 'name email');

      if (!cadFile) {
        return res.status(404).json({
          status: 'error',
          message: 'Arquivo não encontrado'
        });
      }

      // Check permissions
      if (req.user.userType === 'client' && cadFile.uploadedBy._id.toString() !== req.user.userId) {
        return res.status(403).json({
          status: 'error',
          message: 'Acesso não autorizado'
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
      const cadFile = await CADFile.findById(id);

      if (!cadFile) {
        return res.status(404).json({
          status: 'error',
          message: 'Arquivo não encontrado'
        });
      }

      // Check permissions
      if (req.user.userType === 'client' && cadFile.uploadedBy.toString() !== req.user.userId) {
        return res.status(403).json({
          status: 'error',
          message: 'Acesso não autorizado'
        });
      }

      // Remove file from filesystem
      await fs.remove(cadFile.path);
      
      // Remove from database
      await CADFile.findByIdAndDelete(id);

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
      const cadFile = await CADFile.findById(id);

      if (!cadFile) {
        return res.status(404).json({
          status: 'error',
          message: 'Arquivo não encontrado'
        });
      }

      // Check permissions
      if (req.user.userType === 'client' && cadFile.uploadedBy.toString() !== req.user.userId) {
        return res.status(403).json({
          status: 'error',
          message: 'Acesso não autorizado'
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

  // Analyze CAD file using real CAD analyzer
  async analyzeCADFile(fileId, filePath, format) {
    try {
      const cadFile = await CADFile.findById(fileId);
      if (!cadFile) return;

      const analyzer = new CADAnalyzer();
      const analysisResult = await analyzer.analyzeFile(filePath, format);

      await CADFile.findByIdAndUpdate(fileId, { 
        processed: analysisResult.processed, 
        analysis: {
          volume: analysisResult.volume,
          surfaceArea: analysisResult.surfaceArea,
          complexity: analysisResult.complexity,
          estimatedMachiningTime: analysisResult.estimatedMachiningTime,
          suggestedMaterials: analysisResult.suggestedMaterials,
          manufacturingProcesses: analysisResult.manufacturingProcesses
        }
      });
      
      console.log(`✅ Análise CAD concluída para arquivo: ${cadFile.originalName}`);
      console.log(`   Volume estimado: ${analysisResult.volume} cm³`);
      console.log(`   Complexidade: ${analysisResult.complexity}`);
      console.log(`   Tempo estimado: ${analysisResult.estimatedMachiningTime}h`);
    } catch (error) {
      console.error('Erro na análise CAD:', error);
      
      // Fallback to default values if analysis fails
      await CADFile.findByIdAndUpdate(fileId, { 
        processed: false, 
        analysis: {
          volume: 50,
          surfaceArea: 0,
          complexity: 'medium',
          estimatedMachiningTime: 2.5,
          suggestedMaterials: ['Alumínio 6061', 'Aço 1020'],
          manufacturingProcesses: ['Fresamento CNC', 'Torneamento']
        }
      });
    }
  }
}

module.exports = new FileController();