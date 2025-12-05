# 📘 Guia Completo de Integração - Frontend & Backend

> **Documentação da API REST para Sistema de Gestão de Obras**  
> Versão: 1.0  
> Data: Dezembro 2025

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Configuração Inicial](#configuração-inicial)
3. [Autenticação](#autenticação)
4. [Endpoints da API](#endpoints-da-api)
5. [Modelos de Dados](#modelos-de-dados)
6. [Exemplos Práticos](#exemplos-práticos)
7. [Tratamento de Erros](#tratamento-de-erros)
8. [Boas Práticas](#boas-práticas)

---

## 🎯 Visão Geral

### Arquitetura da API

A API REST foi desenvolvida com **Django REST Framework** e implementa autenticação **JWT (JSON Web Token)**. O sistema suporta 4 perfis de usuários distintos:

- **Admin**: Gerenciamento completo do sistema
- **Apontador**: Registro de mão de obra
- **Encarregado**: Gestão de equipe e atividades
- **Motorista**: Registro de jornada de equipamentos

### Tecnologias Utilizadas

**Backend:**
- Django 5.2.8
- Django REST Framework 3.15.2
- djangorestframework-simplejwt 5.4.0
- django-cors-headers 4.6.0

**Frontend (Sugestão):**
- Next.js 14+
- TypeScript
- Axios/Fetch API

### URL Base

```
Desenvolvimento: http://localhost:8000/api
Produção: https://seu-dominio.com/api
```

---

## ⚙️ Configuração Inicial

### 1. Configuração do Backend

```bash
# Ativar ambiente virtual
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# Instalar dependências
pip install -r requirements.txt

# Aplicar migrações
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver
```

### 2. Configuração CORS

O backend já está configurado para aceitar requisições do frontend em:
- `http://localhost:3000`
- `http://127.0.0.1:3000`

Para adicionar outros domínios, edite `backend/api/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://seu-frontend.com",
]
```

### 3. Configuração do Cliente HTTP (Frontend)

**Exemplo com Axios:**

```typescript
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refresh: refreshToken }
        );

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

---

## 🔐 Autenticação

### Sistema de Autenticação JWT

A API utiliza JWT com dois tokens:

- **Access Token**: Válido por 24 horas
- **Refresh Token**: Válido por 7 dias

### Tipos de Login por Perfil

Cada perfil tem um método de login específico:

| Perfil       | Campo de Login | Exemplo           |
|--------------|----------------|-------------------|
| Admin        | Email          | admin@tcc.com     |
| Apontador    | Matrícula      | 001234            |
| Encarregado  | Matrícula      | 001235            |
| Motorista    | Matrícula      | 001236            |

### Endpoints de Autenticação

#### 1. Registro de Usuário

```http
POST /api/auth/registro
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "admin@example.com",        // Obrigatório para admin
  "matricula": "001234",               // Obrigatório para apontador/encarregado/motorista
  "nome": "João Silva",
  "cpf": "123.456.789-00",
  "telefone": "(11) 98765-4321",
  "tipo_usuario": "apontador",         // admin, apontador, encarregado, motorista
  "funcao": "apontador",               // Ver opções em Modelos de Dados
  "cargo": "Apontador de Obras",
  "password": "senha123",
  "password_confirm": "senha123"
}
```

**Response (201 Created):**

```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "matricula": "001234",
    "nome": "João Silva",
    "cpf": "123.456.789-00",
    "telefone": "(11) 98765-4321",
    "tipo_usuario": "apontador",
    "funcao": "apontador",
    "cargo": "Apontador de Obras",
    "is_active": true,
    "is_staff": false,
    "created_at": "2025-12-05T10:30:00Z",
    "updated_at": "2025-12-05T10:30:00Z"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

#### 2. Login (Admin - com Email)

```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "admin@tcc.com",
  "password": "senha123"
}
```

**Response (200 OK):**

```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": 1,
    "nome": "Administrador",
    "email": "admin@tcc.com",
    "matricula": null,
    "tipo_usuario": "admin",
    "funcao": "engenheiro",
    "cargo": "Engenheiro Responsável"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

#### 3. Login (Apontador/Encarregado/Motorista - com Matrícula)

```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**

```json
{
  "matricula": "001234",
  "password": "senha123"
}
```

**Response:** Mesmo formato do login com email

#### 4. Logout

```http
POST /api/auth/logout
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response (200 OK):**

```json
{
  "message": "Logout realizado com sucesso"
}
```

#### 5. Obter Dados do Usuário Logado

```http
GET /api/auth/me
Authorization: Bearer {access_token}
```

**Response (200 OK):**

```json
{
  "id": 1,
  "email": "admin@tcc.com",
  "matricula": null,
  "nome": "Administrador",
  "cpf": "123.456.789-00",
  "telefone": "(11) 98765-4321",
  "tipo_usuario": "admin",
  "funcao": "engenheiro",
  "cargo": "Engenheiro Responsável",
  "is_active": true,
  "is_staff": true,
  "created_at": "2025-01-01T10:00:00Z",
  "updated_at": "2025-12-05T10:30:00Z"
}
```

---

## 📡 Endpoints da API

### Convenções

Todos os endpoints seguem o padrão REST:

- **GET** `/api/recurso` - Listar todos
- **GET** `/api/recurso/{id}` - Obter específico
- **POST** `/api/recurso` - Criar novo
- **PUT/PATCH** `/api/recurso/{id}` - Atualizar
- **DELETE** `/api/recurso/{id}` - Deletar

### 1. Usuários

#### Listar Usuários

```http
GET /api/usuarios
Authorization: Bearer {access_token}
```

**Query Parameters (Opcionais):**
- `tipo`: Filtrar por tipo (admin, apontador, encarregado, motorista)

**Exemplo:**
```
GET /api/usuarios?tipo=apontador
```

**Response (200 OK):**

```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 2,
      "email": null,
      "matricula": "001234",
      "nome": "João Apontador",
      "cpf": "123.456.789-01",
      "telefone": "(11) 98765-4321",
      "tipo_usuario": "apontador",
      "funcao": "apontador",
      "cargo": "Apontador de Obras",
      "is_active": true,
      "is_staff": false,
      "created_at": "2025-01-15T08:00:00Z",
      "updated_at": "2025-01-15T08:00:00Z"
    }
  ]
}
```

#### Criar Usuário

```http
POST /api/usuarios
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:** Mesmo formato do registro

#### Obter Usuário Específico

```http
GET /api/usuarios/{id}
Authorization: Bearer {access_token}
```

#### Atualizar Usuário

```http
PUT /api/usuarios/{id}
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "nome": "João Silva Atualizado",
  "telefone": "(11) 99999-9999",
  "cargo": "Apontador Sênior"
}
```

#### Deletar Usuário

```http
DELETE /api/usuarios/{id}
Authorization: Bearer {access_token}
```

---

### 2. Obras

#### Listar Obras

```http
GET /api/obras
Authorization: Bearer {access_token}
```

**Response (200 OK):**

```json
{
  "count": 1,
  "results": [
    {
      "id": 1,
      "nome": "Pavimentação BR-101",
      "codigo": "OBR-001",
      "local": "BR-101 Trecho Sul",
      "km_inicial": "10.000",
      "km_final": "25.000",
      "data_inicio": "2025-01-01",
      "data_prevista_fim": "2025-12-31",
      "responsavel": 1,
      "responsavel_nome": "Administrador",
      "status": "em_andamento",
      "created_at": "2025-01-01T10:00:00Z",
      "updated_at": "2025-01-01T10:00:00Z"
    }
  ]
}
```

#### Criar Obra

```http
POST /api/obras
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "nome": "Pavimentação BR-101",
  "codigo": "OBR-001",
  "local": "BR-101 Trecho Sul",
  "km_inicial": "10.000",
  "km_final": "25.000",
  "data_inicio": "2025-01-01",
  "data_prevista_fim": "2025-12-31",
  "responsavel": 1,
  "status": "em_andamento"
}
```

**Opções de Status:**
- `planejamento`
- `em_andamento`
- `pausada`
- `concluida`

---

### 3. Equipamentos

#### Listar Equipamentos

```http
GET /api/equipamentos
Authorization: Bearer {access_token}
```

**Query Parameters (Opcionais):**
- `obra`: ID da obra
- `status`: Status do equipamento (ativo, manutencao, inativo)
- `tipo`: Tipo do equipamento

**Exemplo:**
```
GET /api/equipamentos?obra=1&status=ativo
```

**Response (200 OK):**

```json
{
  "count": 1,
  "results": [
    {
      "id": 1,
      "nome": "Caminhão Basculante 001",
      "tipo": "caminhao",
      "modelo": "MB 1620",
      "placa": "ABC-1234",
      "fabricante": "Mercedes-Benz",
      "ano": 2020,
      "horimetro_atual": "1500.5",
      "status": "ativo",
      "obra": 1,
      "obra_nome": "Pavimentação BR-101",
      "motorista_atual": 3,
      "motorista_nome": "Carlos Motorista",
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-12-05T14:30:00Z"
    }
  ]
}
```

#### Criar Equipamento

```http
POST /api/equipamentos
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "nome": "Caminhão Basculante 001",
  "tipo": "caminhao",
  "modelo": "MB 1620",
  "placa": "ABC-1234",
  "fabricante": "Mercedes-Benz",
  "ano": 2020,
  "horimetro_atual": "1500.5",
  "status": "ativo",
  "obra": 1,
  "motorista_atual": 3
}
```

**Tipos de Equipamento:**
- `caminhao` - Caminhão
- `escavadeira` - Escavadeira
- `rolo_compactador` - Rolo Compactador
- `motoniveladora` - Motoniveladora
- `retroescavadeira` - Retroescavadeira
- `trator` - Trator
- `carregadeira` - Carregadeira
- `patrol` - Patrol

---

### 4. Contratos

#### Listar Contratos

```http
GET /api/contratos
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `obra`: ID da obra

**Response (200 OK):**

```json
{
  "count": 1,
  "results": [
    {
      "id": 1,
      "fornecedor": "Construtora XYZ Ltda",
      "cnpj": "12.345.678/0001-90",
      "tipo": "mao_obra",
      "numero_contrato": "CT-2025-001",
      "valor_mensal": "50000.00",
      "data_inicio": "2025-01-01",
      "data_fim": "2025-12-31",
      "obra": 1,
      "obra_nome": "Pavimentação BR-101",
      "ativo": true,
      "created_at": "2025-01-01T10:00:00Z",
      "updated_at": "2025-01-01T10:00:00Z"
    }
  ]
}
```

**Tipos de Contrato:**
- `materiais` - Materiais
- `mao_obra` - Mão de Obra
- `equipamentos` - Equipamentos
- `servicos` - Serviços
- `consultoria` - Consultoria
- `locacao` - Locação
- `manutencao` - Manutenção
- `outros` - Outros

---

### 5. Critérios de Medição

#### Listar Critérios

```http
GET /api/criterios-medicao
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `obra`: ID da obra

**Response (200 OK):**

```json
{
  "count": 1,
  "results": [
    {
      "id": 1,
      "nome": "Desconto por Atraso",
      "tipo": "desconto",
      "percentual": "5.00",
      "condicao": "Aplicar quando atividade não for concluída no prazo",
      "aplicacao": "Medição mensal",
      "ativo": true,
      "obra": 1,
      "obra_nome": "Pavimentação BR-101",
      "created_at": "2025-01-01T10:00:00Z",
      "updated_at": "2025-01-01T10:00:00Z"
    }
  ]
}
```

---

### 6. Categorias de Atividades

#### Listar Categorias

```http
GET /api/categorias-atividades
Authorization: Bearer {access_token}
```

**Response (200 OK):**

```json
{
  "count": 3,
  "results": [
    {
      "id": 1,
      "nome": "Terraplenagem",
      "descricao": "Serviços de movimentação de terra"
    },
    {
      "id": 2,
      "nome": "Pavimentação",
      "descricao": "Serviços de pavimentação asfáltica"
    },
    {
      "id": 3,
      "nome": "Drenagem",
      "descricao": "Serviços de drenagem e obras de arte"
    }
  ]
}
```

---

### 7. Atividades (Serviços)

#### Listar Atividades

```http
GET /api/atividades
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `obra`: ID da obra
- `categoria`: ID da categoria
- `ativa`: true/false

**Exemplo:**
```
GET /api/atividades?obra=1&ativa=true
```

**Response (200 OK):**

```json
{
  "count": 1,
  "results": [
    {
      "id": 1,
      "codigo": "SERV-001",
      "descricao": "Escavação de vala",
      "unidade": "m3",
      "categoria": 1,
      "categoria_nome": "Terraplenagem",
      "preco_unitario": "150.00",
      "obra": 1,
      "obra_nome": "Pavimentação BR-101",
      "ativa": true,
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-01-15T10:00:00Z"
    }
  ]
}
```

**Unidades Disponíveis:**
- `m` - Metro
- `m2` - Metro Quadrado
- `m3` - Metro Cúbico
- `kg` - Quilograma
- `t` - Tonelada
- `un` - Unidade
- `h` - Hora
- `dia` - Dia

---

### 8. Registros de Equipamentos

#### Listar Registros

```http
GET /api/registros-equipamentos
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `equipamento`: ID do equipamento
- `motorista`: ID do motorista
- `data`: Data no formato YYYY-MM-DD
- `validado`: true/false

**Exemplo:**
```
GET /api/registros-equipamentos?equipamento=1&validado=false
```

**Response (200 OK):**

```json
{
  "count": 1,
  "results": [
    {
      "id": 1,
      "equipamento": 1,
      "equipamento_nome": "Caminhão Basculante 001",
      "motorista": 3,
      "motorista_nome": "Carlos Motorista",
      "apontador": null,
      "apontador_nome": null,
      "data": "2025-11-15",
      "horimetro_inicial": "1500.5",
      "horimetro_final": "1508.2",
      "hora_inicio": "08:00:00",
      "hora_fim": "17:00:00",
      "atividade_principal": "Transporte de material",
      "local": "KM 15+500",
      "observacoes": "Tempo bom, dia produtivo",
      "fotos": [],
      "validado": false,
      "validado_por": null,
      "data_validacao": null,
      "horas_trabalhadas": 9.0,
      "horimetro_trabalhado": 7.7,
      "created_at": "2025-11-15T18:30:00Z",
      "updated_at": "2025-11-15T18:30:00Z"
    }
  ]
}
```

#### Criar Registro de Equipamento

```http
POST /api/registros-equipamentos
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "equipamento": 1,
  "motorista": 3,
  "data": "2025-12-05",
  "horimetro_inicial": "1508.2",
  "horimetro_final": "1516.5",
  "hora_inicio": "07:30",
  "hora_fim": "16:30",
  "atividade_principal": "Transporte de asfalto",
  "local": "KM 18+200",
  "observacoes": "15 viagens realizadas",
  "fotos": []
}
```

#### Validar Registro de Equipamento

```http
POST /api/registros-equipamentos/{id}/validar
Authorization: Bearer {access_token}
```

**Permissões:** Apenas encarregados e admins podem validar.

**Response (200 OK):**

```json
{
  "id": 1,
  "equipamento": 1,
  "equipamento_nome": "Caminhão Basculante 001",
  "motorista": 3,
  "motorista_nome": "Carlos Motorista",
  "data": "2025-11-15",
  "horimetro_inicial": "1500.5",
  "horimetro_final": "1508.2",
  "hora_inicio": "08:00:00",
  "hora_fim": "17:00:00",
  "atividade_principal": "Transporte de material",
  "local": "KM 15+500",
  "observacoes": "Tempo bom, dia produtivo",
  "fotos": [],
  "validado": true,
  "validado_por": 2,
  "data_validacao": "2025-12-05T10:30:00Z",
  "horas_trabalhadas": 9.0,
  "horimetro_trabalhado": 7.7,
  "created_at": "2025-11-15T18:30:00Z",
  "updated_at": "2025-12-05T10:30:00Z"
}
```

---

### 9. Registros de Mão de Obra

#### Listar Registros

```http
GET /api/registros-mao-obra
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `obra`: ID da obra
- `apontador`: ID do apontador
- `data`: Data no formato YYYY-MM-DD
- `validado`: true/false

**Response (200 OK):**

```json
{
  "count": 1,
  "results": [
    {
      "id": 1,
      "apontador": 2,
      "apontador_nome": "João Apontador",
      "obra": 1,
      "obra_nome": "Pavimentação BR-101",
      "data": "2025-12-05",
      "funcionarios_presentes": [4, 5, 6],
      "funcionarios_nomes": ["Pedro Silva", "Maria Santos", "José Costa"],
      "total_funcionarios": 3,
      "hora_inicio": "07:00:00",
      "hora_fim": "16:00:00",
      "local": "KM 10+000 a KM 12+000",
      "observacoes": "Dia produtivo, boa execução",
      "fotos": [],
      "servicos": [
        {
          "id": 1,
          "atividade": 1,
          "atividade_descricao": "Escavação de vala",
          "quantidade": "25.50",
          "unidade": "m3"
        }
      ],
      "validado": false,
      "validado_por": null,
      "created_at": "2025-12-05T16:30:00Z",
      "updated_at": "2025-12-05T16:30:00Z"
    }
  ]
}
```

#### Criar Registro de Mão de Obra

```http
POST /api/registros-mao-obra
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "apontador": 2,
  "obra": 1,
  "data": "2025-12-05",
  "funcionarios_presentes": [4, 5, 6],
  "total_funcionarios": 3,
  "hora_inicio": "07:00",
  "hora_fim": "16:00",
  "local": "KM 10+000 a KM 12+000",
  "observacoes": "Dia produtivo",
  "fotos": []
}
```

#### Validar Registro de Mão de Obra

```http
POST /api/registros-mao-obra/{id}/validar
Authorization: Bearer {access_token}
```

**Permissões:** Apenas encarregados e admins podem validar.

---

### 10. Atividades da Equipe

#### Listar Atividades

```http
GET /api/atividades-equipe
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `obra`: ID da obra
- `encarregado`: ID do encarregado
- `data`: Data no formato YYYY-MM-DD
- `status`: Status da atividade

**Response (200 OK):**

```json
{
  "count": 1,
  "results": [
    {
      "id": 1,
      "encarregado": 5,
      "encarregado_nome": "Paulo Encarregado",
      "obra": 1,
      "obra_nome": "Pavimentação BR-101",
      "descricao": "Pavimentação do trecho KM 15",
      "data": "2025-12-06",
      "hora_inicio": "07:00:00",
      "hora_fim": null,
      "local": "KM 15+000 a KM 15+500",
      "funcionarios": [4, 5, 6, 7],
      "funcionarios_nomes": ["Pedro Silva", "Maria Santos", "José Costa", "Ana Oliveira"],
      "observacoes": "Pavimentação de 500m",
      "status": "planejada",
      "created_at": "2025-12-05T14:00:00Z",
      "updated_at": "2025-12-05T14:00:00Z"
    }
  ]
}
```

**Status Disponíveis:**
- `planejada` - Planejada
- `em_andamento` - Em Andamento
- `concluida` - Concluída
- `cancelada` - Cancelada

#### Criar Atividade da Equipe

```http
POST /api/atividades-equipe
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "encarregado": 5,
  "obra": 1,
  "descricao": "Pavimentação do trecho KM 15",
  "data": "2025-12-06",
  "hora_inicio": "07:00",
  "hora_fim": null,
  "local": "KM 15+000 a KM 15+500",
  "funcionarios": [4, 5, 6, 7],
  "observacoes": "Pavimentação de 500m",
  "status": "planejada"
}
```

---

### 11. Diários de Obra (RDO)

#### Listar Diários

```http
GET /api/diarios-obra
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `obra`: ID da obra
- `encarregado`: ID do encarregado
- `data`: Data no formato YYYY-MM-DD

**Response (200 OK):**

```json
{
  "count": 1,
  "results": [
    {
      "id": 1,
      "encarregado": 5,
      "encarregado_nome": "Paulo Encarregado",
      "obra": 1,
      "obra_nome": "Pavimentação BR-101",
      "data": "2025-12-05",
      "total_funcionarios": 10,
      "funcionarios_presentes": 9,
      "atividades_concluidas": 3,
      "atividades_parciais": 1,
      "condicoes_climaticas": "Ensolarado, 28°C",
      "observacoes": "Bom andamento das obras. Uma atividade foi parcialmente concluída devido à falta de material.",
      "atividades": [1, 2, 3],
      "atividades_detalhes": [...],
      "equipamentos": [1, 2],
      "equipamentos_detalhes": [...],
      "pdf_gerado": null,
      "created_at": "2025-12-05T17:00:00Z",
      "updated_at": "2025-12-05T17:00:00Z"
    }
  ]
}
```

#### Criar Diário de Obra

```http
POST /api/diarios-obra
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "encarregado": 5,
  "obra": 1,
  "data": "2025-12-05",
  "total_funcionarios": 10,
  "funcionarios_presentes": 9,
  "atividades_concluidas": 3,
  "atividades_parciais": 1,
  "condicoes_climaticas": "Ensolarado, 28°C",
  "observacoes": "Bom andamento das obras",
  "atividades": [1, 2, 3],
  "equipamentos": [1, 2]
}
```

---

### 12. Dashboard (Estatísticas)

#### Obter Estatísticas do Dashboard

```http
GET /api/dashboard/stats
Authorization: Bearer {access_token}
```

**Response varia por tipo de usuário:**

**Admin:**
```json
{
  "total_obras": 5,
  "obras_ativas": 3,
  "total_equipamentos": 12,
  "equipamentos_ativos": 10,
  "total_usuarios": 25,
  "total_contratos": 8
}
```

**Apontador:**
```json
{
  "registros_hoje": 1,
  "registros_pendentes": 3,
  "total_registros": 45
}
```

**Encarregado:**
```json
{
  "atividades_hoje": 2,
  "atividades_pendentes": 5,
  "diarios_criados": 15,
  "registros_validar": 7
}
```

**Motorista:**
```json
{
  "registros_hoje": 1,
  "registros_pendentes": 2,
  "total_registros": 30,
  "equipamento_atual": "Caminhão Basculante 001"
}
```

---

### 13. Importação e Exportação

#### Importar CSV

```http
POST /api/importar-csv
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Permissões:** Apenas admins e encarregados.

**Form Data:**
- `tipo`: obras, equipamentos, usuarios, atividades, registros_equipamentos, registros_mao_obra, diarios_obra
- `arquivo`: Arquivo CSV

**Response (200 OK):**

```json
{
  "message": "Importação concluída",
  "tipo": "equipamentos",
  "resultado": {
    "criados": 5,
    "atualizados": 2,
    "erros": 0
  }
}
```

#### Download Modelo CSV

```http
GET /api/modelo-csv/{tipo}
Authorization: Bearer {access_token}
```

**Tipos disponíveis:**
- obras
- equipamentos
- usuarios
- atividades
- registros_equipamentos
- registros_mao_obra
- diarios_obra

**Response:** Arquivo CSV

#### Exportar CSV

```http
GET /api/exportar-csv/{tipo}
Authorization: Bearer {access_token}
```

**Query Parameters (Opcionais):**
- `obra`: ID da obra
- `data_inicio`: Data início (YYYY-MM-DD)
- `data_fim`: Data fim (YYYY-MM-DD)

**Exemplo:**
```
GET /api/exportar-csv/registros_equipamentos?obra=1&data_inicio=2025-11-01&data_fim=2025-11-30
```

**Response:** Arquivo CSV

---

## 📊 Modelos de Dados

### Usuario

```typescript
interface Usuario {
  id: number;
  email: string | null;
  matricula: string | null;
  nome: string;
  cpf: string | null;
  telefone: string | null;
  tipo_usuario: 'admin' | 'apontador' | 'encarregado' | 'motorista';
  funcao: string | null;
  cargo: string | null;
  is_active: boolean;
  is_staff: boolean;
  created_at: string;
  updated_at: string;
}
```

**Funções Disponíveis:**
- `engenheiro` - Engenheiro
- `tecnico` - Técnico
- `encarregado` - Encarregado
- `apontador` - Apontador
- `motorista` - Motorista
- `operador` - Operador de Equipamento
- `servente` - Servente
- `pedreiro` - Pedreiro
- `armador` - Armador
- `carpinteiro` - Carpinteiro
- `eletricista` - Eletricista
- `mecanico` - Mecânico

### Obra

```typescript
interface Obra {
  id: number;
  nome: string;
  codigo: string;
  local: string;
  km_inicial: string;
  km_final: string;
  data_inicio: string;
  data_prevista_fim: string;
  responsavel: number;
  responsavel_nome: string;
  status: 'planejamento' | 'em_andamento' | 'pausada' | 'concluida';
  created_at: string;
  updated_at: string;
}
```

### Equipamento

```typescript
interface Equipamento {
  id: number;
  nome: string;
  tipo: string;
  modelo: string;
  placa: string;
  fabricante: string;
  ano: number;
  horimetro_atual: string;
  status: 'ativo' | 'manutencao' | 'inativo';
  obra: number | null;
  obra_nome: string;
  motorista_atual: number | null;
  motorista_nome: string;
  created_at: string;
  updated_at: string;
}
```

### RegistroEquipamento

```typescript
interface RegistroEquipamento {
  id: number;
  equipamento: number;
  equipamento_nome: string;
  motorista: number;
  motorista_nome: string;
  apontador: number | null;
  apontador_nome: string | null;
  data: string;
  horimetro_inicial: string;
  horimetro_final: string;
  hora_inicio: string;
  hora_fim: string;
  atividade_principal: string;
  local: string;
  observacoes: string;
  fotos: string[];
  validado: boolean;
  validado_por: number | null;
  data_validacao: string | null;
  horas_trabalhadas: number;
  horimetro_trabalhado: number;
  created_at: string;
  updated_at: string;
}
```

### RegistroMaoObra

```typescript
interface RegistroMaoObra {
  id: number;
  apontador: number;
  apontador_nome: string;
  obra: number;
  obra_nome: string;
  data: string;
  funcionarios_presentes: number[];
  funcionarios_nomes: string[];
  total_funcionarios: number;
  hora_inicio: string;
  hora_fim: string;
  local: string;
  observacoes: string;
  fotos: string[];
  servicos: ServicoExecutado[];
  validado: boolean;
  validado_por: number | null;
  created_at: string;
  updated_at: string;
}

interface ServicoExecutado {
  id: number;
  atividade: number;
  atividade_descricao: string;
  quantidade: string;
  unidade: string;
}
```

### AtividadeEquipe

```typescript
interface AtividadeEquipe {
  id: number;
  encarregado: number;
  encarregado_nome: string;
  obra: number;
  obra_nome: string;
  descricao: string;
  data: string;
  hora_inicio: string;
  hora_fim: string | null;
  local: string;
  funcionarios: number[];
  funcionarios_nomes: string[];
  observacoes: string;
  status: 'planejada' | 'em_andamento' | 'concluida' | 'cancelada';
  created_at: string;
  updated_at: string;
}
```

### DiarioObra

```typescript
interface DiarioObra {
  id: number;
  encarregado: number;
  encarregado_nome: string;
  obra: number;
  obra_nome: string;
  data: string;
  total_funcionarios: number;
  funcionarios_presentes: number;
  atividades_concluidas: number;
  atividades_parciais: number;
  condicoes_climaticas: string;
  observacoes: string;
  atividades: number[];
  atividades_detalhes: AtividadeEquipe[];
  equipamentos: number[];
  equipamentos_detalhes: RegistroEquipamento[];
  pdf_gerado: string | null;
  created_at: string;
  updated_at: string;
}
```

---

## 💡 Exemplos Práticos

### 1. Fluxo Completo de Login (Frontend)

```typescript
// services/auth.ts
import api from '@/lib/api';

interface LoginCredentials {
  email?: string;
  matricula?: string;
  password: string;
}

interface AuthResponse {
  message: string;
  user: Usuario;
  tokens: {
    access: string;
    refresh: string;
  };
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    // Salvar tokens
    localStorage.setItem('access_token', response.data.tokens.access);
    localStorage.setItem('refresh_token', response.data.tokens.refresh);
    
    // Salvar dados do usuário
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function logout(): Promise<void> {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (refreshToken) {
      await api.post('/auth/logout', { refresh: refreshToken });
    }
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  } finally {
    // Limpar storage independente do resultado
    localStorage.clear();
  }
}

export async function getCurrentUser(): Promise<Usuario> {
  const response = await api.get<Usuario>('/auth/me');
  return response.data;
}
```

### 2. Exemplo de Componente de Login

```typescript
// app/login/admin/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login({ email, password });
      
      if (response.user.tipo_usuario !== 'admin') {
        setError('Este login é apenas para administradores');
        localStorage.clear();
        return;
      }

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Login Admin</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
```

### 3. Hook Customizado para Autenticação

```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/services/auth';
import type { Usuario } from '@/types';

export function useAuth(requiredType?: string) {
  const router = useRouter();
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          router.push('/login');
          return;
        }

        const currentUser = await getCurrentUser();
        setUser(currentUser);

        // Verificar tipo de usuário se necessário
        if (requiredType && currentUser.tipo_usuario !== requiredType) {
          router.push('/login');
          return;
        }
      } catch (error) {
        localStorage.clear();
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router, requiredType]);

  return { user, loading };
}
```

### 4. Criar Registro de Equipamento

```typescript
// services/equipamentos.ts
import api from '@/lib/api';

interface CreateRegistroEquipamento {
  equipamento: number;
  motorista: number;
  data: string;
  horimetro_inicial: string;
  horimetro_final: string;
  hora_inicio: string;
  hora_fim: string;
  atividade_principal: string;
  local: string;
  observacoes?: string;
  fotos?: string[];
}

export async function createRegistroEquipamento(
  data: CreateRegistroEquipamento
): Promise<RegistroEquipamento> {
  const response = await api.post<RegistroEquipamento>(
    '/registros-equipamentos',
    data
  );
  return response.data;
}

export async function validarRegistroEquipamento(id: number): Promise<RegistroEquipamento> {
  const response = await api.post<RegistroEquipamento>(
    `/registros-equipamentos/${id}/validar`
  );
  return response.data;
}
```

### 5. Listar Obras com Filtros

```typescript
// services/obras.ts
import api from '@/lib/api';

interface ObraFilters {
  status?: string;
  responsavel?: number;
}

export async function getObras(filters?: ObraFilters): Promise<Obra[]> {
  const params = new URLSearchParams();
  
  if (filters?.status) {
    params.append('status', filters.status);
  }
  
  if (filters?.responsavel) {
    params.append('responsavel', filters.responsavel.toString());
  }

  const response = await api.get<{ results: Obra[] }>(
    `/obras?${params.toString()}`
  );
  
  return response.data.results;
}

export async function getObra(id: number): Promise<Obra> {
  const response = await api.get<Obra>(`/obras/${id}`);
  return response.data;
}
```

### 6. Dashboard com Estatísticas

```typescript
// app/admin/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';

interface DashboardStats {
  total_obras: number;
  obras_ativas: number;
  total_equipamentos: number;
  equipamentos_ativos: number;
  total_usuarios: number;
  total_contratos: number;
}

export default function AdminDashboard() {
  const { user, loading } = useAuth('admin');
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await api.get<DashboardStats>('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      }
    }

    if (user) {
      loadStats();
    }
  }, [user]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Bem-vindo, {user?.nome}
      </h1>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Total de Obras</h3>
            <p className="text-3xl font-bold mt-2">{stats.total_obras}</p>
            <p className="text-sm text-gray-600 mt-1">
              {stats.obras_ativas} ativas
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Equipamentos</h3>
            <p className="text-3xl font-bold mt-2">{stats.total_equipamentos}</p>
            <p className="text-sm text-gray-600 mt-1">
              {stats.equipamentos_ativos} ativos
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Usuários</h3>
            <p className="text-3xl font-bold mt-2">{stats.total_usuarios}</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## ⚠️ Tratamento de Erros

### Códigos de Status HTTP

| Código | Descrição | Quando Ocorre |
|--------|-----------|---------------|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado com sucesso |
| 400 | Bad Request | Dados inválidos na requisição |
| 401 | Unauthorized | Token inválido ou ausente |
| 403 | Forbidden | Sem permissão para a ação |
| 404 | Not Found | Recurso não encontrado |
| 500 | Internal Server Error | Erro no servidor |

### Formato de Erros

```json
{
  "error": "Mensagem de erro descritiva",
  "field_errors": {
    "email": ["Este campo é obrigatório"],
    "password": ["A senha deve ter no mínimo 6 caracteres"]
  }
}
```

### Exemplo de Tratamento

```typescript
try {
  const response = await api.post('/auth/login', credentials);
  return response.data;
} catch (error: any) {
  if (error.response) {
    // Erro da API
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        // Dados inválidos
        if (data.field_errors) {
          // Exibir erros de campo
          Object.entries(data.field_errors).forEach(([field, errors]) => {
            console.error(`${field}: ${errors}`);
          });
        } else {
          console.error(data.error);
        }
        break;

      case 401:
        // Não autenticado
        localStorage.clear();
        window.location.href = '/login';
        break;

      case 403:
        // Sem permissão
        alert('Você não tem permissão para esta ação');
        break;

      case 404:
        // Não encontrado
        alert('Recurso não encontrado');
        break;

      case 500:
        // Erro do servidor
        alert('Erro no servidor. Tente novamente mais tarde.');
        break;

      default:
        alert('Erro desconhecido');
    }
  } else if (error.request) {
    // Sem resposta do servidor
    alert('Não foi possível conectar ao servidor');
  } else {
    // Erro na configuração da requisição
    console.error('Erro:', error.message);
  }
}
```

---

## ✅ Boas Práticas

### 1. Segurança

- **Sempre use HTTPS em produção**
- **Nunca exponha tokens no código ou logs**
- **Implemente rate limiting**
- **Valide dados no frontend e backend**
- **Use variáveis de ambiente para configurações sensíveis**

```typescript
// .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 2. Performance

