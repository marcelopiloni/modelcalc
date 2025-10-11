require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function resetAdmin() {
    try {
        // Conectar ao MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/modelcalc');
        console.log('✓ Conectado ao MongoDB');

        // Deletar admin existente
        const result = await User.deleteOne({ email: 'admin@modelcalc.com' });
        console.log(`✓ Admin antigo removido (${result.deletedCount} documento(s))`);

        // Executar seed novamente
        const seedAdmin = require('./src/utils/seedAdmin');
        await seedAdmin();

        console.log('\n✓ Admin resetado com sucesso!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao resetar admin:', error);
        process.exit(1);
    }
}

resetAdmin();
