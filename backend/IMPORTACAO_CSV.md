# 📊 Guia de Importação/Exportação de Planilhas CSV

## 🎯 Visão Geral

O sistema permite importar dados de planilhas CSV para popular o banco de dados rapidamente, e também exportar dados para análise em Excel/Google Sheets.

---

## 📥 IMPORTAÇÃO DE CSV

### Endpoint
```
POST /api/importar-csv
```

### Autenticação
- ✅ **Requerida**
- 🔐 Apenas **Admin** e **Encarregado** podem importar

### Formato da Requisição
```
Content-Type: multipart/form-data

Form-data:
- tipo: [obras|equipamentos|usuarios|atividades|registros_equipamentos|registros_mao_obra|diarios_obra]
- arquivo: [arquivo.csv]
```

### Tipos de Importação Disponíveis

1. **obras** - Cadastro de obras
2. **equipamentos** - Cadastro de equipamentos
3. **usuarios** - Cadastro de usuários
4. **atividades** - Cadastro de atividades/serviços
5. **registros_equipamentos** - Registros diários de equipamentos
6. **registros_mao_obra** - Registros de mão de obra
7. **diarios_obra** - Diários de obra (RDO)

---

## 📋 FORMATOS DE CSV

### 1️⃣ Obras (`obras`)

**Colunas obrigatórias:**
```csv
codigo,nome,local,km_inicial,km_final,data_inicio,data_prevista_fim
```

**Colunas opcionais:**
```csv
responsavel_email,status
```

**Exemplo:**
```csv
codigo,nome,local,km_inicial,km_final,data_inicio,data_prevista_fim,responsavel_email,status
OBR-001,Pavimentação BR-101,BR-101 Trecho Sul,10.000,25.000,01/01/2025,31/12/2025,admin@tcc.com,em_andamento
OBR-002,Ponte Rio Grande,KM 45,45.000,45.500,01/03/2025,30/08/2025,,planejamento
```

**Formatos:**
- `km_inicial`, `km_final`: Números decimais (use ponto ou vírgula)
- `data_inicio`, `data_prevista_fim`: DD/MM/YYYY
- `status`: planejamento, em_andamento, pausada, concluida

---

### 2️⃣ Equipamentos (`equipamentos`)

**Colunas obrigatórias:**
```csv
nome,tipo,modelo,placa,fabricante,ano
```

**Colunas opcionais:**
```csv
horimetro_atual,status,obra_codigo,motorista_matricula
```

**Exemplo:**
```csv
nome,tipo,modelo,placa,fabricante,ano,horimetro_atual,status,obra_codigo,motorista_matricula
Caminhão Basculante 001,caminhao,MB 1620,ABC-1234,Mercedes-Benz,2020,1500.5,ativo,OBR-001,001236
Escavadeira Hidráulica 001,escavadeira,PC200,XYZ-5678,Komatsu,2021,800.0,ativo,OBR-001,
```

**Tipos de equipamento:**
- caminhao, escavadeira, rolo_compactador, motoniveladora, retroescavadeira, trator, carregadeira, patrol

**Status:**
- ativo, manutencao, inativo

---

### 3️⃣ Usuários (`usuarios`)

**Colunas obrigatórias:**
```csv
nome,tipo_usuario,funcao
```

**Colunas opcionais/condicionais:**
```csv
email,matricula,cpf,telefone,cargo,password
```

**Exemplo:**
```csv
nome,email,matricula,cpf,telefone,tipo_usuario,funcao,cargo,password
Admin Geral,admin@tcc.com,,,11987654321,admin,administrador,Administrador,admin123
João Silva,,001237,123.456.789-00,11987654322,motorista,motorista,Motorista,senha123
Maria Santos,,001238,987.654.321-00,11987654323,apontador,apontador,Apontadora,senha123
```

**Regras:**
- **Admin**: Deve ter `email` preenchido
- **Apontador/Encarregado/Motorista**: Devem ter `matricula` preenchida
- `password`: Apenas para novos usuários

