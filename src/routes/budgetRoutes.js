const express = require('express');
const router = express.Router();
const BudgetController = require('../controllers/BudgetController');
const { validateBudget, validateMaterial, validateProcess } = require('../middleware/validation');
const auth = require('../middleware/auth');

// Budget CRUD routes
router.post('/', auth, validateBudget, BudgetController.createBudget.bind(BudgetController));
router.get('/', auth, BudgetController.getAllBudgets.bind(BudgetController));
router.get('/:id', auth, BudgetController.getBudgetById.bind(BudgetController));
router.get('/:id/download/excel', auth, BudgetController.downloadBudgetExcel.bind(BudgetController));
router.put('/:id', auth, BudgetController.updateBudget.bind(BudgetController));
router.delete('/:id', auth, BudgetController.deleteBudget.bind(BudgetController));

// Budget calculation and management
router.post('/:id/materials', auth, validateMaterial, BudgetController.addMaterial.bind(BudgetController));
router.post('/:id/processes', auth, validateProcess, BudgetController.addProcess.bind(BudgetController));

module.exports = router;