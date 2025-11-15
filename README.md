# 🏗️ Sistema de Gestão de Obras - TCC

Sistema web para otimização do processo de apropriação de dados em obras da construção civil.

**Projeto:** Rodovia BR-116 - Trecho Cariri  
**Stack:** Next.js 15 (Frontend) + Django 5.2 (Backend)

---

## 🚀 INÍCIO RÁPIDO

### Opção 1: Script Automático (Linux/Mac)

```bash
chmod +x start.sh
./start.sh
```

### Opção 2: Manual

**Terminal 1 - Backend:**
```bash
cd backend
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install  # Primeira vez apenas
npm run dev
```

**Acesse:** http://localhost:3000/login

---

## 🔐 CREDENCIAIS DE TESTE

| Perfil | Usuário | Senha |
|--------|---------|-------|
| **Administrador** | admin@tcc.com | admin123 |
| **Apontador** | 001234 | senha123 |
| **Encarregado** | 001235 | senha123 |
| **Motorista** | 001236 | senha123 |

---

## 📋 ÍNDICE

- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Documentação](#-documentação)
- [API](#-api)
- [Testes](#-testes)

---

## ✨ FUNCIONALIDADES

### ✅ Implementadas

#### Autenticação
- [x] Login multi-perfil (Admin, Apontador, Encarregado, Motorista)
- [x] JWT com access token (24h) e refresh token (7 dias)
- [x] Persistência de sessão
- [x] Proteção de rotas por tipo de usuário
- [x] Logout com limpeza de dados

#### Backend API
- [x] 39 endpoints REST
- [x] Autenticação JWT
- [x] CRUD completo para:
  - Obras
  - Equipamentos
  - Usuários
  - Atividades
  - Registros de Equipamento
  - Registros de Mão de Obra
  - Diários de Obra
- [x] Sistema de importação/exportação CSV
- [x] Dashboard com estatísticas

#### Frontend
- [x] 22 páginas Next.js
- [x] 4 perfis de usuário
- [x] Design responsivo
- [x] Integração completa com backend (Login)

### 🔜 Em Desenvolvimento
- [ ] Integração dos dashboards com API
- [ ] Páginas de CRUD conectadas ao backend
- [ ] Upload de fotos
- [ ] Geração de PDF (RDO)
- [ ] Interface de importação CSV

---

## 🛠️ TECNOLOGIAS

### Backend
- **Django 5.2.8** - Framework web
- **Django REST Framework 3.15.2** - API REST
- **Simple JWT** - Autenticação
- **django-cors-headers** - CORS
- **SQLite** - Banco de dados (dev)
- **Pillow** - Processamento de imagens

### Frontend
- **Next.js 15** - Framework React
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes
- **Lucide React** - Ícones

---

## 📁 ESTRUTURA DO PROJETO

```
tcc-web-interface/
│
├── backend/                    # Django API
│   ├── api/                   # Configurações do Django
│   │   ├── settings.py       # CORS, JWT, etc.
│   │   └── urls.py           # Rotas principais
│   │
│   ├── core/                  # App principal
│   │   ├── models.py         # 11 modelos (Usuario, Obra, etc.)
│   │   ├── views.py          # 39 endpoints
│   │   ├── serializers.py    # Serialização de dados
│   │   ├── importers.py      # Sistema de importação CSV
│   │   └── urls.py           # Rotas da API
│   │
│   ├── exemplos_csv/          # Exemplos de CSV
│   ├── media/                 # Uploads
│   ├── db.sqlite3            # Banco de dados
│   └── manage.py
│
├── frontend/                  # Next.js App
│   ├── app/                  # Rotas e páginas
│   │   ├── layout.tsx       # Layout global
│   │   ├── login/           # 5 páginas de login
│   │   ├── admin/           # 6 páginas admin
│   │   ├── apontador/       # 5 páginas apontador
│   │   ├── encarregado/     # 4 páginas encarregado
│   │   └── motorista/       # 2 páginas motorista
│   │
│   ├── components/           # Componentes reutilizáveis
│   │   ├── ui/              # shadcn/ui components
│   │   ├── ProtectedRoute.tsx
│   │   └── UserHeader.tsx
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx  # Context de autenticação
│   │
│   ├── lib/
│   │   ├── api.ts          # Funções da API
│   │   └── utils.ts        # Utilitários
│   │
│   └── .env.local          # Variáveis de ambiente
│
├── start.sh                   # Script de inicialização
├── RESUMO_INTEGRACAO.md      # Resumo executivo
├── INTEGRACAO_LOGIN.md       # Guia de integração
└── TESTE_INTEGRACAO.md       # Guia de testes
```

---

## 💻 INSTALAÇÃO

### Pré-requisitos
- Python 3.10+
- Node.js 18+
- npm ou pnpm

### 1. Clonar Repositório
```bash
git clone <url-do-repositorio>
cd tcc-web-interface
```

### 2. Configurar Backend

```bash
cd backend

# Criar ambiente virtual (recomendado)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Instalar dependências
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers pillow

# Aplicar migrações
python manage.py migrate

# Criar superusuário (opcional)
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver
```

✅ Backend rodando em: http://127.0.0.1:8000

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Criar arquivo de ambiente
echo "NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api" > .env.local

# Iniciar servidor
npm run dev
```

✅ Frontend rodando em: http://localhost:3000

---

## 📚 DOCUMENTAÇÃO

### Guias Disponíveis

| Documento | Descrição |
|-----------|-----------|
| **RESUMO_INTEGRACAO.md** | Resumo executivo da integração |
| **INTEGRACAO_LOGIN.md** | Guia técnico completo |
| **TESTE_INTEGRACAO.md** | Como testar a integração |
| **backend/API_COMPLETA.md** | Documentação da API |
| **backend/IMPORTACAO_CSV.md** | Sistema de importação CSV |

### Arquitetura

```
┌─────────────┐         ┌─────────────┐
│   Next.js   │ ◄─────► │   Django    │
│  (Frontend) │  HTTP   │  (Backend)  │
└─────────────┘         └─────────────┘
      │                        │
      │                        │
   Context API            REST API
      │                        │
      │                        │
 localStorage              SQLite
```

---

## 🔌 API

### Base URL
```
http://127.0.0.1:8000/api
```

### Autenticação

Todos os endpoints (exceto login/registro) requerem token JWT:

```http
Authorization: Bearer <access_token>
```

### Principais Endpoints

#### Autenticação
```
POST   /auth/login           # Login
POST   /auth/registro        # Registro
POST   /auth/refresh         # Renovar token
GET    /auth/perfil          # Obter perfil
PUT    /auth/perfil          # Atualizar perfil
POST   /auth/trocar-senha    # Alterar senha
```

#### Recursos
```
GET    /obras/               # Listar obras
GET    /equipamentos/        # Listar equipamentos
GET    /usuarios/            # Listar usuários
GET    /atividades/          # Listar atividades
GET    /registros-equipamentos/  # Registros
GET    /registros-mao-obra/      # Registros
GET    /diarios-obra/            # RDOs
```

#### CSV
```
POST   /importar-csv         # Importar CSV
GET    /modelo-csv/:tipo     # Download modelo
GET    /exportar-csv/:tipo   # Exportar dados
```

Ver documentação completa em: **backend/API_COMPLETA.md**

---

## 🧪 TESTES

### Teste Rápido de Login

1. Inicie backend e frontend
2. Acesse: http://localhost:3000/login
3. Selecione "Administrador"
4. Login: `admin@tcc.com` / Senha: `admin123`
5. Deve redirecionar para `/admin/dashboard`

### Verificar Integração

**DevTools (F12) > Application > Local Storage:**
- `tcc_user` - Dados do usuário
- `tcc_tokens` - Access e refresh tokens

**Network Tab:**
- POST para `http://127.0.0.1:8000/api/auth/login`
- Status: 200 OK
- Response: `{user, tokens}`

### Testes Automatizados

```bash
# Backend
cd backend
python manage.py test

# Frontend
cd frontend
npm run test  # (se configurado)
```

---

## 🔧 TROUBLESHOOTING

### ❌ CORS Error

**Erro:** `Access to fetch... has been blocked by CORS policy`

**Solução:**
```bash
cd backend
pip install django-cors-headers
# Verificar settings.py tem CORS_ALLOWED_ORIGINS configurado
python manage.py runserver
```

### ❌ Invalid Credentials

**Erro:** Senha correta mas não loga

**Solução:** Criar usuários de teste
```bash
cd backend
python manage.py shell
```

```python
from core.models import Usuario
from django.contrib.auth.hashers import make_password

Usuario.objects.create(
    nome="Administrador",
    email="admin@tcc.com",
    tipo_usuario="admin",
    funcao="Administrador",
    cargo="Gerente",
    cpf="111.222.333-44",
    telefone="85999998888",
    password=make_password("admin123"),
    is_active=True
)
```

### ❌ Connection Refused

**Erro:** `Failed to fetch`

**Solução:** Verificar se backend está rodando
```bash
curl http://127.0.0.1:8000/api/usuarios/
# Deve retornar JSON
```

---

## 📊 STATUS DO PROJETO

### ✅ Completo
- Backend Django com 39 endpoints
- Sistema de autenticação JWT
- Frontend Next.js com 22 páginas
- Integração de login/logout
- Sistema de importação CSV
- Documentação completa

### 🔜 Próximos Passos
1. Testar integração de login
2. Proteger rotas com `<ProtectedRoute>`
3. Integrar dashboards com API
4. Implementar CRUDs conectados
5. Interface de upload CSV
6. Geração de PDFs

---

## 👥 PERFIS DE USUÁRIO

### 🛡️ Administrador
- Dashboard executivo
- Gestão de obras e contratos
- Relatórios e análises
- CRUD completo

### 📋 Apontador
- Validação de equipamentos
- Registro de atividades
- Quantificação de serviços

### 👥 Encarregado
- Controle de presença
- Alocação de funcionários
- Gestão de atividades da equipe

### 🚛 Motorista
- Registro de status do equipamento
- Controle de horímetro
- Histórico de atividades

---

## 📝 LICENÇA

Este projeto é parte de um Trabalho de Conclusão de Curso (TCC).

---

## 🤝 CONTATO

Para dúvidas ou sugestões sobre o projeto, consulte a documentação ou entre em contato.

---

**Desenvolvido com ❤️ para otimização de processos em obras rodoviárias**