**Tipos:**
- admin, apontador, encarregado, motorista

**Funções:**
- administrador, engenheiro, arquiteto, apontador, encarregado, motorista, operador, pedreiro, servente, eletricista, encanador, carpinteiro

---

### 4️⃣ Atividades (`atividades`)

**Colunas obrigatórias:**
```csv
codigo,descricao,unidade,preco_unitario,obra_codigo
```

**Colunas opcionais:**
```csv
categoria_nome,ativa
```

**Exemplo:**
```csv
codigo,descricao,unidade,categoria_nome,preco_unitario,obra_codigo,ativa
TERR-001,Escavação de vala,m3,Terraplenagem,150.00,OBR-001,true
PAV-001,Aplicação de CBUQ,m2,Pavimentação,85.00,OBR-001,true
DREN-001,Instalação de tubos,m,Drenagem,45.50,OBR-001,false
```

**Unidades:**
- m, m2, m3, kg, t, un, h, dia

---

### 5️⃣ Registros de Equipamentos (`registros_equipamentos`)

**Colunas obrigatórias:**
```csv
equipamento_placa,motorista_matricula,data,horimetro_inicial,horimetro_final,hora_inicio,hora_fim,atividade_principal,local
```

**Colunas opcionais:**
```csv
observacoes
```

**Exemplo:**
```csv
equipamento_placa,motorista_matricula,data,horimetro_inicial,horimetro_final,hora_inicio,hora_fim,atividade_principal,local,observacoes
ABC-1234,001236,15/11/2025,1500.5,1508.2,08:00,17:00,Transporte de material,KM 15+500,Tempo bom
XYZ-5678,001237,15/11/2025,800.0,805.5,07:00,12:00,Escavação,KM 10+200,
```

**Formatos:**
- `data`: DD/MM/YYYY
- `horimetro_inicial`, `horimetro_final`: Números decimais
- `hora_inicio`, `hora_fim`: HH:MM

---

### 6️⃣ Registros de Mão de Obra (`registros_mao_obra`)

**Colunas obrigatórias:**
```csv
apontador_matricula,obra_codigo,data,total_funcionarios,hora_inicio,hora_fim,local
```

**Colunas opcionais:**
```csv
observacoes,funcionarios_matriculas
```

**Exemplo:**
```csv
apontador_matricula,obra_codigo,data,total_funcionarios,hora_inicio,hora_fim,local,observacoes,funcionarios_matriculas
001234,OBR-001,15/11/2025,4,07:00,16:00,KM 10+000 a KM 12+000,Dia produtivo,001235;001236;001237
001234,OBR-001,16/11/2025,5,07:00,16:00,KM 12+000 a KM 14+000,Chuva à tarde,001235;001236
```

**Formatos:**
- `funcionarios_matriculas`: Matrículas separadas por `;` (ponto e vírgula)

---

### 7️⃣ Diários de Obra (`diarios_obra`)

**Colunas obrigatórias:**
```csv
encarregado_matricula,obra_codigo,data,total_funcionarios,funcionarios_presentes,condicoes_climaticas,observacoes
```

**Colunas opcionais:**
```csv
atividades_concluidas,atividades_parciais
```

**Exemplo:**
```csv
encarregado_matricula,obra_codigo,data,total_funcionarios,funcionarios_presentes,atividades_concluidas,atividades_parciais,condicoes_climaticas,observacoes
001235,OBR-001,15/11/2025,10,9,3,1,Ensolarado 28°C,Bom andamento das obras. Material recebido.
001235,OBR-001,16/11/2025,10,10,2,2,Parcialmente nublado,Produtividade normal
```

---

## 📤 EXPORTAÇÃO DE CSV

### Endpoint
```
GET /api/exportar-csv/{tipo}
```

### Tipos Disponíveis
- obras
- equipamentos
- registros_equipamentos
- registros_mao_obra
- diarios_obra

