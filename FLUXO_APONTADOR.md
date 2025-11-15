# 📋 Fluxo de Trabalho do Apontador

## Visão Geral do Sistema

O sistema de apropriação de dados da obra funciona em **3 etapas principais**:

### 1️⃣ **Atribuição (Admin/Encarregado)**
Os administradores e encarregados atribuem:
- ✅ Equipamentos específicos para cada apontador
- ✅ Atividades de mão de obra para validação
- ✅ Motoristas/operadores responsáveis
- ✅ Locais de trabalho (estaqueamento)

### 2️⃣ **Recebimento (Apontador)**
O apontador visualiza na página `/apontador/tarefas`:
- 📊 **Painel de Resumo**: Total de equipamentos e atividades pendentes
- 🔶 **Equipamentos Pendentes**: Aguardando início de jornada
- 🟢 **Equipamentos em Operação**: Já iniciados, aguardando finalização
- 🔴 **Equipamentos Paralisados**: Com problemas ou manutenção
- ⚠️ **Atividades de Mão de Obra**: Pendentes de validação

### 3️⃣ **Registro/Validação (Apontador)**
O apontador preenche os formulários conforme o tipo:

---

## 🚜 Fluxo de Equipamentos

### Página: `/apontador/tarefas`

#### Card de Equipamento Pendente (Exemplo)
```
┌─────────────────────────────────────┐
│ 🟡 Aguardando Início                │
│                                     │
│ Escavadeira 104.F570                │
│ Caterpillar 320D                    │
│                                     │
│ Motorista: João Silva               │
│ Última leitura: 2.450h              │
│                                     │
│ [📷 Iniciar Jornada]                │
└─────────────────────────────────────┘
```

**Dados Pré-preenchidos vindos do backend:**
- Equipamento: `"Escavadeira 104.F570"`
- Modelo: `"Caterpillar 320D"`
- Motorista: `"João Silva"`
- Horímetro Inicial: `"2450"` (última leitura registrada)
- Hora Início: `hora atual do sistema`

---

### Ao clicar "Iniciar Jornada" → `/apontador/registro-equipamento`

#### Formulário de Registro de Equipamento

**Seção 1: Dados do Equipamento** _(campos desabilitados - vêm do backend)_
- ✅ Equipamento: Escavadeira 104.F570
- ✅ Modelo: Caterpillar 320D
- ✅ Motorista: João Silva

**Seção 2: Horímetro** _(pré-preenchido)_
- ✅ Inicial: 2450h _(última leitura)_
- 📝 Final: _a preencher_
- 📊 **Cálculo automático**: Diferença (Final - Inicial)

**Seção 3: Horário** _(hora início pré-preenchida)_
- ✅ Hora Início: 07:30 _(hora do clique em "Iniciar")_
- 📝 Hora Fim: _a preencher_
- 📊 **Cálculo automático**: Tempo de jornada

**Seção 4: Atividade Principal** _(seleção obrigatória)_
Opções:
- Transporte de Terra
- Transporte de Brita
- Escavação
- Compactação
- Nivelamento
- Aguardando Carga
- Manutenção
- Abastecimento

**Seção 5: Local de Operação**
- 📝 Estaqueamento: Ex: `km 45+200 a 45+450`

**Seção 6: Observações**
- 📝 Texto livre para ocorrências, problemas, paradas, etc.

**Seção 7: Evidências Fotográficas**
- 📷 Captura de fotos do equipamento e serviço

**Botões de Ação:**
- ❌ Cancelar → volta para `/apontador/tarefas`
- ✅ Validar e Salvar → envia dados para backend + volta para `/apontador/tarefas`

---

### Card de Equipamento em Operação (Exemplo)
```
┌─────────────────────────────────────┐
│ 🟢 Em Operação                      │
│                                     │
│ Caminhão 205.G320                   │
│ Mercedes-Benz 2726                  │
│                                     │
│ Motorista: Carlos Mendes            │
│ Iniciado às: 07:00                  │
│ Atividade atual: Transporte Terra   │
│                                     │
│ [📷 Finalizar Jornada]              │
└─────────────────────────────────────┘
```

