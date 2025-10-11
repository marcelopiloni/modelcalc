# ModelCalc - Sistema de Orçamentos CAD# ModelCalc - Sistema de Orçamentos CAD



Sistema completo de orçamentos para arquivos CAD com interface web moderna, análise automática de arquivos e dashboard integrado. Desenvolvido em Node.js + Express + MongoDB + Frontend HTML/CSS/JS.Sistema completo de orçamentos para arquivos CAD com interface web moderna. Desenvolvido em Node.js + Express + MongoDB + Frontend HTML/CSS/JS.

### 📁 Arq## 📞 Com### 📁 Arqu## 📖 Como Usar o Sistema

## 🚀 Funcionalidades Implementadas

### 1. **Primeiro Acesso**

### 🔐 Sistema de Autenticação1. Acesse `http://localhost:3000`

- Registro e login de usuários2. Clique em "Registrar" para criar sua conta

- Controle de acesso baseado em roles (Cliente/Fornecedor)3. Escolha o tipo de usuário (Cliente ou Fornecedor)

- JWT tokens para autenticação segura4. Faça login com suas credenciais

- Criptografia de senhas com bcrypt5. Você será redirecionado para o **Dashboard**



### 🎯 Dashboard Intuitivo### 2. **Dashboard Inicial**

- Visão geral com estatísticas em tempo real1. Visualize estatísticas de projetos, orçamentos, materiais e arquivos

- Cards interativos mostrando totais de projetos, orçamentos, materiais e arquivos CAD2. Acesse orçamentos recentes clicando diretamente neles

- Lista de orçamentos recentes com valores3. Veja projetos em andamento

- Projetos em andamento com informações do cliente4. Use as ações rápidas para criar novos registros

- Ações rápidas para criar novos registros

- Atualização automática dos dados### 3. **Criando um Projeto**

- `POST /api/files/upload` - Upload arquivo CAD

### 📊 Gestão Completa de Orçamentos- `GET /api/files` - Listar arquivos

- Criação, edição e exclusão de orçamentos- `GET /api/files/:id` - **Buscar arquivo por ID (com análise)**

- Cálculo automático de custos com materiais e processos- `GET /api/files/:id/download` - Download arquivo

- Sistema de margem de lucro configurável- `DELETE /api/files/:id` - Excluir arquivor o Sistema

- **Exportação para Excel (.xlsx)** com formatação profissional

- **Exportação para PDF** com layout detalhado### 1. **Primeiro Acesso**

- Vinculação com arquivos CAD para análise automática1. Acesse `http://localhost:3000`

- Status de orçamentos (draft, pending, approved, rejected)2. Clique em "Registrar" para criar sua conta

3. Escolha o tipo de usuário (Cliente ou Fornecedor)

### 🏗️ Gerenciamento de Projetos4. Faça login com suas credenciais

- CRUD completo de projetos5. Você será redirecionado para o **Dashboard**

- Relacionamento entre projetos e clientes

- Status de projetos (active, completed, cancelled)### 2. **Dashboard Inicial**

- Interface intuitiva para navegação1. Visualize estatísticas de projetos, orçamentos, materiais e arquivos

2. Acesse orçamentos recentes clicando diretamente neles

### 🧱 Catálogo de Materiais3. Veja projetos em andamento

- Cadastro completo de materiais4. Use as ações rápidas para criar novos registros

- Controle de preços e especificações

- Categorização de materiais### 3. **Criando um Projeto**

- Auto-preenchimento em orçamentos- `POST /api/files/upload` - Upload arquivo CAD

- Busca e filtros avançados- `GET /api/files` - Listar arquivos

- `GET /api/files/:id` - **Buscar arquivo por ID (com análise)**

### 📁 Upload e Análise de Arquivos CAD- `GET /api/files/:id/download` - Download arquivo

- **Suporte a formatos**: .stp, .step, .x_t (Parasolid)- `DELETE /api/files/:id` - Excluir arquivo🚀 Funcionalidades Implementadas

- Upload de arquivos até 100MB

- **Análise automática de arquivos CAD** com extração de:### 🔐 Sistema de Autenticação

  - Volume estimado (cm³)- Registro e login de usuários

  - Complexidade (low, medium, high)- Controle de acesso baseado em roles (Cliente/Fornecedor)

  - Tempo de usinagem estimado- JWT tokens para autenticação segura

  - Materiais sugeridos- Criptografia de senhas com bcrypt

  - Processos de fabricação recomendados

