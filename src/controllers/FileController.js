const CADFile = require('../models/CADFileMongo');
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

      // Simulate CAD file analysis (aqui você integraria com biblioteca de análise CAD)
      setTimeout(() => {
        this.simulateCADAnalysis(cadFile._id);
      }, 1000);

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

  // Simulate CAD file analysis (replace with real CAD analysis library)
  async simulateCADAnalysis(fileId) {
    try {
      const cadFile = await CADFile.findById(fileId);
      if (!cadFile) return;

      const analysisData = {
        volume: Math.random() * 1000 + 50, // cm³
        surfaceArea: Math.random() * 500 + 100, // cm²
        complexity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        estimatedMachiningTime: Math.random() * 8 + 1, // hours
        suggestedMaterials: ['Alumínio 6061', 'Aço Carbono', 'Aço Inox 316'],
        manufacturingProcesses: ['Usinagem CNC', 'Torneamento', 'Fresamento']
      };

      await CADFile.findByIdAndUpdate(fileId, { 
        processed: true, 
        analysis: analysisData 
      });
      
      console.log(`✅ Análise CAD concluída para arquivo: ${cadFile.originalName}`);
    } catch (error) {
      console.error('Erro na simulação de análise CAD:', error);
    }
  }
}

module.exports = new FileController();