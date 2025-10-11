require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcrypt');

async function checkAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/modelcalc');
        console.log('✓ Conectado ao MongoDB\n');

        const admin = await User.findOne({ email: 'admin@modelcalc.com' });
        
        if (!admin) {
            console.log('❌ Admin não encontrado!');
            process.exit(1);
        }

        console.log('📊 Informações do Admin:');
        console.log('- Email:', admin.email);
        console.log('- Role:', admin.role);
        console.log('- Approved:', admin.approved);
        console.log('- Password Hash (10 primeiros chars):', admin.password.substring(0, 10) + '...');
        console.log('- Hash Length:', admin.password.length);
        
        // Testar a senha manualmente
        const testPassword = 'Admin@123';
        console.log('\n🔑 Testando senha:', testPassword);
        
        const isMatch = await bcrypt.compare(testPassword, admin.password);
        console.log('✓ Senha correta?', isMatch ? '✅ SIM' : '❌ NÃO');

        if (!isMatch) {
            console.log('\n⚠️  A senha armazenada não bate com "Admin@123"');
            console.log('Vamos criar um novo hash e comparar...');
            
            const newHash = await bcrypt.hash(testPassword, 10);
            console.log('Novo hash:', newHash.substring(0, 20) + '...');
            
            const newMatch = await bcrypt.compare(testPassword, newHash);
            console.log('Novo hash funciona?', newMatch ? '✅ SIM' : '❌ NÃO');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Erro:', error);
        process.exit(1);
    }
}

checkAdmin();