**Ao clicar "Finalizar Jornada":**
- Mesmo formulário, mas com dados já iniciados
- Horímetro Inicial: já registrado
- Hora Início: já registrada
- Atividade: já selecionada
- Apontador preenche apenas: **Horímetro Final, Hora Fim, Observações, Fotos**

---

## 👷 Fluxo de Mão de Obra

### Página: `/apontador/tarefas` (Aba "Mão de Obra")

#### Card de Atividade Pendente (Exemplo)
```
┌─────────────────────────────────────┐
│ 🟡 Pendente Validação               │
│                                     │
│ Escavação de Vala                   │
│ Encarregado: Pedro Santos           │
│                                     │
│ Equipe: 8 funcionários              │
│ Período: 07:00 - 12:00              │
│                                     │
│ [✓ Validar e Quantificar →]        │
└─────────────────────────────────────┘
```

**Dados Pré-preenchidos vindos do backend:**
- Encarregado: `"Pedro Santos"`
- Atividade Principal: `"Escavação de Vala"`
- Lista de Funcionários: `Array de 8 funcionários com status`
- Data: `data atual`

---

### Ao clicar "Validar e Quantificar" → `/apontador/registro-mao-obra`

#### Formulário de Registro de Mão de Obra

**Seção 1: Informações da Equipe** _(pré-preenchido)_
- ✅ Encarregado: Pedro Santos
- ✅ Data de Execução: 14/11/2025
- 📝 Atividade Principal: _selecionar entre 8 opções_

**Seção 2: Equipe Presente** _(lista pré-preenchida)_
```
🟢 José da Silva - Mat. 001234 [Presente]
🟢 Maria Santos - Mat. 001235 [Presente]
🟢 Pedro Oliveira - Mat. 001236 [Presente]
⚪ Ana Costa - Mat. 001237 (ausente)
🟢 Carlos Mendes - Mat. 001238 [Presente]
🟢 Lucia Ferreira - Mat. 001239 [Presente]

Total: 5 presentes
```

**Seção 3: Horário de Trabalho**
- 📝 Hora Início: Ex: `07:00`
- 📝 Hora Fim: Ex: `12:00`
- 📊 **Cálculo automático**: `5h 0min trabalhadas`

**Seção 4: Serviços Executados** _(dinâmico - múltiplos serviços)_

Serviço 1:
- 📝 Descrição: Ex: `Escavação de vala para drenagem`
- 📝 Quantidade: Ex: `180`
- 📝 Unidade: Ex: `m³` _(dropdown: m³, m², m, un, kg, t)_
- 📝 Local: Ex: `km 45+200 a 45+450`
- 📊 **Resumo**: `180 m³ de Escavação de vala para drenagem`

**Botão:** `[+ Adicionar Serviço]` → cria novo card de serviço

**Seção 5: Observações**
- 📝 Texto livre: condições climáticas, dificuldades, materiais, etc.

**Seção 6: Evidências Fotográficas**
- 📷 Captura de fotos do serviço executado

**Botões de Ação:**
- ❌ Cancelar → volta para `/apontador/tarefas`
- ✅ Salvar no Diário → envia para backend + volta para `/apontador/tarefas`

---

## 🔄 Integração com Backend (TODO)

### Endpoint esperado: `GET /api/apontador/tarefas`

**Resposta esperada:**
```json
{
  "equipamentos_pendentes": [
    {
      "id": "eq_001",
      "nome": "Escavadeira 104.F570",
      "modelo": "Caterpillar 320D",
      "motorista": "João Silva",
      "horimetro_inicial": 2450,
      "status": "aguardando_inicio"
    }
  ],
  "equipamentos_em_operacao": [
    {
      "id": "eq_002",
      "nome": "Caminhão 205.G320",
      "modelo": "Mercedes-Benz 2726",
      "motorista": "Carlos Mendes",
      "horimetro_inicial": 5200,
      "hora_inicio": "07:00",
      "atividade": "Transporte de Terra",
      "status": "em_operacao"
    }
  ],
  "atividades_mao_obra": [
    {
      "id": "mo_001",
      "descricao": "Escavação de Vala",
      "encarregado": "Pedro Santos",
      "funcionarios": [
        { "matricula": "001234", "nome": "José da Silva", "presente": true },
        { "matricula": "001235", "nome": "Maria Santos", "presente": true }
      ],
      "periodo": "07:00 - 12:00",
      "status": "pendente_validacao"
    }
  ]
}
```

