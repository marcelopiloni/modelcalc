const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs-extra');

// Import routes
const budgetRoutes = require('./src/routes/budgetRoutes');
const fileRoutes = require('./src/routes/fileRoutes');
const projectRoutes = require('./src/routes/projectRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
fs.ensureDirSync(uploadsDir);

// Static files
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/budgets', budgetRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/projects', projectRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Sistema de Orçamentos CAD - API funcionando',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
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
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 API Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📁 Upload de arquivos CAD disponível em: http://localhost:${PORT}/api/files/upload`);
});

module.exports = app;