### Filtros (Query Params)
- `obra`: ID da obra (opcional)
- `data_inicio`: Data inicial no formato YYYY-MM-DD (opcional)
- `data_fim`: Data final no formato YYYY-MM-DD (opcional)

### Exemplos de Uso

**Exportar todas as obras:**
```
GET /api/exportar-csv/obras
Authorization: Bearer {token}
```

**Exportar registros de equipamentos de uma obra específica:**
```
GET /api/exportar-csv/registros_equipamentos?obra=1
Authorization: Bearer {token}
```

**Exportar diários de obra entre datas:**
```
GET /api/exportar-csv/diarios_obra?data_inicio=2025-11-01&data_fim=2025-11-30
Authorization: Bearer {token}
```

---

## 📥 DOWNLOAD DE MODELOS CSV

### Endpoint
```
GET /api/modelo-csv/{tipo}
```

### Descrição
Baixa um arquivo CSV de exemplo com o formato correto para importação.

### Exemplos

**Baixar modelo de obras:**
```
GET /api/modelo-csv/obras
Authorization: Bearer {token}
```

**Baixar modelo de equipamentos:**
```
GET /api/modelo-csv/equipamentos
Authorization: Bearer {token}
```

O arquivo baixado já vem com:
- ✅ Cabeçalhos corretos
- ✅ Linha de exemplo
- ✅ Encoding UTF-8 com BOM (compatível com Excel)

---

## 🧪 TESTANDO IMPORTAÇÃO

### Com cURL

```bash
# 1. Baixar modelo
curl -X GET "http://127.0.0.1:8000/api/modelo-csv/obras" \
  -H "Authorization: Bearer {TOKEN}" \
  -o modelo_obras.csv

# 2. Editar o modelo_obras.csv com seus dados

# 3. Importar
curl -X POST "http://127.0.0.1:8000/api/importar-csv" \
  -H "Authorization: Bearer {TOKEN}" \
  -F "tipo=obras" \
  -F "arquivo=@modelo_obras.csv"
```

### Com Postman/Insomnia

1. **Download do Modelo:**
   - Method: GET
   - URL: `http://127.0.0.1:8000/api/modelo-csv/obras`
   - Headers: `Authorization: Bearer {token}`
   - Send → Salvar arquivo

2. **Importar CSV:**
   - Method: POST
   - URL: `http://127.0.0.1:8000/api/importar-csv`
   - Headers: `Authorization: Bearer {token}`
   - Body: form-data
     - Key: `tipo` | Value: `obras`
     - Key: `arquivo` | Type: File | Selecionar CSV

---

## 📝 RESPOSTA DA IMPORTAÇÃO

