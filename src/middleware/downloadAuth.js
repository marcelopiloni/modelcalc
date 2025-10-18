const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para downloads que aceita token via query string ou header
module.exports = async (req, res, next) => {
    try {
        // Verificar se o token está presente no header ou query string
        let token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token && req.query.token) {
            token = req.query.token;
        }
        
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        // Verificar e decodificar o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Buscar usuário
        const user = await User.findOne({ _id: decoded.userId });
        
        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        // Verificar se o usuário está ativo
        if (!user.active) {
            return res.status(401).json({ message: 'Usuário inativo' });
        }

        // Verificar aprovação (exceto admin e manager)
        if (!user.approved && !['admin', 'manager'].includes(user.role)) {
            return res.status(403).json({ message: 'Usuário aguardando aprovação do gerente' });
        }

        // Adicionar informações do usuário ao request
        req.user = {
            userId: user._id,
            userType: user.userType,
            email: user.email,
            name: user.name,
            role: user.role,
            approved: user.approved
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};