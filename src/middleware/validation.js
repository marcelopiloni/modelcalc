const Joi = require('joi');
const { validationResult } = require('express-validator');

// Express Validator middleware
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Erro de validação:', errors.array());
        return res.status(400).json({
            status: 'error',
            message: 'Erro de validação',
            errors: errors.array()
        });
    }
    next();
};

// Budget validation schema
const budgetSchema = Joi.object({
  projectId: Joi.string().required(),
  clientId: Joi.string().optional(),
  description: Joi.string().required().min(5).max(500),
  materials: Joi.array().items(Joi.object({
    materialId: Joi.string().optional(),
    name: Joi.string().required().min(2).max(100),
    quantity: Joi.number().required().min(0.001),
    unitCost: Joi.number().required().min(0)
  })).default([]),
  processes: Joi.array().items(Joi.object({
    name: Joi.string().required().min(2).max(100),
    duration: Joi.number().required().min(0.1),
    hourlyRate: Joi.number().required().min(0)
  })).default([]),
  laborCost: Joi.number().min(0).default(0),
  materialCost: Joi.number().min(0).default(0),
  processingCost: Joi.number().min(0).default(0),
  margin: Joi.number().min(0).max(100).default(0),
  status: Joi.string().valid('draft', 'pending', 'approved', 'rejected').default('draft')
});

// Material validation schema
const materialSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  quantity: Joi.number().required().min(0.001),
  unitCost: Joi.number().required().min(0)
});

// Process validation schema
const processSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  duration: Joi.number().required().min(0.1), // hours
  hourlyRate: Joi.number().required().min(0)
});

// Project validation schema
const projectSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  description: Joi.string().required().min(5).max(500),
  clientId: Joi.string().required(),
  status: Joi.string().valid('active', 'completed', 'cancelled').default('active')
});

// Validation middleware functions
const validateBudget = (req, res, next) => {
  const { error, value } = budgetSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Dados inválidos para orçamento',
      details: error.details.map(detail => detail.message)
    });
  }
  
  req.body = value;
  next();
};

const validateMaterial = (req, res, next) => {
  const { error, value } = materialSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Dados inválidos para material',
      details: error.details.map(detail => detail.message)
    });
  }
  
  req.body = value;
  next();
};

const validateProcess = (req, res, next) => {
  const { error, value } = processSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Dados inválidos para processo',
      details: error.details.map(detail => detail.message)
    });
  }
  
  req.body = value;
  next();
};

const validateProject = (req, res, next) => {
  const { error, value } = projectSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Dados inválidos para projeto',
      details: error.details.map(detail => detail.message)
    });
  }
  
  req.body = value;
  next();
};

module.exports = {
  validateRequest,
  validateBudget,
  validateMaterial,
  validateProcess,
  validateProject
};