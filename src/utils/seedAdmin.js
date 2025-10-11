const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * Cria um usuário administrador padrão se não existir nenhum admin no sistema
 * Credenciais padrão:
 * - Email: admin@modelcalc.com
 * - Senha: Admin@123
 * 
 * IMPORTANTE: Altere a senha após o primeiro login!
 */
async function seedAdmin() {
    try {
        // Verificar se já existe algum admin
        const existingAdmin = await User.findOne({ role: 'admin' });
        
        if (existingAdmin) {
            console.log('✓ Admin já existe no sistema');
            return;
        }

        // Criar hash da senha padrão
        const hashedPassword = await bcrypt.hash('Admin@123', 10);

        // Criar usuário admin
        const admin = new User({
            name: 'Administrador',
            email: 'admin@modelcalc.com',
            password: hashedPassword,
            company: 'ModelCalc',
            userType: 'supplier',
            role: 'admin',
            approved: true, // Admin sempre aprovado
            isActive: true
        });

        await admin.save();

        console.log('\n' + '='.repeat(60));
        console.log('✓ ADMINISTRADOR CRIADO COM SUCESSO!');
        console.log('='.repeat(60));
        console.log('📧 Email: admin@modelcalc.com');
        console.log('🔑 Senha: Admin@123');
        console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
        console.log('='.repeat(60) + '\n');

    } catch (error) {
        console.error('❌ Erro ao criar administrador:', error.message);
    }
}

module.exports = seedAdmin;
