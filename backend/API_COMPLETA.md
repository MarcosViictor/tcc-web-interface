# 📘 API Completa - TCC Web Interface Backend

## 🌐 Base URL
```
http://127.0.0.1:8000/api/
```

## 🔐 Autenticação
Todos os endpoints (exceto login e registro) requerem autenticação via JWT Token.

**Header necessário:**
```
Authorization: Bearer {access_token}
```

---

## 📋 ÍNDICE DE ENDPOINTS

### 🔑 Autenticação
- `POST /api/auth/registro` - Registrar novo usuário
- `POST /api/auth/login` - Login (email ou matrícula)
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Dados do usuário logado

### 👥 Usuários
- `GET /api/usuarios` - Listar usuários
- `POST /api/usuarios` - Criar usuário
- `GET /api/usuarios/{id}` - Detalhes do usuário
- `PUT /api/usuarios/{id}` - Atualizar usuário
- `DELETE /api/usuarios/{id}` - Excluir usuário

### 🏗️ Obras
- `GET /api/obras` - Listar obras
- `POST /api/obras` - Criar obra
- `GET /api/obras/{id}` - Detalhes da obra
- `PUT /api/obras/{id}` - Atualizar obra
- `DELETE /api/obras/{id}` - Excluir obra

### 🚜 Equipamentos
- `GET /api/equipamentos` - Listar equipamentos
- `POST /api/equipamentos` - Criar equipamento
- `GET /api/equipamentos/{id}` - Detalhes do equipamento
- `PUT /api/equipamentos/{id}` - Atualizar equipamento
- `DELETE /api/equipamentos/{id}` - Excluir equipamento

### 📄 Contratos
- `GET /api/contratos` - Listar contratos
- `POST /api/contratos` - Criar contrato
- `GET /api/contratos/{id}` - Detalhes do contrato
- `PUT /api/contratos/{id}` - Atualizar contrato
- `DELETE /api/contratos/{id}` - Excluir contrato

### 📊 Critérios de Medição
- `GET /api/criterios-medicao` - Listar critérios
- `POST /api/criterios-medicao` - Criar critério
- `GET /api/criterios-medicao/{id}` - Detalhes do critério
- `PUT /api/criterios-medicao/{id}` - Atualizar critério
- `DELETE /api/criterios-medicao/{id}` - Excluir critério

### 🏷️ Categorias de Atividades
- `GET /api/categorias-atividades` - Listar categorias
- `POST /api/categorias-atividades` - Criar categoria
- `GET /api/categorias-atividades/{id}` - Detalhes da categoria
- `PUT /api/categorias-atividades/{id}` - Atualizar categoria
- `DELETE /api/categorias-atividades/{id}` - Excluir categoria

### 📝 Atividades
- `GET /api/atividades` - Listar atividades
- `POST /api/atividades` - Criar atividade
- `GET /api/atividades/{id}` - Detalhes da atividade
- `PUT /api/atividades/{id}` - Atualizar atividade
- `DELETE /api/atividades/{id}` - Excluir atividade

### 🚜 Registros de Equipamentos
- `GET /api/registros-equipamentos` - Listar registros
- `POST /api/registros-equipamentos` - Criar registro
- `GET /api/registros-equipamentos/{id}` - Detalhes do registro
- `PUT /api/registros-equipamentos/{id}` - Atualizar registro
- `DELETE /api/registros-equipamentos/{id}` - Excluir registro
- `POST /api/registros-equipamentos/{id}/validar` - Validar registro

### 👷 Registros de Mão de Obra
- `GET /api/registros-mao-obra` - Listar registros
- `POST /api/registros-mao-obra` - Criar registro
- `GET /api/registros-mao-obra/{id}` - Detalhes do registro
- `PUT /api/registros-mao-obra/{id}` - Atualizar registro
- `DELETE /api/registros-mao-obra/{id}` - Excluir registro
- `POST /api/registros-mao-obra/{id}/validar` - Validar registro

