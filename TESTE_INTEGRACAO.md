# 🧪 GUIA DE TESTE - INTEGRAÇÃO LOGIN

## 🚀 INÍCIO RÁPIDO

### 1️⃣ Iniciar Backend (Terminal 1)

```bash
cd /home/victor/Documentos/dev/tcc-web-interface/backend

# Ativar ambiente virtual (se existir)
source venv/bin/activate

# Iniciar servidor Django
python manage.py runserver
```

✅ Backend rodando em: **http://127.0.0.1:8000**

### 2️⃣ Iniciar Frontend (Terminal 2)

```bash
cd /home/victor/Documentos/dev/tcc-web-interface/frontend

# Primeira vez: instalar dependências
npm install

# Iniciar servidor Next.js
npm run dev
```

✅ Frontend rodando em: **http://localhost:3000**

---

## 🔐 CREDENCIAIS DE TESTE

### Admin (Login por E-mail)
- **Email:** admin@tcc.com
- **Senha:** admin123
- **Destino:** `/admin/dashboard`

### Apontador (Login por Matrícula)
- **Matrícula:** 001234
- **Senha:** senha123
- **Destino:** `/apontador/tarefas`

### Encarregado (Login por Matrícula)
- **Matrícula:** 001235
- **Senha:** senha123
- **Destino:** `/encarregado/equipe`

### Motorista (Login por Matrícula)
- **Matrícula:** 001236
- **Senha:** senha123
- **Destino:** `/motorista/equipamento`

---

## ✅ CHECKLIST DE TESTES

### Teste 1: Login Admin
1. Acesse http://localhost:3000/login
2. Clique em "Administrador"
3. Digite:
   - Email: `admin@tcc.com`
   - Senha: `admin123`
4. Clique em "Entrar"
5. ✅ Deve redirecionar para `/admin/dashboard`

### Teste 2: Persistência de Sessão
1. Faça login como qualquer usuário
2. Feche o navegador completamente
3. Abra novamente e vá para http://localhost:3000
4. ✅ Deve continuar logado (sem pedir login novamente)

### Teste 3: Logout
1. Estando logado, clique no botão de logout (se disponível)
2. ✅ Deve redirecionar para `/login`
3. ✅ Ao tentar acessar uma página protegida, deve voltar ao login

### Teste 4: Proteção de Rotas
1. Sem estar logado, tente acessar diretamente:
   - http://localhost:3000/admin/dashboard
2. ✅ Deve redirecionar automaticamente para `/login`

### Teste 5: Tipos de Usuário
1. Faça login como Motorista
2. Tente acessar http://localhost:3000/admin/dashboard
3. ✅ Deve redirecionar para `/motorista/equipamento` (página correta do motorista)

### Teste 6: Erros de Login
1. Tente fazer login com senha errada
2. ✅ Deve exibir mensagem de erro
3. ✅ Não deve redirecionar
4. ✅ Botão deve voltar do estado "Entrando..." para "Entrar"

---

## 🔍 VERIFICAÇÕES NO DEVTOOLS

### Abrir DevTools
Pressione **F12** ou **Ctrl+Shift+I**

### 1️⃣ Network Tab
- Faça login
- Veja a requisição para: `http://127.0.0.1:8000/api/auth/login`
- Status: **200 OK**
- Response: JSON com `user` e `tokens`

### 2️⃣ Application > Local Storage
Após login, deve ter:
- **Key:** `tcc_user`
  - **Value:** JSON com dados do usuário
- **Key:** `tcc_tokens`
  - **Value:** JSON com `access` e `refresh`

### 3️⃣ Console
- Não deve ter erros
- Se tiver warnings, são normais (Next.js, React)

---

## ⚠️ PROBLEMAS COMUNS

### ❌ "Erro de conexão com o servidor"

**Verificar:**
```bash
# Backend está rodando?
curl http://127.0.0.1:8000/api/usuarios/

# Deve retornar lista de usuários (JSON)
```

**Solução:**
- Iniciar backend: `cd backend && python manage.py runserver`

---

### ❌ "CORS policy blocked"

**Erro no Console:**
```
Access to fetch at 'http://127.0.0.1:8000/api/auth/login' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Verificar** `backend/api/settings.py`:
```python
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # DEVE estar no topo
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# OU permitir tudo (apenas desenvolvimento)
CORS_ALLOW_ALL_ORIGINS = True
```

**Solução:**
```bash
cd backend
pip install django-cors-headers
python manage.py runserver
```

---

### ❌ "Invalid credentials" com senha correta

**Causa:** Usuário não existe no banco

**Verificar:**
```bash
cd backend
python manage.py shell
```

```python
from core.models import Usuario

# Listar usuários
usuarios = Usuario.objects.all()
for u in usuarios:
    print(f"{u.nome} - {u.email or u.matricula}")

# Se vazio, criar usuários de teste
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

---

### ❌ Frontend não carrega

**Erro:**
```
Module not found: Can't resolve '@/contexts/AuthContext'
```

**Solução:**
```bash
cd frontend

# Parar servidor (Ctrl+C)
# Reinstalar dependências
npm install

# Reiniciar
npm run dev
```

---

### ❌ ".env.local não carregado"

**Verificar:**
1. Arquivo existe em `/frontend/.env.local`
2. Conteúdo:
   ```
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
   ```
3. Reiniciar servidor Next.js após criar/editar `.env.local`

---

## 📊 TESTE MANUAL COMPLETO

### Passo a Passo

```bash
# Terminal 1: Backend
cd backend
python manage.py runserver

# Terminal 2: Frontend
cd frontend
npm run dev

# Navegador
# 1. http://localhost:3000/login
# 2. Clicar em "Administrador"
# 3. Email: admin@tcc.com, Senha: admin123
# 4. Clicar "Entrar"
# 5. Verificar redirecionamento para /admin/dashboard
# 6. Abrir DevTools (F12)
# 7. Application > Local Storage
# 8. Verificar tcc_user e tcc_tokens
# 9. Recarregar página (F5)
# 10. Verificar que continua logado
```

---

## 🎯 PRÓXIMOS PASSOS APÓS TESTES

Se tudo funcionar:

1. ✅ **Proteger todas as rotas** com `<ProtectedRoute>`
2. ✅ **Adicionar UserHeader** nas páginas protegidas
3. ✅ **Integrar dashboards** com dados da API
4. ✅ **Criar páginas de CRUD** para obras, equipamentos, etc.
5. ✅ **Adicionar validações** de formulários
6. ✅ **Implementar refresh automático** de token

---

## 📞 AJUDA

Se encontrar problemas não listados aqui:

1. Verificar console do navegador (F12)
2. Verificar terminal do backend (erros Django)
3. Verificar terminal do frontend (erros Next.js)
4. Verificar arquivo `.env.local` existe e está correto

---

**🎉 BOA SORTE NOS TESTES!**

Com a integração funcionando, podemos avançar para integrar o resto das páginas!