- **Integração com orçamentos**: seleção de arquivos CAD e preenchimento automático### 📊 Dashboard Executivo

- Botão "Auto-completar com dados do CAD" para sugerir materiais e processos- Visão geral com estatísticas em tempo real

- Vinculação automática com projetos e orçamentos- Contadores de projetos ativos, orçamentos, materiais e arquivos CAD

- Armazenamento seguro no servidor- Lista de orçamentos recentes com valores

- Projetos em andamento com informações do cliente

### 🎨 Interface Web Moderna- Ações rápidas para criar novos registros

- Design responsivo e intuitivo- Atualização automática a cada 5 minutos

- Dashboard principal com visão geral

- Navegação por abas (Single Page Application)### 📊 Gestão Completa de Orçamentos

- Feedback visual para ações do usuário- Criação, edição e exclusão de orçamentos

- Modais para seleção de arquivos CAD- Cálculo automático de custos com materiais e processos

- Compatível com todos os navegadores modernos- Sistema de margem de lucro configurável

- **Exportação para Excel (.xlsx)**

## 📁 Estrutura do Projeto- **Exportação para PDF com formatação profissional**

- Status de orçamentos (draft, pending, approved, rejected)

```- Vinculação com arquivos CAD

modelcalc/- Auto-preenchimento baseado em análise CAD

├── server.js                     # Servidor Express principal

├── public/                       # Frontend estático### 🏗️ Gerenciamento de Projetos

│   ├── index.html               # Interface principal- CRUD completo de projetos

│   ├── css/styles.css           # Estilos modernos com dashboard- Relacionamento entre projetos e clientes

│   └── js/                      # JavaScript modular- Status de projetos (active, completed, cancelled)

│       ├── app.js              # Aplicação principal- Interface intuitiva para navegação

│       ├── auth.js             # Autenticação

│       ├── budgets.js          # Gestão de orçamentos (Excel + PDF)### 🧱 Catálogo de Materiais

│       ├── projects.js         # Gestão de projetos- Cadastro completo de materiais

│       ├── materials.js        # Gestão de materiais- Controle de preços e especificações

│       ├── files.js            # Upload de arquivos- Categorização de materiais

│       ├── dashboard.js        # Dashboard com estatísticas- Integração com orçamentos via dropdown

│       └── cadIntegration.js   # Integração CAD com orçamentos- Busca e filtros avançados

├── src/

│   ├── controllers/             # Lógica de negócio### 📁 Upload e Análise de Arquivos CAD

│   │   ├── BudgetController.js # Inclui endpoints Excel e PDF- Suporte a formatos: .stp, .step, .x_t

│   │   ├── ClientController.js- Upload de arquivos até 100MB

│   │   ├── FileController.js   # Upload e análise CAD- **Análise automática de arquivos CAD**

│   │   ├── MaterialController.js- Extração de volume, complexidade e tempo estimado

│   │   └── ProjectController.js- Sugestão inteligente de materiais e processos

│   ├── models/                  # Schemas MongoDB- Vinculação com orçamentos e projetos

│   │   ├── Budget.js- **Integração CAD-Orçamento**: seleção de múltiplos arquivos por orçamento

│   │   ├── CADFile.js          # Modelo com análise- **Auto-fill de orçamentos** baseado em dados extraídos do CAD

│   │   ├── Client.js- Armazenamento seguro no servidor

│   │   ├── Material.js

│   │   └── Project.js### 🎨 Interface Web Moderna

│   ├── routes/                  # Rotas da API- Design responsivo e intuitivo

│   │   ├── budgetRoutes.js     # Rotas Excel e PDF- Navegação por abas (Single Page Application)

│   │   ├── clientRoutes.js- Dashboard inicial com métricas visuais

│   │   ├── fileRoutes.js- Modal para seleção de arquivos CAD

│   │   ├── materialRoutes.js- Event listeners modernos (sem onclick inline)

│   │   └── projectRoutes.js- Feedback visual para ações do usuário

│   ├── middleware/              # Middlewares- Compatível com todos os navegadores modernos

│   │   ├── auth.js             # Autenticação JWT

│   │   ├── downloadAuth.js     # Auth para downloads## 📁 Estrutura do Projeto

│   │   ├── upload.js           # Upload de arquivos

│   │   └── validation.js       # Validação de dados```

│   └── utils/modelcalc/

│       ├── excelExport.js      # Geração de Excel├── server.js                     # Servidor Express principal

│       ├── pdfExport.js        # Geração de PDF com PDFKit├── public/                       # Frontend estático

