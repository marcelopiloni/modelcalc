const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        // Verificar se o token está presente no header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
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

        // Adicionar informações do usuário ao request
        req.user = {
            userId: user._id,
            userType: user.userType
        };

        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido', error: error.message });
    }
};