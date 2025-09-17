const express = require('express');
const router = express.Router();
const BudgetController = require('../controllers/BudgetController');
const { validateBudget, validateMaterial, validateProcess } = require('../middleware/validation');

// Budget CRUD routes
router.post('/', validateBudget, BudgetController.createBudget.bind(BudgetController));
router.get('/', BudgetController.getAllBudgets.bind(BudgetController));
router.get('/:id', BudgetController.getBudgetById.bind(BudgetController));
router.get('/:id/download/excel', BudgetController.downloadBudgetExcel.bind(BudgetController));
router.put('/:id', BudgetController.updateBudget.bind(BudgetController));
router.delete('/:id', BudgetController.deleteBudget.bind(BudgetController));

// Budget calculation and management
router.post('/:id/materials', validateMaterial, BudgetController.addMaterial.bind(BudgetController));
router.post('/:id/processes', validateProcess, BudgetController.addProcess.bind(BudgetController));
router.post('/:id/calculate', BudgetController.calculateBudget.bind(BudgetController));

module.exports = router;