### Sucesso
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
      },
      {
        "row": 5,
        "error": "Obra OBR-999 já existe"
      }
    ]
  }
}
```

### Campos da Resposta
- `success`: Linhas importadas com sucesso
- `errors`: Número de erros
- `skipped`: Linhas ignoradas
- `total`: Total de linhas no CSV
- `error_details`: Detalhes dos erros (linha e mensagem)

---

## ⚠️ REGRAS E VALIDAÇÕES

### Regras Gerais
1. ✅ Primeira linha deve conter os cabeçalhos
2. ✅ Campos obrigatórios não podem estar vazios
3. ✅ Encoding: UTF-8 ou Latin-1
4. ✅ Separador: vírgula (,)
5. ✅ Extensão: `.csv`

### Regras de Atualização
- Se **código/placa/matrícula já existe**: **ATUALIZA** o registro
- Se **não existe**: **CRIA** novo registro
- Isso permite reimportar CSVs corrigidos sem duplicar dados

### Validações Específicas

**Obras:**
- `codigo` deve ser único
- Datas no formato DD/MM/YYYY
- Se `responsavel_email` fornecido, usuário deve existir

**Equipamentos:**
- `placa` deve ser única
- Se `obra_codigo` fornecido, obra deve existir
- Se `motorista_matricula` fornecido, motorista deve existir e ser do tipo "motorista"

**Usuários:**
- Admin: `email` obrigatório e único
- Outros: `matricula` obrigatória e única
- `password` só é definida em criações, não em atualizações

**Atividades:**
- `codigo` deve ser único
- `obra_codigo` obrigatório e obra deve existir
- `categoria_nome`: se não existir, é criada automaticamente

**Registros:**
- Equipamento/Motorista/Apontador devem existir
- Datas e horas em formatos corretos
- Não pode haver 2 registros do mesmo equipamento na mesma data

---

## 💡 DICAS DE USO

### Excel/Google Sheets
1. Baixe o modelo CSV
2. Abra no Excel/Sheets
3. Preencha com seus dados
4. **Salvar como CSV (UTF-8)**
5. Importe no sistema

### Dados em Lote
- Prepare planilhas com centenas de linhas
- Sistema processa linha por linha
- Se uma falhar, as outras continuam
- Verifique `error_details` para corrigir

### Ordem de Importação Recomendada
1. **Usuários** (funcionários, admins)
2. **Obras** (projetos)
3. **Equipamentos**
4. **Atividades**
5. **Registros** (equipamentos, mão de obra)
6. **Diários**

Esta ordem garante que as dependências existam.

---

## 🚀 EXEMPLO COMPLETO

### 1. Importar Usuários
```csv
nome,email,matricula,cpf,telefone,tipo_usuario,funcao,cargo,password
José Silva,,001240,111.222.333-44,11999998888,motorista,motorista,Motorista,senha123
Ana Costa,,001241,222.333.444-55,11999997777,encarregado,encarregado,Encarregada,senha123
```

### 2. Importar Obra
```csv
codigo,nome,local,km_inicial,km_final,data_inicio,data_prevista_fim,responsavel_email,status
OBR-003,Manutenção BR-050,BR-050 Norte,30.000,45.000,01/12/2025,31/03/2026,admin@tcc.com,planejamento
```

### 3. Importar Equipamentos
```csv
nome,tipo,modelo,placa,fabricante,ano,horimetro_atual,status,obra_codigo,motorista_matricula
Caminhão 002,caminhao,Volvo FH,DEF-5678,Volvo,2022,500.0,ativo,OBR-003,001240
```

### 4. Importar Atividades
```csv
codigo,descricao,unidade,categoria_nome,preco_unitario,obra_codigo,ativa
MANUT-001,Tapa-buraco,m2,Pavimentação,35.00,OBR-003,true
```

---

## 🆘 TROUBLESHOOTING

### Erro: "Arquivo deve ser CSV"
- Certifique-se que o arquivo tem extensão `.csv`
- Não use `.xlsx` ou `.xls`

### Erro: "Campo obrigatório ausente"
- Verifique se todos os campos obrigatórios estão preenchidos
- Baixe o modelo para ver os campos necessários

### Erro: "Encoding inválido"
- Salve o CSV como UTF-8
- No Excel: "Salvar Como" → CSV UTF-8

### Dados não aparecem no Excel
- Excel às vezes não abre UTF-8 corretamente
- Use "Importar Dados" ao invés de "Abrir"
- Ou use Google Sheets que funciona melhor

### Muitos erros na importação
- Verifique o formato das datas (DD/MM/YYYY)
- Verifique números decimais (aceita ponto ou vírgula)
- Certifique-se que referências existem (obras, usuários)

---

## 📊 RESUMO DOS ENDPOINTS

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/importar-csv` | POST | Importa dados de CSV |
| `/api/modelo-csv/{tipo}` | GET | Baixa modelo CSV |
| `/api/exportar-csv/{tipo}` | GET | Exporta dados para CSV |

---

**✅ Agora você pode importar e exportar todos os dados do sistema via planilhas CSV!** 🎉
