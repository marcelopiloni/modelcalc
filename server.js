require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs-extra');

// Import routes
const userRoutes = require('./src/routes/userRoutes');
const clientRoutes = require('./src/routes/clientRoutes');
const materialRoutes = require('./src/routes/materialRoutes');
const budgetRoutes = require('./src/routes/budgetRoutes');
const fileRoutes = require('./src/routes/fileRoutes');
const projectRoutes = require('./src/routes/projectRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/modelcalc', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('📦 Conectado ao MongoDB'))
.catch(err => {
    console.error('❌ Erro ao conectar ao MongoDB:', err);
    process.exit(1);
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const excelDir = path.join(__dirname, 'excel');
fs.ensureDirSync(uploadsDir);
fs.ensureDirSync(excelDir);

// Static files
app.use('/uploads', express.static(uploadsDir));
app.use('/excel', express.static(excelDir));

// API Routes
app.use('/api/auth', userRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/materials', materialRoutes);

// API Info route
app.get('/api', (req, res) => {
    res.json({
        name: 'ModelCalc API',
        version: '1.0.0',
        description: 'Sistema de Orçamentos CAD',
        endpoints: {
            auth: '/api/auth',
            budgets: '/api/budgets',
            files: '/api/files',
            projects: '/api/projects',
            clients: '/api/clients',
            materials: '/api/materials'
        }
    });
});

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Sistema de Orçamentos CAD - API funcionando',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV,
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    // Handling MongoDB validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            message: 'Erro de validação',
            errors: Object.values(err.errors).map(e => e.message)
        });
    }

    // Handling MongoDB duplicate key errors
    if (err.code === 11000) {
        return res.status(400).json({
            status: 'error',
            message: 'Dados duplicados',
            field: Object.keys(err.keyPattern)[0]
        });
    }

    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Erro interno do servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Rota não encontrada',
        path: req.originalUrl,
        availableEndpoints: [
            '/api/auth',
            '/api/budgets',
            '/api/files',
            '/api/projects',
            '/api/clients',
            '/api/materials'
        ]
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
🚀 Servidor ModelCalc rodando!

🌐 URLs:
   API: http://localhost:${PORT}/api
   Health Check: http://localhost:${PORT}/api/health
   Documentação: http://localhost:${PORT}/api-docs

🔐 Autenticação:
   Login: http://localhost:${PORT}/api/auth/login
   Registro: http://localhost:${PORT}/api/auth/register

📁 Upload:
   Arquivos CAD: http://localhost:${PORT}/api/files/upload

🔧 Ambiente: ${process.env.NODE_ENV || 'development'}
    `);
});

module.exports = app;