const mongoose = require('mongoose');

const cadFileSchema = new mongoose.Schema({
    originalName: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    format: {
        type: String,
        required: true,
        enum: ['stp', 'step', 'x_t']
    },
    mimetype: {
        type: String,
        required: true
    },
    budgetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Budget',
        default: null
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        default: null
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    processed: {
        type: Boolean,
        default: false
    },
    analysis: {
        volume: { type: Number, default: 0 },
        surfaceArea: { type: Number, default: 0 },
        complexity: { 
            type: String, 
            enum: ['low', 'medium', 'high'],
            default: 'medium'
        },
        estimatedMachiningTime: { type: Number, default: 0 },
        suggestedMaterials: [String],
        manufacturingProcesses: [String]
    }
}, {
    timestamps: true
});

// Index for efficient queries
cadFileSchema.index({ budgetId: 1 });
cadFileSchema.index({ projectId: 1 });
cadFileSchema.index({ uploadedBy: 1 });

module.exports = mongoose.model('CADFile', cadFileSchema);