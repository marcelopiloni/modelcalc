# ModelCalc - Sistema de Orçamentos CAD

Sistema completo de orçamentos para arquivos CAD com interface web moderna. Desenvolvido em Node.js + Express + MongoDB + Frontend HTML/CSS/JS.

## 🚀 Funcionalidades Implementadas

### 🔐 Sistema de Autenticação
- Registro e login de usuários
- Controle de acesso baseado em roles (Cliente/Fornecedor)
- JWT tokens para autenticação segura
- Criptografia de senhas com bcrypt

### 📊 Gestão Completa de Orçamentos
- Criação, edição e exclusão de orçamentos
- Cálculo automático de custos com materiais e processos
- Sistema de margem de lucro configurável
- Exportação para Excel (.xlsx)
- Status de orçamentos (pending, approved, rejected)

### 🏗️ Gerenciamento de Projetos
- CRUD completo de projetos
- Relacionamento entre projetos e clientes
- Status de projetos (active, completed, cancelled)
- Interface intuitiva para navegação

### 🧱 Catálogo de Materiais
- Cadastro completo de materiais
- Controle de preços e especificações
- Categorização de materiais
- Busca e filtros avançados

### 📁 Upload de Arquivos CAD
- Suporte a formatos: .stp, .step, .x_t
- Upload de arquivos até 100MB
- Vinculação automática com orçamentos
- Armazenamento seguro no servidor

### 🎨 Interface Web Moderna
- Design responsivo e intuitivo
- Navegação por abas (Single Page Application)
- Feedback visual para ações do usuário
- Compatível com todos os navegadores modernos

## 📁 Estrutura do Projeto

```
modelcalc/
├── server.js                     # Servidor Express principal
├── public/                       # Frontend estático
│   ├── index.html               # Interface principal
│   ├── css/styles.css           # Estilos modernos
│   └── js/                      # JavaScript modular
│       ├── app.js              # Aplicação principal
│       ├── auth.js             # Autenticação
│       ├── budgets.js          # Gestão de orçamentos
│       ├── projects.js         # Gestão de projetos
│       ├── materials.js        # Gestão de materiais
│       └── files.js            # Upload de arquivos
├── src/
│   ├── controllers/             # Lógica de negócio
│   │   ├── BudgetController.js
│   │   ├── ClientController.js
│   │   ├── FileController.js
│   │   ├── MaterialController.js
│   │   └── ProjectController.js
│   ├── models/                  # Schemas MongoDB
│   │   ├── Budget.js
│   │   ├── CADFile.js
│   │   ├── Client.js
│   │   ├── Material.js
│   │   └── Project.js
│   ├── routes/                  # Rotas da API
│   │   ├── budgetRoutes.js
│   │   ├── clientRoutes.js
│   │   ├── fileRoutes.js
│   │   ├── materialRoutes.js
│   │   └── projectRoutes.js
│   ├── middleware/              # Middlewares
│   │   ├── upload.js           # Upload de arquivos
│   │   └── validation.js       # Validação de dados
│   └── utils/
│       └── excelExport.js      # Geração de Excel
├── uploads/                     # Arquivos CAD
├── excel/                       # Arquivos Excel gerados
├── .env                         # Variáveis de ambiente
└── package.json
```

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- MongoDB Atlas (ou MongoDB local)
- Git

### Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/marcelopiloni/modelcalc.git
cd modelcalc
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
Crie um arquivo `.env` na raiz do projeto:
```env
PORT=3000
MONGODB_URI=sua_connection_string_mongodb
JWT_SECRET=sua_chave_secreta_jwt
NODE_ENV=development
```

4. **Inicie o servidor:**
```bash
npm start
```

O sistema estará disponível em: **http://localhost:3000**

## 📊 API Endpoints Completa

### 🔐 Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login de usuário
- `GET /api/auth/verify` - Verificar token JWT

### 👥 Clientes
- `GET /api/clients` - Listar clientes
- `POST /api/clients` - Criar cliente
- `GET /api/clients/:id` - Buscar cliente por ID
- `PUT /api/clients/:id` - Atualizar cliente
- `DELETE /api/clients/:id` - Excluir cliente

### 🏗️ Projetos
- `GET /api/projects` - Listar projetos
- `POST /api/projects` - Criar projeto
- `GET /api/projects/:id` - Buscar projeto por ID
- `PUT /api/projects/:id` - Atualizar projeto
- `DELETE /api/projects/:id` - Excluir projeto

