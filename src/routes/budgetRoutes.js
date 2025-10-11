const express = require('express');
const router = express.Router();
const BudgetController = require('../controllers/BudgetController');
const { validateBudget, validateMaterial, validateProcess } = require('../middleware/validation');
const auth = require('../middleware/auth');
const downloadAuth = require('../middleware/downloadAuth');
const { isManagerOrOperator, isAuthenticated } = require('../middleware/rbac');

// Budget CRUD routes
// Apenas gerentes e operadores podem criar orçamentos
router.post('/', auth, isManagerOrOperator, validateBudget, BudgetController.createBudget.bind(BudgetController));

// Todos usuários autenticados podem listar (com filtros aplicados no controller)
router.get('/', auth, isAuthenticated, BudgetController.getAllBudgets.bind(BudgetController));
router.get('/:id', auth, isAuthenticated, BudgetController.getBudgetById.bind(BudgetController));

// Downloads disponíveis para todos autenticados
router.get('/:id/download/excel', downloadAuth, BudgetController.downloadBudgetExcel.bind(BudgetController));
router.get('/:id/download/pdf', downloadAuth, BudgetController.downloadBudgetPDF.bind(BudgetController));

// Apenas gerentes e operadores podem atualizar/deletar
router.put('/:id', auth, isManagerOrOperator, BudgetController.updateBudget.bind(BudgetController));
router.delete('/:id', auth, isManagerOrOperator, BudgetController.deleteBudget.bind(BudgetController));

// Budget calculation and management (apenas gerentes e operadores)
router.post('/:id/materials', auth, isManagerOrOperator, validateMaterial, BudgetController.addMaterial.bind(BudgetController));
router.post('/:id/processes', auth, isManagerOrOperator, validateProcess, BudgetController.addProcess.bind(BudgetController));

module.exports = router;