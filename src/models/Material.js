// models/Material.js
class Material {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.density = data.density; // g/cm³
    this.costPerKg = data.costPerKg;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      density: this.density,
      costPerKg: this.costPerKg,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Material;