### Endpoint: `POST /api/apontador/equipamento/registrar`

**Payload enviado:**
```json
{
  "equipamento_id": "eq_001",
  "horimetro_final": 2458.5,
  "hora_fim": "16:30",
  "atividade": "Escavação",
  "local": "km 45+200 a 45+450",
  "observacoes": "Terreno rochoso, velocidade reduzida",
  "fotos": ["foto_1234567890.jpg", "foto_1234567891.jpg"]
}
```

### Endpoint: `POST /api/apontador/mao-obra/validar`

**Payload enviado:**
```json
{
  "atividade_id": "mo_001",
  "funcionarios_presentes": ["001234", "001235", "001236"],
  "hora_inicio": "07:00",
  "hora_fim": "12:00",
  "servicos": [
    {
      "descricao": "Escavação de vala para drenagem",
      "quantidade": 180,
      "unidade": "m³",
      "local": "km 45+200 a 45+450"
    }
  ],
  "observacoes": "Bom andamento, sem intercorrências",
  "fotos": ["foto_1234567892.jpg"]
}
```

---

## 📱 Responsividade

Todas as interfaces foram desenvolvidas com **mobile-first**:
- ✅ Cards responsivos com grid adaptativo
- ✅ Botões com toque otimizado (size="lg")
- ✅ Formulários com scroll suave
- ✅ Sticky headers para navegação
- ✅ Sticky buttons na parte inferior

---

## 🎨 Estados Visuais

### Badges de Status

| Status | Cor | Uso |
|--------|-----|-----|
| 🟡 Aguardando Início | `warning` | Equipamento ainda não iniciado |
| 🟢 Em Operação | `success` | Equipamento trabalhando |
| 🔴 Paralisado | `destructive` | Equipamento com problema |
| 🟡 Pendente Validação | `warning` | Mão de obra aguardando registro |
| 🟢 Validado | `success` | Mão de obra já quantificada |

### Bordas de Cards

| Cor da Borda | Significado |
|-------------|-------------|
| `border-l-warning` | Ação pendente/urgente |
| `border-l-success` | Concluído/em andamento |
| `border-l-destructive` | Problema/alerta |

---

## ✅ Checklist de Implementação

### Frontend ✅ (Completo)
- [x] Página de login para Apontador
- [x] Painel de tarefas com tabs (Equipamentos / Mão de Obra)
- [x] Formulário de registro de equipamento
- [x] Formulário de registro de mão de obra
- [x] Cálculos automáticos (horímetro, tempo de trabalho)
- [x] Sistema de fotos (placeholder)
- [x] Validações de campos obrigatórios
- [x] Navegação entre páginas

### Backend 🔜 (Pendente)
- [ ] API de autenticação
- [ ] Endpoint GET /api/apontador/tarefas
- [ ] Endpoint POST /api/apontador/equipamento/registrar
- [ ] Endpoint POST /api/apontador/mao-obra/validar
- [ ] Upload de fotos
- [ ] Validação de dados
- [ ] Persistência em banco de dados

---

## 🚀 Próximos Passos

1. **Integração com Backend**: Substituir dados mockados por chamadas à API
2. **Painel de Diário de Obras**: Criar visualização consolidada de todos os registros
3. **Sistema de Aprovação**: Interface para admin/encarregado aprovar registros
4. **Relatórios**: Exportação de dados para Excel/PDF
5. **Dashboard Analítico**: Gráficos e KPIs de produtividade

---

**Desenvolvido para o TCC:**  
*Sistema de Apropriação de Dados de Obra - Rodovia BR-116 Trecho Cariri*
