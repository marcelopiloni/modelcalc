const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validation');
const { isAdmin, isManager, isAdminOrManager, isAuthenticated } = require('../middleware/rbac');

// Validação para registro de usuário
const registerValidation = [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres'),
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('company').notEmpty().withMessage('Empresa é obrigatória'),
    body('userType').isIn(['client', 'supplier']).withMessage('Tipo de usuário inválido')
];

// Validação para login
const loginValidation = [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Senha é obrigatória')
];

// Rotas públicas
router.post('/register', registerValidation, validateRequest, UserController.register);
router.post('/login', loginValidation, validateRequest, UserController.login);

// Rotas protegidas
router.get('/', auth, isAdminOrManager, UserController.getUsers);
router.put('/:id', auth, UserController.updateUser);
router.delete('/:id', auth, isAdmin, UserController.deleteUser);

// ========== ROTAS RBAC ==========

// Perfil do usuário logado
router.get('/me', auth, isAuthenticated, UserController.getMyProfile);

// Rotas de gerenciamento de usuários (gerentes e admin)
router.get('/pending', auth, isManager, UserController.getPendingUsers);
router.patch('/:id/approve', auth, isManager, UserController.approveUser);
router.patch('/:id/role', auth, isManager, UserController.updateUserRole);
router.patch('/:id/toggle-status', auth, isManager, UserController.toggleUserStatus);

// Rota para admin criar usuários (incluindo gerentes)
router.post('/create', auth, isAdmin, [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres'),
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('company').notEmpty().withMessage('Empresa é obrigatória'),
    body('userType').isIn(['client', 'supplier']).withMessage('Tipo de usuário inválido'),
    body('role').isIn(['admin', 'manager', 'operator', 'client']).withMessage('Role inválida')
], validateRequest, UserController.createUser);

module.exports = router;