### 👥 Atividades da Equipe
- `GET /api/atividades-equipe` - Listar atividades
- `POST /api/atividades-equipe` - Criar atividade
- `GET /api/atividades-equipe/{id}` - Detalhes da atividade
- `PUT /api/atividades-equipe/{id}` - Atualizar atividade
- `DELETE /api/atividades-equipe/{id}` - Excluir atividade

### 📖 Diários de Obra (RDO)
- `GET /api/diarios-obra` - Listar diários
- `POST /api/diarios-obra` - Criar diário
- `GET /api/diarios-obra/{id}` - Detalhes do diário
- `PUT /api/diarios-obra/{id}` - Atualizar diário
- `DELETE /api/diarios-obra/{id}` - Excluir diário

### 📊 Dashboard
- `GET /api/dashboard/stats` - Estatísticas personalizadas por perfil

### 📥 Importação/Exportação CSV
- `POST /api/importar-csv` - Importar dados de planilha CSV
- `GET /api/modelo-csv/{tipo}` - Baixar modelo CSV
- `GET /api/exportar-csv/{tipo}` - Exportar dados para CSV

---

## 🔑 AUTENTICAÇÃO

### Login
```http
POST /api/auth/login
Content-Type: application/json

# Admin (usa email):
{
  "email": "admin@tcc.com",
  "password": "admin123"
}

# Apontador/Encarregado/Motorista (usa matrícula):
{
  "matricula": "001234",
  "password": "apontador123"
}
```

**Resposta:**
```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": 1,
    "nome": "Administrador",
    "email": "admin@tcc.com",
    "tipo_usuario": "admin",
    "funcao": "administrador"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### Registro
```http
POST /api/auth/registro
Content-Type: application/json

{
  "email": "novo@email.com",
  "matricula": "001237",
  "nome": "Nome Completo",
  "cpf": "123.456.789-00",
  "telefone": "(11) 98765-4321",
  "tipo_usuario": "apontador",
  "funcao": "apontador",
  "cargo": "Apontador de Obra",
  "password": "senha123",
  "password_confirm": "senha123"
}
```

---

## 🚜 EQUIPAMENTOS

### Listar Equipamentos
```http
GET /api/equipamentos
Authorization: Bearer {token}

# Filtros opcionais:
GET /api/equipamentos?obra=1
GET /api/equipamentos?status=ativo
GET /api/equipamentos?tipo=caminhao
```

**Resposta:**
```json
[
  {
    "id": 1,
    "nome": "Caminhão Basculante 001",
    "tipo": "caminhao",
    "modelo": "MB 1620",
    "placa": "ABC-1234",
    "fabricante": "Mercedes-Benz",
    "ano": 2020,
    "horimetro_atual": 1500.5,
    "status": "ativo",
    "obra": 1,
    "obra_nome": "Obra Principal",
    "motorista_atual": 3,
    "motorista_nome": "João Motorista",
    "created_at": "2025-11-15T10:00:00Z",
    "updated_at": "2025-11-15T10:00:00Z"
  }
]
```

### Criar Equipamento
```http
POST /api/equipamentos
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Escavadeira Hidráulica 002",
  "tipo": "escavadeira",
  "modelo": "PC200",
  "placa": "XYZ-5678",
  "fabricante": "Komatsu",
  "ano": 2021,
  "horimetro_atual": 800.0,
  "status": "ativo",
  "obra": 1
}
```

---

## 📝 ATIVIDADES

### Listar Atividades
```http
GET /api/atividades
Authorization: Bearer {token}

# Filtros:
GET /api/atividades?obra=1
GET /api/atividades?categoria=1
GET /api/atividades?ativa=true
```

### Criar Atividade
```http
POST /api/atividades
Authorization: Bearer {token}
Content-Type: application/json

