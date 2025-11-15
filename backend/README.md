# Backend - Sistema de Apropriação de Dados

Backend em Django REST Framework para o sistema de apropriação de dados em obras rodoviárias.

## 🚀 Configuração Inicial

### 1. Instalar dependências

```bash
cd backend

# Ativar ambiente virtual
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# Instalar pacotes
pip install -r requirements.txt
```

### 2. Configurar banco de dados

```bash
# Criar migrações
python manage.py makemigrations

# Aplicar migrações
python manage.py migrate
```

### 3. Criar superusuário (Admin)

```bash
python manage.py createsuperuser
```

### 4. Rodar o servidor

```bash
python manage.py runserver
```

Acesse: http://localhost:8000

## 📚 Documentação da API

### Base URL
```
http://localhost:8000/api/
```

### Autenticação

Todas as requisições (exceto login e registro) precisam do token JWT no header:

```
Authorization: Bearer <seu_token_aqui>
```

---

## 🔐 Endpoints de Autenticação

### 1. Registro de Usuário

**POST** `/api/auth/registro`

**Body:**
```json
{
  "email": "admin@example.com",
  "matricula": "001234",
  "nome": "Nome Completo",
  "cpf": "123.456.789-00",
  "telefone": "(11) 98765-4321",
  "tipo_usuario": "admin",
  "funcao": "engenheiro",
  "cargo": "Engenheiro Civil",
  "password": "senha123",
  "password_confirm": "senha123"
}
```

**Tipos de usuário:**
- `admin` - Administrador (requer `email`)
- `apontador` - Apontador (requer `matricula`)
- `encarregado` - Encarregado (requer `matricula`)
- `motorista` - Motorista (requer `matricula`)

**Response:**
```json
{
  "message": "Usuário criado com sucesso",
  "user": { ... },
  "tokens": {
    "refresh": "token_refresh",
    "access": "token_access"
  }
}
```

---

### 2. Login

**POST** `/api/auth/login`

**Body (Admin - com email):**
```json
{
  "email": "admin@example.com",
  "password": "senha123"
}
```

**Body (Outros - com matrícula):**
```json
{
  "matricula": "001234",
  "password": "senha123"
}
```

**Response:**
```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": 1,
    "nome": "Nome Completo",
    "email": "admin@example.com",
    "matricula": "001234",
    "tipo_usuario": "admin",
    "funcao": "engenheiro",
    "cargo": "Engenheiro Civil"
  },
  "tokens": {
    "refresh": "token_refresh",
    "access": "token_access"
  }
}
```

---

### 3. Logout

**POST** `/api/auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "refresh": "token_refresh_aqui"
}
```

---

### 4. Obter Dados do Usuário Logado

**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "email": "admin@example.com",
  "matricula": "001234",
  "nome": "Nome Completo",
  "cpf": "123.456.789-00",
  "telefone": "(11) 98765-4321",
  "tipo_usuario": "admin",
  "funcao": "engenheiro",
  "cargo": "Engenheiro Civil",
  "is_active": true,
  "created_at": "2025-11-15T10:00:00Z"
}
```

---

## 👥 Endpoints de Usuários

### 1. Listar Usuários

**GET** `/api/usuarios`

**Query Params (opcional):**
- `?tipo=admin` - Filtrar por tipo de usuário

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "email": "admin@example.com",
    "matricula": null,
    "nome": "Admin User",
    "tipo_usuario": "admin",
    ...
  },
  {
    "id": 2,
    "email": null,
    "matricula": "001234",
    "nome": "João Silva",
    "tipo_usuario": "motorista",
    ...
  }
]
```

---

### 2. Criar Usuário

**POST** `/api/usuarios`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "email": "user@example.com",
  "nome": "Nome do Usuário",
  "tipo_usuario": "apontador",
  "password": "senha123"
}
```

---

### 3. Obter Usuário por ID

**GET** `/api/usuarios/<id>`

---

### 4. Atualizar Usuário

**PUT/PATCH** `/api/usuarios/<id>`

**Body:**
```json
{
  "nome": "Novo Nome",
  "telefone": "(11) 99999-9999"
}
```

---

### 5. Deletar Usuário

**DELETE** `/api/usuarios/<id>`

---

## 🏗️ Endpoints de Obras

### 1. Listar Obras

**GET** `/api/obras`

**Response:**
```json
[
  {
    "id": 1,
    "nome": "Duplicação BR-116",
    "codigo": "BR116-LOTE03",
    "local": "Trecho km 300 a 350",
    "km_inicial": "300.000",
    "km_final": "350.000",
    "data_inicio": "2025-01-01",
    "data_prevista_fim": "2025-12-31",
    "responsavel": 1,
    "responsavel_nome": "Engenheiro João",
    "status": "em_andamento",
    "created_at": "2025-11-15T10:00:00Z"
  }
]
```

---

### 2. Criar Obra

**POST** `/api/obras`

**Body:**
```json
{
  "nome": "Duplicação BR-116",
  "codigo": "BR116-LOTE03",
  "local": "Trecho km 300 a 350",
  "km_inicial": 300.0,
  "km_final": 350.0,
  "data_inicio": "2025-01-01",
  "data_prevista_fim": "2025-12-31",
  "responsavel": 1,
  "status": "planejamento"
}
```

---

### 3. Obter/Atualizar/Deletar Obra

**GET/PUT/PATCH/DELETE** `/api/obras/<id>`

---

## 🧪 Testes com cURL

### Login Admin:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "senha123"
  }'
```

### Login Motorista:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "matricula": "001234",
    "password": "senha123"
  }'
```

### Listar Usuários (com token):
```bash
curl -X GET http://localhost:8000/api/usuarios \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 🔧 Comandos Úteis

### Criar migrações após alterar models:
```bash
python manage.py makemigrations
python manage.py migrate
```

### Acessar shell do Django:
```bash
python manage.py shell
```

### Criar usuário via shell:
```python
from core.models import Usuario

usuario = Usuario.objects.create_user(
    email="admin@test.com",
    nome="Admin Test",
    tipo_usuario="admin",
    password="senha123"
)
```

---

## 📝 Próximas Implementações

- [ ] Endpoints de Equipamentos
- [ ] Endpoints de Atividades
- [ ] Endpoints de Registro de Jornada
- [ ] Endpoints de Diário de Obra
- [ ] Upload de fotos
- [ ] Geração de PDFs (RDO)
- [ ] Filtros avançados
- [ ] Paginação
- [ ] Documentação Swagger/OpenAPI
