const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validation');

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
router.get('/', auth, UserController.getUsers);
router.put('/:id', auth, UserController.updateUser);
router.delete('/:id', auth, UserController.deleteUser);

module.exports = router;