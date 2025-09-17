class Budget {
  constructor(data) {
    this.id = data.id;
    this.projectId = data.projectId;
    this.clientName = data.clientName;
    this.description = data.description;
    this.cadFiles = data.cadFiles || [];
    this.materials = data.materials || [];
    this.processes = data.processes || [];
    this.laborCost = data.laborCost || 0;
    this.materialCost = data.materialCost || 0;
    this.processingCost = data.processingCost || 0;
    this.totalCost = data.totalCost || 0;
    this.margin = data.margin || 0;
    this.finalPrice = data.finalPrice || 0;
    this.status = data.status || 'draft'; // draft, pending, approved, rejected
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  calculateTotalCost() {
    this.totalCost = this.laborCost + this.materialCost + this.processingCost;
    this.finalPrice = this.totalCost * (1 + this.margin / 100);
    this.updatedAt = new Date();
    return this.totalCost;
  }

  addMaterial(material) {
    this.materials.push({
      name: material.name,
      quantity: material.quantity,
      unitCost: material.unitCost,
      totalCost: material.quantity * material.unitCost
    });
    this.updateMaterialCost();
  }

  updateMaterialCost() {
    this.materialCost = this.materials.reduce((sum, material) => sum + material.totalCost, 0);
    this.calculateTotalCost();
  }

  addProcess(process) {
    this.processes.push({
      name: process.name,
      duration: process.duration,
      hourlyRate: process.hourlyRate,
      totalCost: process.duration * process.hourlyRate
    });
    this.updateProcessingCost();
  }

  updateProcessingCost() {
    this.processingCost = this.processes.reduce((sum, process) => sum + process.totalCost, 0);
    this.calculateTotalCost();
  }

  toJSON() {
    return {
      id: this.id,
      projectId: this.projectId,
      clientName: this.clientName,
      description: this.description,
      cadFiles: this.cadFiles,
      materials: this.materials,
      processes: this.processes,
      costs: {
        labor: this.laborCost,
        material: this.materialCost,
        processing: this.processingCost,
        total: this.totalCost
      },
      pricing: {
        margin: this.margin,
        finalPrice: this.finalPrice
      },
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Budget;