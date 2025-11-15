# 🚀 Guia Rápido - Backend Django

## Passo a Passo para Configurar

### 1. Ativar ambiente virtual

```bash
cd backend

# Linux/Mac
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 2. Instalar dependências

```bash
pip install -r requirements.txt
```

### 3. Criar e aplicar migrações

```bash
# Criar migrações
python manage.py makemigrations

# Aplicar no banco de dados
python manage.py migrate
```

### 4. Criar usuários de teste

```bash
python manage.py shell < create_test_users.py
```

### 5. Rodar o servidor

```bash
python manage.py runserver
```

Acesse: http://localhost:8000

---

## 📝 Usuários de Teste Criados

| Tipo | Login | Senha |
|------|-------|-------|
| **Admin** | admin@tcc.com | admin123 |
| **Apontador** | 001234 | apontador123 |
| **Encarregado** | 001235 | encarregado123 |
| **Motorista** | 001236 | motorista123 |

---

## 🧪 Testar a API

### 1. Login Admin (com email):

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tcc.com",
    "password": "admin123"
  }'
```

### 2. Login Apontador (com matrícula):

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "matricula": "001234",
    "password": "apontador123"
  }'
```

### 3. Obter dados do usuário logado:

```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 🔧 Comandos Úteis

### Criar superusuário manualmente:

```bash
python manage.py createsuperuser
```

### Acessar admin do Django:

```
http://localhost:8000/admin
```

### Limpar banco de dados:

```bash
# Deletar db.sqlite3
rm db.sqlite3

# Deletar migrações
rm core/migrations/0*.py

# Refazer tudo
python manage.py makemigrations
python manage.py migrate
python manage.py shell < create_test_users.py
```

### Ver logs do servidor:

```bash
python manage.py runserver --verbosity 3
```

---

## 📚 Estrutura das URLs

```
/api/auth/registro       - POST - Criar novo usuário
/api/auth/login          - POST - Login
/api/auth/logout         - POST - Logout
/api/auth/me             - GET  - Dados do usuário logado

/api/usuarios            - GET  - Listar usuários
/api/usuarios            - POST - Criar usuário
/api/usuarios/<id>       - GET  - Ver usuário
/api/usuarios/<id>       - PUT  - Atualizar usuário
/api/usuarios/<id>       - DELETE - Deletar usuário

/api/obras               - GET  - Listar obras
/api/obras               - POST - Criar obra
/api/obras/<id>          - GET  - Ver obra
/api/obras/<id>          - PUT  - Atualizar obra
/api/obras/<id>          - DELETE - Deletar obra
```

---

## 🔌 Integrar com Frontend

No frontend (Next.js), atualize a URL da API:

```typescript
// frontend/lib/api.ts
const API_URL = 'http://localhost:8000/api'

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  return response.json()
}
```

---

## ⚡ Próximos Passos

1. ✅ Sistema de autenticação funcionando
2. ✅ Usuários de teste criados
3. ⏳ Criar endpoints de Equipamentos
4. ⏳ Criar endpoints de Atividades
5. ⏳ Criar endpoints de Registro de Jornada
6. ⏳ Integrar com frontend Next.js
