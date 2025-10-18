# ModelCalc - Sistema de Orçamentos CAD

ModelCalc é uma plataforma completa para gestão de orçamentos de usinagem a partir de arquivos CAD. O sistema integra análise automatizada de arquivos STEP/Parasolid, catálogo de materiais, projetos, orçamentos e fluxo de aprovação de usuários com RBAC.

## ✨ Destaques

- Upload de arquivos CAD (`.stp`, `.step`, `.x_t`) com análise automática (volume estimado, complexidade, tempo de usinagem, materiais/processos sugeridos);
- RBAC completo com quatro perfis (Administrador, Gerente, Operador, Cliente) e aprovação de contas;
- Dashboard web responsivo com estatísticas em tempo real e painel de aprovação de usuários;
- Orçamentos vinculados a projetos, com exportação para Excel e PDF;
- Integração com MongoDB via Mongoose, autenticação JWT e middlewares de segurança (helmet, cors);
- Seed automático para criação do administrador inicial.

## 🛠️ Tecnologias

- **Backend**: Node.js 20, Express, Mongoose, JWT, Multer, Helmet, Morgan;
- **Frontend**: HTML5, CSS3, JavaScript ES6 modular (SPA simples);
- **Geração de relatórios**: ExcelJS (planilhas) e PDFKit (PDF);
- **Persistência**: MongoDB Atlas ou instância local.

## 🚀 Começando

```bash
git clone https://github.com/marcelopiloni/modelcalc.git
cd modelcalc
npm install
cp .env.example .env   # ou crie manualmente o arquivo
npm start
```

### Variáveis de ambiente (`.env`)

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/modelcalc
JWT_SECRET=uma_chave_segura_aqui
NODE_ENV=development
ADMIN_EMAIL=admin@modelcalc.com
ADMIN_PASSWORD=troque_esta_senha
```

Ao subir o servidor, o seed `src/utils/seedAdmin.js` garante a existência do administrador definido no `.env`.

## 📂 Estrutura do Projeto

```
modelcalc/
├── server.js                  # Configuração do Express e bootstrap da aplicação
├── public/                    # Frontend estático (SPA)
│   ├── index.html             # Layout principal
│   ├── css/styles.css         # Estilos
│   └── js/                    # Módulos JS (auth, dashboard, cad, etc.)
├── src/
│   ├── controllers/           # Regras de negócio (Budget, File, User, etc.)
│   ├── middleware/            # Auth, RBAC, upload, validação
│   ├── models/                # Schemas Mongoose
│   ├── routes/                # Rotas organizadas por recurso
│   └── utils/                 # Exportação Excel/PDF, análise CAD, seed admin
├── uploads/                   # Arquivos CAD enviados (persistidos no disco)
├── excel/                     # Exportações geradas
├── package.json
└── README.md
```

## 🔐 RBAC e Fluxo de Aprovação

| Função        | Acesso principal                                                                 |
|---------------|-----------------------------------------------------------------------------------|
| **Admin**     | Acesso total, criação de usuários (inclui gerentes)                              |
| **Gerente**   | Aprovação de usuários, gestão completa de dados                                  |
| **Operador**  | Cria e gerencia projetos/orçamentos próprios; requer aprovação do gerente        |
| **Cliente**   | Solicita orçamentos, acessa seus dados e relatórios                              |

- Clientes recebem aprovação automática no registro;
- Operadores aguardam aprovação antes de obter token e acessar rotas protegidas;
- Middlewares `auth`, `downloadAuth` e `rbac` garantem que apenas perfis aprovados alcancem recursos sensíveis.

### Fluxo de Registro

1. Usuário preenche formulário (cliente ou operador);
2. Cliente recebe token imediato e acesso limitado;
3. Operador recebe resposta informando pendência; gerente aprova via painel;
4. Após aprovação, operador pode autenticar e operar normalmente.

## 🤖 Análise CAD

- Analisa tamanho, volume estimado, complexidade e sugere processos;
- Resultado fica disponível no cadastro do arquivo e alimenta o auto-preenchimento de orçamentos;
- Quando a análise falha, o sistema aplica valores padrão e registra o ocorrido no log.

## 📡 API (resumo)

| Recurso        | Endpoints principais                                             |
|----------------|------------------------------------------------------------------|
| Autenticação   | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Usuários       | `GET /api/auth/` (admin/manager), aprovações e trocas de role    |
| Projetos       | CRUD completo vinculado a clientes                               |
| Orçamentos     | CRUD + exportação Excel/PDF (`/download/excel`, `/download/pdf`) |
| Materiais      | Catálogo para uso nos orçamentos                                 |
| Arquivos CAD   | Upload, listagem, download, análise automática                   |

> Cada rota aplica filtros de acordo com o perfil logado (ver middleware `rbac`).

## ✅ Checklist Atual

- [x] Autenticação JWT e RBAC com aprovação
- [x] UI responsiva com dashboard e painel de usuários
- [x] Upload/análise CAD com auto-fill de orçamentos
- [x] Exportação para Excel e PDF
- [x] Seed automático para admin
- [ ] Evoluir análise CAD com biblioteca geométrica especializada (OpenCascade)
- [ ] Visualização 3D dos arquivos CAD
- [ ] Notificações (e-mail) e integrações externas

## 👩‍💻 Contribuição

1. Faça fork e crie uma branch (`git checkout -b feature/nome-da-feature`);
2. Documente mudanças relevantes no README ou comentários;
3. Abra um pull request descrevendo motivação e testes.

## 📄 Licença

Projeto licenciado sob MIT. Veja `LICENSE` para detalhes.

---

**Contato:** marcelopiloni@gmail.com | [Issues](https://github.com/marcelopiloni/modelcalc/issues)