│       └── cadAnalyzer.js      # Análise de arquivos CAD│   ├── index.html               # Interface principal

├── uploads/                     # Arquivos CAD uploadados│   ├── css/styles.css           # Estilos modernos (com dashboard)

├── excel/                       # Arquivos Excel gerados│   └── js/                      # JavaScript modular

├── .env                         # Variáveis de ambiente│       ├── app.js              # Aplicação principal

└── package.json│       ├── auth.js             # Autenticação

```│       ├── budgets.js          # Gestão de orçamentos

│       ├── projects.js         # Gestão de projetos

## 🛠️ Instalação e Configuração│       ├── materials.js        # Gestão de materiais

│       ├── files.js            # Upload de arquivos

### Pré-requisitos│       ├── dashboard.js        # Dashboard executivo (NOVO)

- Node.js 18+ │       └── cadIntegration.js   # Integração CAD-Orçamento (NOVO)

- MongoDB Atlas (ou MongoDB local)├── src/

- Git│   ├── controllers/             # Lógica de negócio

│   │   ├── BudgetController.js  # + Download PDF

### Instalação│   │   ├── ClientController.js

│   │   ├── FileController.js    # + Análise CAD

1. **Clone o repositório:**│   │   ├── MaterialController.js

```bash│   │   └── ProjectController.js

git clone https://github.com/marcelopiloni/modelcalc.git│   ├── models/                  # Schemas MongoDB

cd modelcalc│   │   ├── Budget.js

```│   │   ├── CADFile.js

│   │   ├── Client.js

2. **Instale as dependências:**│   │   ├── Material.js

```bash│   │   └── Project.js

npm install│   ├── routes/                  # Rotas da API

```│   │   ├── budgetRoutes.js      # + Rota PDF

│   │   ├── clientRoutes.js

3. **Configure as variáveis de ambiente:**│   │   ├── fileRoutes.js

Crie um arquivo `.env` na raiz do projeto:│   │   ├── materialRoutes.js

```env│   │   └── projectRoutes.js

PORT=3000│   ├── middleware/              # Middlewares

MONGODB_URI=sua_connection_string_mongodb│   │   ├── upload.js           # Upload de arquivos

JWT_SECRET=sua_chave_secreta_jwt│   │   ├── validation.js       # Validação de dados

NODE_ENV=development│   │   └── downloadAuth.js     # Auth para downloads

```│   └── utils/

│       ├── excelExport.js      # Geração de Excel

4. **Inicie o servidor:**│       ├── pdfExport.js        # Geração de PDF (NOVO)

```bash│       └── cadAnalyzer.js      # Análise de arquivos CAD (NOVO)

npm start├── uploads/                     # Arquivos CAD

```├── excel/                       # Arquivos Excel gerados

├── .env                         # Variáveis de ambiente

O sistema estará disponível em: **http://localhost:3000**└── package.json                 # + pdfkit

```

## 📊 API Endpoints Completa

## 🛠️ Instalação e Configuração

### 🔐 Autenticação

- `POST /api/auth/register` - Registrar usuário### Pré-requisitos

- `POST /api/auth/login` - Login de usuário- Node.js 18+ 

- `GET /api/auth/verify` - Verificar token JWT- MongoDB Atlas (ou MongoDB local)

- Git

### 👥 Clientes

- `GET /api/clients` - Listar clientes### Instalação

- `POST /api/clients` - Criar cliente

- `GET /api/clients/:id` - Buscar cliente por ID1. **Clone o repositório:**

- `PUT /api/clients/:id` - Atualizar cliente```bash

- `DELETE /api/clients/:id` - Excluir clientegit clone https://github.com/marcelopiloni/modelcalc.git

cd modelcalc

### 🏗️ Projetos```

- `GET /api/projects` - Listar projetos

- `POST /api/projects` - Criar projeto2. **Instale as dependências:**

- `GET /api/projects/:id` - Buscar projeto por ID```bash

- `PUT /api/projects/:id` - Atualizar projetonpm install

- `DELETE /api/projects/:id` - Excluir projeto```



### 📊 Orçamentos3. **Configure as variáveis de ambiente:**

- `GET /api/budgets` - Listar orçamentosCrie um arquivo `.env` na raiz do projeto:

- `POST /api/budgets` - Criar orçamento```env

- `GET /api/budgets/:id` - Buscar orçamento por IDPORT=3000

- `PUT /api/budgets/:id` - Atualizar orçamentoMONGODB_URI=sua_connection_string_mongodb

- `DELETE /api/budgets/:id` - Excluir orçamentoJWT_SECRET=sua_chave_secreta_jwt

- `POST /api/budgets/:id/materials` - Adicionar materialNODE_ENV=development

- `POST /api/budgets/:id/processes` - Adicionar processo```