{
  "codigo": "SERV-001",
  "descricao": "Escavação de vala",
  "unidade": "m3",
  "categoria": 1,
  "preco_unitario": 150.00,
  "obra": 1,
  "ativa": true
}
```

---

## 🚜 REGISTROS DE EQUIPAMENTOS (Motorista)

### Criar Registro de Equipamento
```http
POST /api/registros-equipamentos
Authorization: Bearer {token}
Content-Type: application/json

{
  "equipamento": 1,
  "motorista": 3,
  "data": "2025-11-15",
  "horimetro_inicial": 1500.5,
  "horimetro_final": 1508.2,
  "hora_inicio": "08:00:00",
  "hora_fim": "17:00:00",
  "atividade_principal": "Transporte de material",
  "local": "KM 15+500",
  "observacoes": "Tempo bom, sem intercorrências",
  "fotos": []
}
```

**Resposta:**
```json
{
  "id": 1,
  "equipamento": 1,
  "equipamento_nome": "Caminhão Basculante 001",
  "motorista": 3,
  "motorista_nome": "João Motorista",
  "apontador": null,
  "apontador_nome": null,
  "data": "2025-11-15",
  "horimetro_inicial": 1500.5,
  "horimetro_final": 1508.2,
  "hora_inicio": "08:00:00",
  "hora_fim": "17:00:00",
  "horas_trabalhadas": 9.0,
  "horimetro_trabalhado": 7.7,
  "atividade_principal": "Transporte de material",
  "local": "KM 15+500",
  "observacoes": "Tempo bom, sem intercorrências",
  "fotos": [],
  "validado": false,
  "validado_por": null,
  "data_validacao": null
}
```

### Validar Registro de Equipamento
```http
POST /api/registros-equipamentos/1/validar
Authorization: Bearer {token}
```

**Permissão:** Apenas encarregados e admins podem validar

---

## 👷 REGISTROS DE MÃO DE OBRA (Apontador)

### Criar Registro de Mão de Obra
```http
POST /api/registros-mao-obra
Authorization: Bearer {token}
Content-Type: application/json

{
  "apontador": 2,
  "obra": 1,
  "data": "2025-11-15",
  "funcionarios_presentes": [4, 5, 6, 7],
  "total_funcionarios": 4,
  "hora_inicio": "07:00:00",
  "hora_fim": "16:00:00",
  "local": "Trecho KM 10+000 a KM 12+000",
  "observacoes": "Dia produtivo",
  "fotos": []
}
```

### Listar Registros de Mão de Obra
```http
GET /api/registros-mao-obra
Authorization: Bearer {token}

# Filtros:
GET /api/registros-mao-obra?obra=1
GET /api/registros-mao-obra?apontador=2
GET /api/registros-mao-obra?data=2025-11-15
GET /api/registros-mao-obra?validado=false
```

---

## 👥 ATIVIDADES DA EQUIPE (Encarregado)

### Criar Atividade para Equipe
```http
POST /api/atividades-equipe
Authorization: Bearer {token}
Content-Type: application/json

{
  "encarregado": 4,
  "obra": 1,
  "descricao": "Compactação de solo",
  "data": "2025-11-16",
  "hora_inicio": "08:00:00",
  "hora_fim": "12:00:00",
  "local": "KM 15+200",
  "funcionarios": [5, 6, 7],
  "status": "planejada",
  "observacoes": "Atenção especial na densidade"
}
```

### Listar Atividades da Equipe
```http
GET /api/atividades-equipe
Authorization: Bearer {token}

# Filtros:
GET /api/atividades-equipe?obra=1
GET /api/atividades-equipe?encarregado=4
GET /api/atividades-equipe?data=2025-11-16
GET /api/atividades-equipe?status=planejada
```

**Resposta:**
```json
[
  {
    "id": 1,
    "encarregado": 4,
    "encarregado_nome": "Carlos Encarregado",
    "obra": 1,
    "obra_nome": "Obra Principal",
    "descricao": "Compactação de solo",
    "data": "2025-11-16",
    "hora_inicio": "08:00:00",
    "hora_fim": "12:00:00",
    "local": "KM 15+200",
    "funcionarios": [5, 6, 7],
    "funcionarios_nomes": ["Pedro Silva", "Ana Costa", "Lucas Souza"],
    "status": "planejada",
    "observacoes": "Atenção especial na densidade"
  }
]
```

---

## 📖 DIÁRIOS DE OBRA - RDO (Encarregado)

### Criar Diário de Obra
```http
POST /api/diarios-obra
Authorization: Bearer {token}
Content-Type: application/json

