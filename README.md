# Sistema de Controle de Orçamentos CAD

Sistema backend em Node.js com arquitetura MVC para controle de orçamentos com upload e análise de arquivos CAD (formatos .x_t e .stp/.step).

## 🚀 Funcionalidades

### Core Features:
- Upload de arquivos CAD (.x_t, .stp, .step) até 100MB
- Sistema completo de orçamentos com cálculo automático
- Gerenciamento de projetos e clientes
- Análise simulada de arquivos CAD (volume, área, complexidade)
- API RESTful completa com validação de dados
- Controle de materiais e processos de fabricação
- Cálculo de custos com margem de lucro

### Design Elements:
- Arquitetura MVC bem estruturada
- Middleware de validação com Joi
- Sistema de upload robusto com Multer
- Tratamento de erros centralizado
- Armazenamento seguro de arquivos

## 📁 Estrutura do Projeto

```
├── server.js                 # Servidor principal
├── src/
│   ├── controllers/          # Controladores (lógica de negócio)
│   │   ├── BudgetController.js
│   │   ├── FileController.js
│   │   └── ProjectController.js
│   ├── models/               # Modelos de dados
│   │   ├── Budget.js
│   │   ├── CADFile.js
│   │   └── Project.js
│   ├── routes/               # Definição das rotas
│   │   ├── budgetRoutes.js
│   │   ├── fileRoutes.js
│   │   └── projectRoutes.js
│   └── middleware/           # Middlewares
│       ├── upload.js
│       └── validation.js
├── uploads/                  # Diretório de arquivos
└── package.json
```

## 🛠️ Instalação e Uso

1. **Instalar dependências:**
```bash
npm install
```

2. **Iniciar servidor de desenvolvimento:**
```bash
npm run dev
```

3. **Iniciar servidor de produção:**
```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`

## 📊 API Endpoints

### Health Check
- `GET /api/health` - Status da API

### Projetos
- `POST /api/projects` - Criar projeto
- `GET /api/projects` - Listar projetos
- `GET /api/projects/:id` - Buscar projeto
- `PUT /api/projects/:id` - Atualizar projeto
- `DELETE /api/projects/:id` - Excluir projeto

### Orçamentos
- `POST /api/budgets` - Criar orçamento
- `GET /api/budgets` - Listar orçamentos
- `GET /api/budgets/:id` - Buscar orçamento
- `PUT /api/budgets/:id` - Atualizar orçamento
- `DELETE /api/budgets/:id` - Excluir orçamento
- `POST /api/budgets/:id/materials` - Adicionar material
- `POST /api/budgets/:id/processes` - Adicionar processo
- `POST /api/budgets/:id/calculate` - Calcular orçamento

### Arquivos CAD
- `POST /api/files/upload` - Upload de arquivo CAD
- `GET /api/files` - Listar arquivos
- `GET /api/files/:id` - Buscar arquivo
- `GET /api/files/:id/download` - Download arquivo
- `DELETE /api/files/:id` - Excluir arquivo

## 📤 Como Usar o Upload

Para fazer upload de um arquivo CAD, use um cliente HTTP como Postman:

```
POST /api/files/upload
Content-Type: multipart/form-data

cadFile: [arquivo .x_t ou .stp]
budgetId: [opcional - ID do orçamento]
```

## 📋 Exemplo de Uso Completo

1. **Criar um projeto:**
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Projeto Teste",
    "description": "Descrição do projeto",
    "clientName": "Cliente Teste",
    "clientEmail": "cliente@email.com"
  }'
```

2. **Criar um orçamento:**
```bash
curl -X POST http://localhost:3000/api/budgets \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Cliente Teste",
    "description": "Peça para usinagem",
    "laborCost": 100,
    "margin": 20
  }'
```

3. **Upload arquivo CAD:**
```bash
curl -X POST http://localhost:3000/api/files/upload \
  -F "cadFile=@/caminho/para/arquivo.stp"
```

4. **Adicionar material ao orçamento:**
```bash
curl -X POST http://localhost:3000/api/budgets/{budget-id}/materials \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alumínio 6061",
    "quantity": 2.5,
    "unitCost": 15.00
  }'
```

## 🔧 Configurações

- **Tamanho máximo de arquivo:** 100MB
- **Formatos suportados:** .x_t, .stp, .step
- **Porta padrão:** 3000
- **Armazenamento:** In-memory (substituir por banco de dados em produção)

## 🚀 Próximos Passos

- Integrar banco de dados (PostgreSQL/MongoDB)
- Implementar autenticação JWT
- Adicionar biblioteca real de análise CAD
- Criar sistema de notificações
- Implementar relatórios em PDF