- `GET /api/budgets/:id/download/excel` - **Download Excel**

- `GET /api/budgets/:id/download/pdf` - **Download PDF**4. **Inicie o servidor:**

```bash

### 🧱 Materiaisnpm start

- `GET /api/materials` - Listar materiais```

- `POST /api/materials` - Criar material

- `GET /api/materials/:id` - Buscar material por IDO sistema estará disponível em: **http://localhost:3000**

- `PUT /api/materials/:id` - Atualizar material

- `DELETE /api/materials/:id` - Excluir material## 📊 API Endpoints Completa



### 📁 Arquivos CAD### 🔐 Autenticação

- `POST /api/files/upload` - Upload arquivo CAD (com análise automática)- `POST /api/auth/register` - Registrar usuário

- `GET /api/files` - Listar arquivos- `POST /api/auth/login` - Login de usuário

- `GET /api/files/:id` - Buscar arquivo por ID (inclui análise)- `GET /api/auth/verify` - Verificar token JWT

- `GET /api/files/:id/download` - Download arquivo

- `DELETE /api/files/:id` - Excluir arquivo### 👥 Clientes

- `GET /api/clients` - Listar clientes

## 🎯 Como Usar o Sistema- `POST /api/clients` - Criar cliente

- `GET /api/clients/:id` - Buscar cliente por ID

### 1. **Primeiro Acesso**- `PUT /api/clients/:id` - Atualizar cliente

1. Acesse `http://localhost:3000`- `DELETE /api/clients/:id` - Excluir cliente

2. Clique em "Registrar" para criar sua conta

3. Escolha o tipo de usuário (Cliente ou Fornecedor)### 🏗️ Projetos

4. Faça login com suas credenciais- `GET /api/projects` - Listar projetos

- `POST /api/projects` - Criar projeto

### 2. **Dashboard**- `GET /api/projects/:id` - Buscar projeto por ID

- Visualize estatísticas gerais do sistema- `PUT /api/projects/:id` - Atualizar projeto

- Acesse rapidamente orçamentos recentes e projetos ativos- `DELETE /api/projects/:id` - Excluir projeto

- Use as ações rápidas para criar novos registros

### 📊 Orçamentos

### 3. **Upload de Arquivo CAD**- `GET /api/budgets` - Listar orçamentos

1. Vá para a aba "Arquivos CAD"- `POST /api/budgets` - Criar orçamento

2. Clique em "Upload Arquivo CAD"- `GET /api/budgets/:id` - Buscar orçamento por ID

3. Selecione o arquivo (.stp, .step, .x_t)- `PUT /api/budgets/:id` - Atualizar orçamento

4. Aguarde o processamento automático- `DELETE /api/budgets/:id` - Excluir orçamento

5. O sistema extrairá automaticamente:- `POST /api/budgets/:id/materials` - Adicionar material

   - Volume da peça- `POST /api/budgets/:id/processes` - Adicionar processo

   - Complexidade de usinagem- `GET /api/budgets/:id/download/excel` - Download Excel

   - Tempo estimado- `GET /api/budgets/:id/download/pdf` - **Download PDF (NOVO)**

   - Materiais e processos sugeridos

### 🧱 Materiais

### 4. **Criando um Orçamento com CAD**- `GET /api/materials` - Listar materiais

1. Vá para a aba "Orçamentos"- `POST /api/materials` - Criar material

2. Clique em "Novo Orçamento"- `GET /api/materials/:id` - Buscar material por ID

3. Selecione o projeto- `PUT /api/materials/:id` - Atualizar material

4. Clique em "Selecionar Arquivos CAD"- `DELETE /api/materials/:id` - Excluir material

5. Escolha os arquivos CAD relevantes

6. Clique em "Auto-completar com dados do CAD"### � Arquivos CAD

7. O sistema preencherá automaticamente:- `POST /api/files/upload` - Upload arquivo CAD

   - Materiais sugeridos com quantidades- `GET /api/files` - Listar arquivos

   - Processos recomendados com tempos- `GET /api/files/:id` - Buscar arquivo por ID

   - Custo de mão de obra estimado- `DELETE /api/files/:id` - Excluir arquivo

8. Ajuste conforme necessário

9. Salve o orçamento## � Como Usar o Sistema