- **Use paginação para listas grandes**
- **Implemente cache quando apropriado**
- **Faça requisições em paralelo quando possível**

```typescript
// Carregar múltiplos recursos em paralelo
const [obras, equipamentos, usuarios] = await Promise.all([
  api.get('/obras'),
  api.get('/equipamentos'),
  api.get('/usuarios'),
]);
```

### 3. Experiência do Usuário

- **Sempre mostre loading states**
- **Forneça feedback claro de sucesso/erro**
- **Implemente debounce em buscas**

```typescript
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';

function SearchComponent() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const debouncedSearch = debounce(async (term) => {
      if (term.length > 2) {
        const response = await api.get(`/obras?search=${term}`);
        setResults(response.data.results);
      }
    }, 300);

    debouncedSearch(search);

    return () => debouncedSearch.cancel();
  }, [search]);

  // ...
}
```

### 4. Organização do Código

```
frontend/
├── app/                    # Pages Next.js
├── components/             # Componentes reutilizáveis
├── contexts/               # Contexts React
├── hooks/                  # Custom hooks
├── lib/
│   ├── api.ts             # Configuração Axios
│   └── utils.ts           # Utilitários
├── services/              # Chamadas API organizadas
│   ├── auth.ts
│   ├── obras.ts
│   ├── equipamentos.ts
│   └── registros.ts
└── types/                 # TypeScript types
    └── index.ts
```

