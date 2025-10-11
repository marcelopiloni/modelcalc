const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true, // kg, m, m², unidade, etc.
        default: 'unidade'
    },
    unitCost: {
        type: Number,
        required: true,
        min: 0
    },
    supplier: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['metal', 'plastico', 'eletronico', 'ferramenta', 'outro'],
        default: 'outro'
    },
    active: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Material', materialSchema);