### 📊 Orçamentos
- `GET /api/budgets` - Listar orçamentos
- `POST /api/budgets` - Criar orçamento
- `GET /api/budgets/:id` - Buscar orçamento por ID
- `PUT /api/budgets/:id` - Atualizar orçamento
- `DELETE /api/budgets/:id` - Excluir orçamento
- `POST /api/budgets/:id/materials` - Adicionar material
- `POST /api/budgets/:id/processes` - Adicionar processo
- `GET /api/budgets/:id/download/excel` - Download Excel

### 🧱 Materiais
- `GET /api/materials` - Listar materiais
- `POST /api/materials` - Criar material
- `GET /api/materials/:id` - Buscar material por ID
- `PUT /api/materials/:id` - Atualizar material
- `DELETE /api/materials/:id` - Excluir material

### � Arquivos CAD
- `POST /api/files/upload` - Upload arquivo CAD
- `GET /api/files` - Listar arquivos
- `GET /api/files/:id` - Buscar arquivo por ID
- `DELETE /api/files/:id` - Excluir arquivo

## � Como Usar o Sistema

### 1. **Primeiro Acesso**
1. Acesse `http://localhost:3000`
2. Clique em "Registrar" para criar sua conta
3. Escolha o tipo de usuário (Cliente ou Fornecedor)
4. Faça login com suas credenciais

### 2. **Criando um Projeto**
1. Vá para a aba "Projetos"
2. Clique em "Novo Projeto"
3. Preencha os dados do projeto
4. Salve o projeto

### 3. **Cadastrando Materiais**
1. Vá para a aba "Materiais"
2. Clique em "Novo Material"
3. Preencha as especificações e preços
4. Salve o material

### 4. **Criando um Orçamento**
1. Vá para a aba "Orçamentos"
2. Clique em "Novo Orçamento"
3. Selecione o projeto
4. Adicione materiais e processos
5. O sistema calculará automaticamente o valor final
6. Gere o Excel para enviar ao cliente

### 5. **Upload de Arquivos CAD**
1. Vá para a aba "Arquivos"
2. Clique em "Upload CAD"
3. Selecione o arquivo (.stp, .step, .x_t)
4. Vincule ao orçamento correspondente

## 🔧 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação via tokens
- **Bcrypt** - Criptografia de senhas
- **Multer** - Upload de arquivos
- **ExcelJS** - Geração de planilhas

### Frontend
- **HTML5** - Estrutura
- **CSS3** - Estilos modernos
- **JavaScript ES6+** - Interatividade
- **Fetch API** - Requisições HTTP
- **Responsive Design** - Layout adaptável

### Infraestrutura
- **MongoDB Atlas** - Banco de dados na nuvem
- **GitHub** - Controle de versão
- **Heroku/Railway** - Deploy (configurável)

## 🔒 Segurança

- Autenticação JWT com tokens seguros
- Criptografia de senhas com bcrypt
- Validação de dados de entrada
- Controle de acesso baseado em roles
- Upload seguro de arquivos com validação de tipo
- Sanitização de dados para prevenir injeções

## 🚀 Status do Projeto

### ✅ Implementado
- [x] Sistema completo de autenticação
- [x] CRUD de projetos, clientes, materiais e orçamentos
- [x] Upload de arquivos CAD
- [x] Geração de Excel
- [x] Interface web moderna e responsiva
- [x] API RESTful completa
- [x] Integração com MongoDB Atlas
- [x] Sistema de roles (Cliente/Fornecedor)

### 🚧 Em Desenvolvimento
- [ ] Análise automática de arquivos CAD
- [ ] Sistema de notificações por email
- [ ] Relatórios avançados em PDF
- [ ] Dashboard com gráficos
- [ ] Histórico de versões de orçamentos

### 💡 Funcionalidades Futuras
- [ ] Integração com sistemas ERP
- [ ] App mobile
- [ ] Sistema de aprovações workflow
- [ ] Integração com sistemas de pagamento
- [ ] Multi-idiomas (i18n)

## 📞 Suporte

Para dúvidas, sugestões ou reportar bugs:
- Email: marcelopiloni@gmail.com
- GitHub Issues: [Criar issue](https://github.com/marcelopiloni/modelcalc/issues)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.