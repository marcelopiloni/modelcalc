// controllers/MaterialController.js
const Material = require('../models/Material');
const { v4: uuidv4 } = require('uuid');

class MaterialController {
  constructor() {
    this.materials = new Map();
  }

  async createMaterial(req, res) {
    try {
      const materialData = {
        id: uuidv4(),
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const material = new Material(materialData);
      this.materials.set(material.id, material);

      res.status(201).json({
        status: 'success',
        message: 'Material criado com sucesso',
        data: material.toJSON()
      });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async getAllMaterials(req, res) {
    const list = Array.from(this.materials.values()).map(m => m.toJSON());
    res.json({ status: 'success', results: list.length, data: list });
  }

  async getMaterialById(req, res) {
    const material = this.materials.get(req.params.id);
    if (!material) {
      return res.status(404).json({ status: 'error', message: 'Material não encontrado' });
    }
    res.json({ status: 'success', data: material.toJSON() });
  }

  async updateMaterial(req, res) {
    const material = this.materials.get(req.params.id);
    if (!material) {
      return res.status(404).json({ status: 'error', message: 'Material não encontrado' });
    }
    Object.assign(material, req.body);
    material.updatedAt = new Date();
    res.json({ status: 'success', message: 'Material atualizado', data: material.toJSON() });
  }

  async deleteMaterial(req, res) {
    if (!this.materials.has(req.params.id)) {
      return res.status(404).json({ status: 'error', message: 'Material não encontrado' });
    }
    this.materials.delete(req.params.id);
    res.json({ status: 'success', message: 'Material removido' });
  }
}

module.exports = new MaterialController();
