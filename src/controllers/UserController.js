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

            // Determinar role baseado em userType ou usar role fornecido
            const role = req.body.role || (userType === 'supplier' ? 'operator' : 'client');

            // Criar novo usuário
            const user = new User({
                email,
                password,
                name,
                company,
                userType,
                role,
                approved: role === 'client' ? true : false // Clientes aprovados automaticamente, outros aguardam aprovação
            });

            await user.save();

            // Gerar token JWT
            const token = jwt.sign(
                { userId: user._id, userType: user.userType, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'Usuário criado com sucesso' + (role !== 'client' ? '. Aguardando aprovação do gerente.' : ''),
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    company: user.company,
                    userType: user.userType,
                    role: user.role,
                    approved: user.approved
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
            console.log('🔐 Tentativa de login:', { email, passwordLength: password?.length });

            // Encontrar usuário
            const user = await User.findOne({ email });
            if (!user) {
                console.log('❌ Usuário não encontrado:', email);
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            console.log('✓ Usuário encontrado:', { email: user.email, role: user.role, approved: user.approved });

            // Verificar senha
            const isMatch = await user.comparePassword(password);
            console.log('🔑 Comparação de senha:', { isMatch, passwordProvided: password.substring(0, 3) + '***' });
            
            if (!isMatch) {
                console.log('❌ Senha incorreta');
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            // Verificar se usuário foi aprovado (exceto admin e client)
            if (!user.approved && user.role !== 'client' && user.role !== 'admin') {
                return res.status(403).json({ 
                    message: 'Sua conta está aguardando aprovação do gerente',
                    approved: false
                });
            }

            // Gerar token
            const token = jwt.sign(
                { userId: user._id, userType: user.userType, role: user.role },
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
                    userType: user.userType,
                    role: user.role,
                    approved: user.approved
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

    // ========== MÉTODOS RBAC ==========

    /**
     * Listar usuários pendentes de aprovação (apenas para gerentes)
     */
    async getPendingUsers(req, res) {
        try {
            const pendingUsers = await User.find({ approved: false })
                .select('-password')
                .sort({ createdAt: -1 });

            res.status(200).json({
                status: 'success',
                results: pendingUsers.length,
                data: pendingUsers
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Erro ao buscar usuários pendentes',
                error: error.message
            });
        }
    }

    /**
     * Aprovar usuário (apenas para gerentes)
     */
    async approveUser(req, res) {
        try {
            const { id } = req.params;
            const { approved, role } = req.body;

            const user = await User.findById(id);

            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuário não encontrado'
                });
            }

            // Atualizar status de aprovação
            user.approved = approved !== undefined ? approved : true;
            user.approvedBy = req.user.userId;
            user.approvedAt = new Date();

            // Atualizar role se fornecido
            if (role && ['manager', 'operator', 'client'].includes(role)) {
                user.role = role;
            }

            await user.save();

            res.status(200).json({
                status: 'success',
                message: `Usuário ${approved ? 'aprovado' : 'reprovado'} com sucesso`,
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    approved: user.approved,
                    approvedAt: user.approvedAt
                }
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Erro ao aprovar usuário',
                error: error.message
            });
        }
    }

    /**
     * Atualizar role de um usuário (apenas para gerentes)
     */
    async updateUserRole(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body;

            if (!role || !['manager', 'operator', 'client'].includes(role)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Role inválida. Use: manager, operator ou client'
                });
            }

            const user = await User.findById(id);

            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuário não encontrado'
                });
            }

            // Não permitir que o gerente mude seu próprio role
            if (user._id.toString() === req.user.userId.toString()) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Você não pode alterar sua própria role'
                });
            }

            user.role = role;
            await user.save();

            res.status(200).json({
                status: 'success',
                message: 'Role atualizada com sucesso',
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Erro ao atualizar role do usuário',
                error: error.message
            });
        }
    }

    /**
     * Desativar/Ativar usuário (apenas para gerentes)
     */
    async toggleUserStatus(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findById(id);

            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuário não encontrado'
                });
            }

            // Não permitir que o gerente desative a si mesmo
            if (user._id.toString() === req.user.userId.toString()) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Você não pode desativar sua própria conta'
                });
            }

            user.active = !user.active;
            await user.save();

            res.status(200).json({
                status: 'success',
                message: `Usuário ${user.active ? 'ativado' : 'desativado'} com sucesso`,
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    active: user.active
                }
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Erro ao alterar status do usuário',
                error: error.message
            });
        }
    }

    /**
     * Criar novo usuário (Admin only) - permite criar gerentes
     */
    async createUser(req, res) {
        try {
            const { email, password, name, company, userType, role } = req.body;

            // Validar campos obrigatórios
            if (!email || !password || !name || !company || !userType || !role) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Todos os campos são obrigatórios'
                });
            }

            // Validar role
            const validRoles = ['admin', 'manager', 'operator', 'client'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Role inválida. Use: admin, manager, operator ou client'
                });
            }

            // Verificar se email já existe
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email já cadastrado no sistema'
                });
            }

            // Criar usuário
            const user = new User({
                email,
                password, // Será hasheado pelo pre-save hook
                name,
                company,
                userType,
                role,
                approved: true, // Usuários criados pelo admin são aprovados automaticamente
                approvedBy: req.user.userId,
                approvedAt: new Date()
            });

            await user.save();

            res.status(201).json({
                status: 'success',
                message: `Usuário ${role} criado com sucesso`,
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    company: user.company,
                    userType: user.userType,
                    role: user.role,
                    approved: user.approved
                }
            });
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro ao criar usuário',
                error: error.message
            });
        }
    }

    /**
     * Buscar perfil do usuário logado
     */
    async getMyProfile(req, res) {
        try {
            const user = await User.findById(req.user.userId)
                .select('-password')
                .populate('approvedBy', 'name email');

            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuário não encontrado'
                });
            }

            res.status(200).json({
                status: 'success',
                data: user
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Erro ao buscar perfil',
                error: error.message
            });
        }
    }
}

module.exports = new UserController();