{
  "encarregado": 4,
  "obra": 1,
  "data": "2025-11-15",
  "total_funcionarios": 10,
  "funcionarios_presentes": 9,
  "atividades_concluidas": 3,
  "atividades_parciais": 1,
  "condicoes_climaticas": "Ensolarado, temperatura 28°C",
  "observacoes": "Bom andamento das obras. Pendência de material para amanhã.",
  "atividades": [1, 2, 3],
  "equipamentos": [1, 2]
}
```

### Listar Diários
```http
GET /api/diarios-obra
Authorization: Bearer {token}

# Filtros:
GET /api/diarios-obra?obra=1
GET /api/diarios-obra?encarregado=4
GET /api/diarios-obra?data=2025-11-15
```

**Resposta (com detalhes):**
```json
[
  {
    "id": 1,
    "encarregado": 4,
    "encarregado_nome": "Carlos Encarregado",
    "obra": 1,
    "obra_nome": "Obra Principal",
    "data": "2025-11-15",
    "total_funcionarios": 10,
    "funcionarios_presentes": 9,
    "atividades_concluidas": 3,
    "atividades_parciais": 1,
    "condicoes_climaticas": "Ensolarado, temperatura 28°C",
    "observacoes": "Bom andamento das obras.",
    "atividades": [1, 2, 3],
    "atividades_detalhes": [
      {
        "id": 1,
        "descricao": "Compactação de solo",
        "status": "concluida"
      }
    ],
    "equipamentos": [1, 2],
    "equipamentos_detalhes": [
      {
        "id": 1,
        "equipamento_nome": "Caminhão Basculante 001",
        "horas_trabalhadas": 9.0
      }
    ],
    "pdf_gerado": null
  }
]
```

---

## � IMPORTAÇÃO DE CSV

### Importar Dados
```http
POST /api/importar-csv
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form-data:
- tipo: obras
- arquivo: [arquivo.csv]
```

**Tipos disponíveis:**
- `obras` - Cadastro de obras
- `equipamentos` - Cadastro de equipamentos
- `usuarios` - Cadastro de usuários
- `atividades` - Cadastro de atividades
- `registros_equipamentos` - Registros diários de equipamentos
- `registros_mao_obra` - Registros de mão de obra
- `diarios_obra` - Diários de obra (RDO)

**Resposta:**
```json
{
  "message": "Importação concluída",
  "tipo": "obras",
  "resultado": {
    "success": 5,
    "errors": 2,
    "skipped": 2,
    "total": 7,
    "error_details": [
      {
        "row": 3,
        "error": "Campo obrigatório ausente: codigo"
      }
    ]
  }
}
```

**Permissões:** Apenas Admin e Encarregado

### Baixar Modelo CSV
```http
GET /api/modelo-csv/obras
Authorization: Bearer {token}
```

Retorna um arquivo CSV de exemplo com:
- ✅ Cabeçalhos corretos
- ✅ Linha de exemplo
- ✅ Formato pronto para Excel

### Exportar Dados para CSV
```http
GET /api/exportar-csv/obras?obra=1&data_inicio=2025-11-01&data_fim=2025-11-30
Authorization: Bearer {token}
```

**Filtros opcionais:**
- `obra` - ID da obra
- `data_inicio` - Data inicial (YYYY-MM-DD)
- `data_fim` - Data final (YYYY-MM-DD)

Retorna arquivo CSV para download.

**📘 Documentação detalhada:** Veja `IMPORTACAO_CSV.md`

---

## �📊 DASHBOARD STATS

### Obter Estatísticas
```http
GET /api/dashboard/stats
Authorization: Bearer {token}
```

**Resposta varia por perfil:**

**Admin:**
```json
{
  "total_obras": 5,
  "obras_ativas": 3,
  "total_equipamentos": 15,
  "equipamentos_ativos": 12,
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
  "atividades_hoje": 5,
  "atividades_pendentes": 2,
  "diarios_criados": 30,
  "registros_validar": 4
}
```

**Motorista:**
```json
{
  "registros_hoje": 1,
  "registros_pendentes": 0,
  "total_registros": 120,
  "equipamento_atual": "Caminhão Basculante 001"
}
```

---

## 🏗️ CONTRATOS

### Criar Contrato
```http
POST /api/contratos
Authorization: Bearer {token}
Content-Type: application/json

