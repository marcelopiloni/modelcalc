const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    unitCost: {
        type: Number,
        required: true,
        min: 0
    },
    totalCost: {
        type: Number
    }
});

const processSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true,
        min: 0
    },
    hourlyRate: {
        type: Number,
        required: true,
        min: 0
    },
    totalCost: {
        type: Number
    }
});

const budgetSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cadFiles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CADFile'
    }],
    materials: [materialSchema],
    processes: [processSchema],
    laborCost: {
        type: Number,
        default: 0,
        min: 0
    },
    materialCost: {
        type: Number,
        default: 0,
        min: 0
    },
    processingCost: {
        type: Number,
        default: 0,
        min: 0
    },
    totalCost: {
        type: Number,
        default: 0,
        min: 0
    },
    margin: {
        type: Number,
        default: 0,
        min: 0
    },
    finalPrice: {
        type: Number,
        default: 0,
        min: 0
    },
    status: {
        type: String,
        enum: ['draft', 'pending', 'approved', 'rejected'],
        default: 'draft'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Middleware para calcular custos antes de salvar
budgetSchema.pre('save', function(next) {
    // Calcular custo total de materiais
    this.materialCost = this.materials.reduce((sum, material) => {
        material.totalCost = material.quantity * material.unitCost;
        return sum + material.totalCost;
    }, 0);

    // Calcular custo total de processos
    this.processingCost = this.processes.reduce((sum, process) => {
        process.totalCost = process.duration * process.hourlyRate;
        return sum + process.totalCost;
    }, 0);

    // Calcular custo total
    this.totalCost = this.laborCost + this.materialCost + this.processingCost;

    // Calcular preço final com margem
    this.finalPrice = this.totalCost * (1 + this.margin / 100);

    next();
});

// Método para adicionar material
budgetSchema.methods.addMaterial = function(material) {
    this.materials.push({
        name: material.name,
        quantity: material.quantity,
        unitCost: material.unitCost
    });
    return this.save();
};

// Método para adicionar processo
budgetSchema.methods.addProcess = function(process) {
    this.processes.push({
        name: process.name,
        duration: process.duration,
        hourlyRate: process.hourlyRate
    });
    return this.save();
};

module.exports = mongoose.model('Budget', budgetSchema);