10. Exporte para Excel ou PDF

### 1. **Primeiro Acesso**

### 5. **Exportando Orçamentos**1. Acesse `http://localhost:3000`

- **Excel**: Clique no botão "Excel" para gerar planilha formatada2. Clique em "Registrar" para criar sua conta

- **PDF**: Clique no botão "PDF" para gerar documento profissional3. Escolha o tipo de usuário (Cliente ou Fornecedor)

- Ambos incluem todos os detalhes: materiais, processos, custos e totais4. Faça login com suas credenciais



## 🔧 Tecnologias Utilizadas### 2. **Criando um Projeto**

1. Vá para a aba "Projetos" (ou use ação rápida no Dashboard)

### Backend2. Clique em "Novo Projeto"

- **Node.js** - Runtime JavaScript3. Preencha os dados do projeto

- **Express.js** - Framework web4. Salve o projeto

- **MongoDB** - Banco de dados NoSQL

- **Mongoose** - ODM para MongoDB### 3. **Cadastrando Materiais**

- **JWT** - Autenticação via tokens1. Vá para a aba "Materiais"

- **Bcrypt** - Criptografia de senhas2. Clique em "Novo Material"

- **Multer** - Upload de arquivos3. Preencha as especificações e preços

- **ExcelJS** - Geração de planilhas Excel4. Salve o material

- **PDFKit** - Geração de documentos PDF

### 4. **Upload de Arquivos CAD**

### Frontend1. Vá para a aba "Arquivos CAD"

- **HTML5** - Estrutura2. Clique em "Upload Arquivo CAD"

- **CSS3** - Estilos modernos com grid e flexbox3. Selecione o arquivo (.stp, .step, .x_t)

- **JavaScript ES6+** - Interatividade4. Vincule ao projeto ou orçamento (opcional)

- **Fetch API** - Requisições HTTP5. **Aguarde a análise automática** (volume, complexidade, tempo estimado)

- **Modular JS** - Organização em módulos

- **Responsive Design** - Layout adaptável### 5. **Criando um Orçamento com CAD**

1. Vá para a aba "Orçamentos"

### Análise CAD2. Clique em "Novo Orçamento"

- **Análise de arquivos STEP/STP** - Extração de entidades geométricas3. Selecione o projeto

- **Análise de arquivos Parasolid (X_T)** - Estimativas baseadas em tamanho4. Clique em **"Selecionar Arquivos CAD"**

- **Algoritmos de estimativa** - Volume, complexidade, tempo de usinagem5. Escolha um ou mais arquivos CAD já processados

6. Clique em **"Auto-completar com dados do CAD"** para:

### Infraestrutura   - Adicionar materiais sugeridos automaticamente

- **MongoDB Atlas** - Banco de dados na nuvem   - Incluir processos de fabricação recomendados

- **GitHub** - Controle de versão   - Calcular custos baseados na análise CAD

- **Heroku/Railway** - Deploy (configurável)7. Ajuste manualmente se necessário

8. O sistema calculará automaticamente o valor final

## 🔒 Segurança9. **Gere Excel ou PDF** para enviar ao cliente



- Autenticação JWT com tokens seguros### 6. **Exportando Orçamentos**

- Criptografia de senhas com bcrypt (salt rounds: 10)1. Na lista de orçamentos, clique em:

- Validação de dados de entrada com Joi   - **"Excel"** para planilha formatada

- Controle de acesso baseado em roles   - **"PDF"** para documento profissional

- Upload seguro de arquivos com validação de tipo e tamanho2. O arquivo será baixado automaticamente

- Sanitização de dados para prevenir injeções

- Middleware de autenticação para downloads## 🔧 Tecnologias Utilizadas



## 🚀 Status do Projeto### Backend

- **Node.js** - Runtime JavaScript

### ✅ Implementado- **Express.js** - Framework web

- [x] Sistema completo de autenticação- **MongoDB** - Banco de dados NoSQL

- [x] CRUD de projetos, clientes, materiais e orçamentos- **Mongoose** - ODM para MongoDB

- [x] **Dashboard com estatísticas em tempo real**- **JWT** - Autenticação via tokens

- [x] Upload de arquivos CAD (STP, STEP, X_T)- **Bcrypt** - Criptografia de senhas

- [x] **Análise automática de arquivos CAD**- **Multer** - Upload de arquivos

- [x] **Integração CAD-Orçamento com auto-preenchimento**- **ExcelJS** - Geração de planilhas