{
  "fornecedor": "Construtora ABC Ltda",
  "cnpj": "12.345.678/0001-99",
  "tipo": "materiais",
  "numero_contrato": "CONT-2025-001",
  "valor_mensal": 50000.00,
  "data_inicio": "2025-01-01",
  "data_fim": "2025-12-31",
  "obra": 1,
  "ativo": true
}
```

### Listar Contratos
```http
GET /api/contratos?obra=1
Authorization: Bearer {token}
```

---

## 📊 CRITÉRIOS DE MEDIÇÃO

### Criar Critério
```http
POST /api/criterios-medicao
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Desconto por atraso",
  "tipo": "desconto",
  "percentual": 5.0,
  "condicao": "Atraso superior a 5 dias",
  "aplicacao": "Medição mensal",
  "obra": 1,
  "ativo": true
}
```

---

## 🔄 TIPOS DE DADOS

### Tipos de Usuário
- `admin` - Administrador
- `apontador` - Apontador de Obra
- `encarregado` - Encarregado
- `motorista` - Motorista

### Funções
- `administrador`, `engenheiro`, `arquiteto`, `apontador`, `encarregado`, `motorista`, `operador`, `pedreiro`, `servente`, `eletricista`, `encanador`, `carpinteiro`

### Status de Obra
- `planejamento`, `em_andamento`, `pausada`, `concluida`

### Tipos de Equipamento
- `caminhao`, `escavadeira`, `rolo_compactador`, `motoniveladora`, `retroescavadeira`, `trator`, `carregadeira`, `patrol`

### Status de Equipamento
- `ativo`, `manutencao`, `inativo`

### Unidades de Medida
- `m`, `m2`, `m3`, `kg`, `t`, `un`, `h`, `dia`

### Status de Atividade da Equipe
- `planejada`, `em_andamento`, `concluida`, `cancelada`

---

## 🧪 TESTANDO A API

### Com cURL:
```bash
# Login
curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tcc.com","password":"admin123"}'

# Listar equipamentos (com token)
curl -X GET http://127.0.0.1:8000/api/equipamentos \
  -H "Authorization: Bearer {seu_token}"
```

### Com Postman/Insomnia:
1. Crie um request POST para login
2. Salve o `access_token` da resposta
3. Configure o Header `Authorization: Bearer {token}` em todas as outras requisições

---

## ✅ PRÓXIMOS PASSOS

1. **Integração com Frontend Next.js**
   - Criar `lib/api.ts` com funções fetch
   - Implementar gerenciamento de tokens
   - Conectar formulários às APIs

2. **Upload de Fotos**
   - Endpoint para upload de imagens
   - Armazenamento em `/media/`

3. **Geração de PDF (RDO)**
   - Instalar `reportlab`
   - Criar template de PDF
   - Endpoint de geração

4. **WebSockets (opcional)**
   - Notificações em tempo real
   - Atualizações de status

---

## 📞 SUPORTE

Para dúvidas ou problemas, verifique:
- Logs do servidor Django
- Console do navegador
- Responses de erro da API

**Servidor:** http://127.0.0.1:8000
**Admin:** http://127.0.0.1:8000/admin