### 5. TypeScript Types

```typescript
// types/index.ts
export interface Usuario {
  id: number;
  email: string | null;
  matricula: string | null;
  nome: string;
  tipo_usuario: 'admin' | 'apontador' | 'encarregado' | 'motorista';
  // ... outros campos
}

export interface Obra {
  id: number;
  nome: string;
  codigo: string;
  // ... outros campos
}

// ... outros tipos
```

### 6. Validação de Formulários

```typescript
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido').optional(),
  matricula: z.string().min(6, 'Matrícula deve ter no mínimo 6 caracteres').optional(),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
}).refine(data => data.email || data.matricula, {
  message: 'Forneça email ou matrícula',
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const handleSubmit = (data: LoginFormData) => {
    try {
      loginSchema.parse(data);
      // Prosseguir com login
    } catch (error) {
      // Mostrar erros de validação
    }
  };
}
```

---

## 📚 Recursos Adicionais

### Documentação Relacionada

- [Django REST Framework](https://www.django-rest-framework.org/)
- [djangorestframework-simplejwt](https://django-rest-framework-simplejwt.readthedocs.io/)
- [Next.js](https://nextjs.org/docs)
- [Axios](https://axios-http.com/docs/intro)

### Comandos Úteis

```bash
# Backend
python manage.py makemigrations    # Criar migrações
python manage.py migrate           # Aplicar migrações
python manage.py createsuperuser   # Criar admin
python manage.py runserver         # Iniciar servidor

# Frontend
npm run dev                        # Desenvolvimento
npm run build                      # Build produção
npm run start                      # Iniciar produção
```

### Testando a API

**Com cURL:**

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tcc.com","password":"senha123"}'

# Listar obras (com token)
curl -X GET http://localhost:8000/api/obras \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Com Postman/Insomnia:**

1. Importar variáveis de ambiente
2. Configurar base URL: `http://localhost:8000/api`
3. Criar requisição de login
4. Salvar token automaticamente
5. Usar token em outras requisições

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique esta documentação
2. Consulte os logs do backend: `python manage.py runserver`
3. Verifique o console do navegador
4. Revise as configurações de CORS
5. Confirme que o backend está rodando

---

**Última atualização:** Dezembro 2025  
**Versão da API:** 1.0  
**Autor:** Sistema TCC Web Interface
