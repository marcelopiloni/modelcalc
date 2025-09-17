class CADFile {
  constructor(data) {
    this.id = data.id;
    this.originalName = data.originalName;
    this.filename = data.filename;
    this.path = data.path;
    this.size = data.size;
    this.format = data.format; // x_t, stp, step
    this.mimetype = data.mimetype;
    this.uploadedAt = data.uploadedAt || new Date();
    this.processed = data.processed || false;
    this.analysis = data.analysis || {};
    this.budgetId = data.budgetId;
  }

  getFileExtension() {
    return this.originalName.split('.').pop().toLowerCase();
  }

  isValidCADFormat() {
    const validFormats = ['x_t', 'stp', 'step'];
    const extension = this.getFileExtension();
    return validFormats.includes(extension);
  }

  updateAnalysis(analysisData) {
    this.analysis = {
      volume: analysisData.volume || 0,
      surfaceArea: analysisData.surfaceArea || 0,
      complexity: analysisData.complexity || 'medium',
      estimatedMachiningTime: analysisData.estimatedMachiningTime || 0,
      suggestedMaterials: analysisData.suggestedMaterials || [],
      manufacturingProcesses: analysisData.manufacturingProcesses || []
    };
    this.processed = true;
  }

  toJSON() {
    return {
      id: this.id,
      originalName: this.originalName,
      filename: this.filename,
      path: this.path,
      size: this.size,
      format: this.format,
      mimetype: this.mimetype,
      uploadedAt: this.uploadedAt,
      processed: this.processed,
      analysis: this.analysis,
      budgetId: this.budgetId
    };
  }
}

module.exports = CADFile;