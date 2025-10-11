const User = require('../models/User');
const jwt = require('jsonwebtoken');

class UserController {
    async register(req, res) {
        try {
            console.log('Dados recebidos para registro:', req.body);
            const { email, password, name, company, userType } = req.body;

            // Verificar se usuário já existe
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email já cadastrado' });
            }

            // Criar novo usuário
            const user = new User({
                email,
                password,
                name,
                company,
                userType
            });

            await user.save();

            // Gerar token JWT
            const token = jwt.sign(
                { userId: user._id, userType: user.userType },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'Usuário criado com sucesso',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    company: user.company,
                    userType: user.userType
                }
            });
        } catch (error) {
            console.error('Erro no registro:', error);
            res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Encontrar usuário
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            // Verificar senha
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            // Gerar token
            const token = jwt.sign(
                { userId: user._id, userType: user.userType },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    company: user.company,
                    userType: user.userType
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
        }
    }

    async getUsers(req, res) {
        try {
            // Apenas usuários do tipo 'supplier' podem listar todos os usuários
            if (req.user.userType !== 'supplier') {
                return res.status(403).json({ message: 'Acesso não autorizado' });
            }

            const users = await User.find({}, '-password');
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
        }
    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;

            // Não permitir atualização de senha por esta rota
            delete updates.password;

            // Apenas permitir que usuários atualizem seus próprios dados ou sejam suppliers
            if (req.user.userType !== 'supplier' && req.user.userId !== id) {
                return res.status(403).json({ message: 'Acesso não autorizado' });
            }

            const user = await User.findByIdAndUpdate(
                id,
                updates,
                { new: true, runValidators: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message });
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;

            // Apenas suppliers podem deletar usuários
            if (req.user.userType !== 'supplier') {
                return res.status(403).json({ message: 'Acesso não autorizado' });
            }

            const user = await User.findByIdAndDelete(id);
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            res.json({ message: 'Usuário deletado com sucesso' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar usuário', error: error.message });
        }
    }
}

module.exports = new UserController();