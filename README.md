# TCC - Sistema de Apropriação de Dados para Obras Rodoviárias

Sistema web completo para otimização da apropriação de dados em obras rodoviárias, desenvolvido para a BR-116.

## 📁 Estrutura do Projeto

```
tcc-web-interface/
├── frontend/           # Aplicação Next.js (Interface do Usuário)
│   ├── app/           # Páginas e rotas (App Router)
│   ├── components/    # Componentes reutilizáveis
│   ├── lib/           # Utilitários
│   ├── public/        # Arquivos estáticos
│   └── styles/        # Estilos globais
│
└── backend/           # API Node.js (futuro - a ser criado)
    └── (aguardando implementação)
```

## 🚀 Frontend

### Tecnologias Utilizadas
- **Next.js 15.1.0** - Framework React com App Router
- **TypeScript 5** - Tipagem estática
- **Tailwind CSS 4.1.9** - Estilização
- **shadcn/ui** - Biblioteca de componentes
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones
- **React Hook Form + Zod** - Validação de formulários

### Como Executar o Frontend

```bash
# Entrar na pasta do frontend
cd frontend

# Instalar dependências (escolha um)
npm install
# ou
pnpm install

# Rodar em desenvolvimento
npm run dev
# ou
pnpm dev

# Acessar em: http://localhost:3000
```

### Estrutura de Páginas (22 páginas)

#### 🔐 Login (5 páginas)
- `/` - Página inicial com seleção de perfil
- `/login` - Seleção de perfil
- `/login/admin` - Login administrador
- `/login/apontador` - Login apontador
- `/login/encarregado` - Login encarregado
- `/login/motorista` - Login motorista

#### 📝 Apontador (3 páginas)
- `/apontador/tarefas` - Painel de tarefas
- `/apontador/registro-equipamento` - Registro de equipamento
- `/apontador/registro-mao-obra` - Registro de mão de obra

#### 👷 Encarregado (4 páginas)
- `/encarregado/equipe` - Gestão da equipe
- `/encarregado/criar-atividade` - Criar atividade
- `/encarregado/diario-obra` - Diário de obra
- `/encarregado/dashboard` - Dashboard

#### 🚛 Motorista (1 página)
- `/motorista/equipamento` - Gestão do equipamento

#### ⚙️ Admin (9 páginas)
- `/admin/dashboard` - Dashboard administrativo
- `/admin/cadastros/obras` - Cadastro de obras
- `/admin/cadastros/equipamentos` - Cadastro de equipamentos
- `/admin/cadastros/funcionarios` - Cadastro de funcionários
- `/admin/cadastros/contratos` - Cadastro de contratos
- `/admin/cadastros/criterios-medicao` - Critérios de medição
- `/admin/cadastros/atividades` - Cadastro de atividades
- `/admin/exportar-dados` - Exportação de dados

### Documentação

- `frontend/LOGIN_SYSTEM.md` - Documentação completa do sistema de login
- `frontend/FLUXO_APONTADOR.md` - Fluxo de trabalho do apontador com exemplos de API

## 🔧 Backend (A ser implementado)

### Próximos Passos

1. **Criar estrutura do backend**
   ```bash
   mkdir backend
   cd backend
   npm init -y
   ```

2. **Tecnologias Sugeridas**
   - Node.js + Express ou Fastify
   - PostgreSQL ou MySQL
   - Prisma ORM
   - JWT para autenticação
   - Multer para upload de imagens
   - PDFKit para geração de PDFs

3. **Endpoints Principais** (ver `frontend/FLUXO_APONTADOR.md` para exemplos)
   - POST `/api/auth/login` - Autenticação
   - GET `/api/apontador/tarefas` - Listar tarefas
   - POST `/api/apontador/equipamento/registrar` - Registrar equipamento
   - POST `/api/apontador/mao-obra/validar` - Validar mão de obra
   - GET `/api/admin/obras` - Listar obras
   - POST `/api/admin/obras` - Criar obra
   - POST `/api/exportar` - Exportar dados

## 📊 Funcionalidades Implementadas (Frontend)

✅ Sistema de login com 4 perfis de usuário  
✅ Painel de tarefas para apontador  
✅ Formulários de registro de equipamento  
✅ Formulários de registro de mão de obra  
✅ Gestão de equipe para encarregado  
✅ Criação de atividades  
✅ Diário de obra  
✅ Interface para motorista  
✅ Dashboard administrativo  
✅ 6 páginas de cadastros (CRUD completo)  
✅ Sistema de exportação de dados  
✅ Cálculos automáticos (horímetro, tempo)  
✅ Upload de fotos (estrutura pronta)  
✅ Validação de formulários  
✅ Design responsivo (mobile-first)  

## 🎯 Payloads Documentados

Todos os formulários têm `console.log()` com exemplos de payloads prontos para integração com o backend. Verifique os arquivos em `frontend/app/*/page.tsx`.

## 📝 Scripts Disponíveis

### Frontend
```bash
cd frontend

npm run dev      # Desenvolvimento
npm run build    # Build para produção
npm run start    # Iniciar servidor de produção
npm run lint     # Verificar código
```

## 🤝 Contribuindo

Este é um projeto de TCC. Para contribuir:

1. Clone o repositório
2. Crie uma branch para sua feature
3. Faça commit das suas mudanças
4. Faça push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é parte de um Trabalho de Conclusão de Curso (TCC).

## 👨‍💻 Autor

Desenvolvido como parte do TCC sobre otimização de apropriação de dados em obras rodoviárias.

---

**Status do Projeto:** ✅ Frontend Completo | ⏳ Backend Pendente