- [x] **Geração de Excel formatado**- **PDFKit** - Geração de PDF (NOVO)

- [x] **Geração de PDF profissional**

- [x] Interface web moderna e responsiva### Frontend

- [x] API RESTful completa- **HTML5** - Estrutura

- [x] Integração com MongoDB Atlas- **CSS3** - Estilos modernos

- [x] Sistema de roles (Cliente/Fornecedor)- **JavaScript ES6+** - Interatividade

- [x] Middleware de autenticação para downloads- **Fetch API** - Requisições HTTP

- **Responsive Design** - Layout adaptável

### 🚧 Próximas Melhorias

- [ ] Análise CAD avançada com bibliotecas especializadas (OpenCascade)### Infraestrutura

- [ ] Visualização 3D de arquivos CAD no navegador- **MongoDB Atlas** - Banco de dados na nuvem

- [ ] Sistema de notificações por email- **GitHub** - Controle de versão

- [ ] Dashboard com gráficos (Chart.js)- **Heroku/Railway** - Deploy (configurável)

- [ ] Histórico de versões de orçamentos

- [ ] Comparação de orçamentos## 🔒 Segurança



### 💡 Funcionalidades Futuras- Autenticação JWT com tokens seguros

- [ ] Integração com sistemas ERP- Criptografia de senhas com bcrypt

- [ ] App mobile (React Native)- Validação de dados de entrada

- [ ] Sistema de aprovações workflow- Controle de acesso baseado em roles

- [ ] Integração com sistemas de pagamento- Upload seguro de arquivos com validação de tipo

- [ ] Multi-idiomas (i18n)- Sanitização de dados para prevenir injeções

- [ ] Relatórios personalizáveis

## 🚀 Status do Projeto

## 📈 Funcionalidades Destacadas

### ✅ Implementado

### 🤖 Análise Automática de CAD- [x] Sistema completo de autenticação

O sistema analisa arquivos CAD automaticamente e extrai:- [x] CRUD de projetos, clientes, materiais e orçamentos

- **Volume**: Estimativa em cm³ baseada no tamanho do arquivo- [x] Upload de arquivos CAD

- **Complexidade**: Classificação (low, medium, high) baseada em entidades geométricas- [x] **Análise automática de arquivos CAD (STEP/STP e Parasolid)**

- **Tempo de Usinagem**: Cálculo automático considerando volume e complexidade- [x] **Integração CAD-Orçamento com seleção múltipla**

- **Materiais Sugeridos**: Lista de materiais adequados ao nível de complexidade- [x] **Auto-fill de orçamentos baseado em análise CAD**

- **Processos**: Processos de fabricação recomendados (CNC, EDM, torneamento, etc.)- [x] Geração de Excel

- [x] **Geração de PDF profissional**

### 📊 Exportação Profissional- [x] **Dashboard executivo com estatísticas**

- **Excel**: Planilhas formatadas com cores, bordas e totais automáticos- [x] Interface web moderna e responsiva

- **PDF**: Documentos profissionais com cabeçalho, detalhamento e resumo financeiro- [x] API RESTful completa

- Downloads autenticados e seguros- [x] Integração com MongoDB Atlas

- Nomes de arquivo com identificação única- [x] Sistema de roles (Cliente/Fornecedor)



### 🔗 Integração Inteligente### 🚧 Em Desenvolvimento

- Vinculação de arquivos CAD com orçamentos- [ ] Sistema de notificações por email

- Botão de auto-completar que preenche materiais e processos automaticamente- [ ] Histórico de versões de orçamentos

- Atualização em tempo real do status de processamento- [ ] Análise CAD avançada com bibliotecas especializadas

- Interface visual para seleção de múltiplos arquivos CAD

### 💡 Funcionalidades Futuras

## 📞 Suporte- [ ] Integração com sistemas ERP

- [ ] App mobile

Para dúvidas, sugestões ou reportar bugs:- [ ] Sistema de aprovações workflow

- Email: marcelopiloni@gmail.com- [ ] Integração com sistemas de pagamento

- GitHub Issues: [Criar issue](https://github.com/marcelopiloni/modelcalc/issues)- [ ] Multi-idiomas (i18n)



## 📄 Licença## 📞 Suporte



Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.Para dúvidas, sugestões ou reportar bugs:

- Email: marcelopiloni@gmail.com

---- GitHub Issues: [Criar issue](https://github.com/marcelopiloni/modelcalc/issues)



**Desenvolvido com ❤️ para facilitar a gestão de orçamentos de usinagem CNC**## 📄 Licença


Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.