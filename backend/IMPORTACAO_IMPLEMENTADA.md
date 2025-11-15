# ✅ SISTEMA DE IMPORTAÇÃO CSV IMPLEMENTADO

## 🎉 FUNCIONALIDADE COMPLETA!

O sistema agora suporta **importação e exportação** de dados via planilhas CSV!

---

## 📦 O QUE FOI CRIADO

### 🔧 **Módulo de Importação** (`core/importers.py`)

**7 Importadores Especializados:**
1. ✅ **ObraCSVImporter** - Importa obras
2. ✅ **EquipamentoCSVImporter** - Importa equipamentos
3. ✅ **UsuarioCSVImporter** - Importa usuários
4. ✅ **AtividadeCSVImporter** - Importa atividades
5. ✅ **RegistroEquipamentoCSVImporter** - Importa registros de equipamentos
6. ✅ **RegistroMaoObraCSVImporter** - Importa registros de mão de obra
7. ✅ **DiarioObraCSVImporter** - Importa diários de obra

**Funcionalidades:**
- ✅ Detecção automática de encoding (UTF-8 e Latin-1)
- ✅ Validação de campos obrigatórios
- ✅ Update ou Create (se já existe, atualiza; senão, cria)
- ✅ Tratamento de erros linha por linha
- ✅ Relatório detalhado com linhas que falharam
- ✅ Transações atômicas (rollback em caso de erro)

### 🌐 **3 Novos Endpoints API**

1. **POST `/api/importar-csv`**
   - Importa dados de arquivo CSV
   - Suporta 7 tipos de dados
   - Retorna relatório detalhado
   - Permissão: Admin e Encarregado

2. **GET `/api/modelo-csv/{tipo}`**
   - Baixa modelo CSV de exemplo
   - Com cabeçalhos e linha de exemplo
   - Encoding UTF-8 + BOM (compatível Excel)

3. **GET `/api/exportar-csv/{tipo}`**
   - Exporta dados existentes para CSV
   - Filtros por obra e período
   - Pronto para análise em Excel

### 📁 **Exemplos de CSV**

**7 Arquivos de Exemplo** em `/backend/exemplos_csv/`:
- ✅ `exemplo_obras.csv` - 3 obras
- ✅ `exemplo_equipamentos.csv` - 5 equipamentos
- ✅ `exemplo_usuarios.csv` - 5 usuários
- ✅ `exemplo_atividades.csv` - 10 atividades
- ✅ `exemplo_registros_equipamentos.csv` - 5 registros
- ✅ `exemplo_registros_mao_obra.csv` - 3 registros
- ✅ `exemplo_diarios_obra.csv` - 3 RDOs

Todos prontos para importação!

### 📚 **Documentação Completa**

1. **IMPORTACAO_CSV.md** (51 KB)
   - Guia completo de uso
   - Formatos de CSV para cada tipo
   - Exemplos práticos
   - Troubleshooting
   - 900+ linhas de documentação

2. **exemplos_csv/README.md**
   - Como usar os exemplos
   - Ordem de importação
   - Dicas e notas

3. **test_import_csv.py**
   - Script de teste automatizado
   - Testa todos os 7 importadores
   - Relatório de resultados

---

## 🚀 COMO USAR

### 1️⃣ Baixar Modelo
```bash
curl -X GET "http://127.0.0.1:8000/api/modelo-csv/obras" \
  -H "Authorization: Bearer {TOKEN}" \
  -o modelo_obras.csv
```

### 2️⃣ Editar no Excel/Sheets
- Abra o `modelo_obras.csv`
- Preencha com seus dados
- Salve como CSV (UTF-8)

### 3️⃣ Importar
```bash
curl -X POST "http://127.0.0.1:8000/api/importar-csv" \
  -H "Authorization: Bearer {TOKEN}" \
  -F "tipo=obras" \
  -F "arquivo=@modelo_obras.csv"
```

### 4️⃣ Verificar Resultado
```json
{
  "message": "Importação concluída",
  "tipo": "obras",
  "resultado": {
    "success": 5,
    "errors": 0,
    "skipped": 0,
    "total": 5,
    "error_details": []
  }
}
```

---

## 📊 FORMATOS SUPORTADOS

### Obras
```csv
codigo,nome,local,km_inicial,km_final,data_inicio,data_prevista_fim,responsavel_email,status
OBR-001,Pavimentação BR-101,BR-101,10.000,25.000,01/01/2025,31/12/2025,admin@tcc.com,em_andamento
```

### Equipamentos
```csv
nome,tipo,modelo,placa,fabricante,ano,horimetro_atual,status,obra_codigo,motorista_matricula
Caminhão Basculante 001,caminhao,MB 1620,ABC-1234,Mercedes-Benz,2020,1500.5,ativo,OBR-001,001236
```

### Usuários
```csv
nome,email,matricula,cpf,telefone,tipo_usuario,funcao,cargo,password
José Silva,,001240,111.222.333-44,11999998888,motorista,motorista,Motorista,senha123
```

### Registros de Equipamentos
```csv
equipamento_placa,motorista_matricula,data,horimetro_inicial,horimetro_final,hora_inicio,hora_fim,atividade_principal,local,observacoes
ABC-1234,001236,15/11/2025,1500.5,1508.2,08:00,17:00,Transporte de material,KM 15+500,Tempo bom
```

### Registros de Mão de Obra
```csv
apontador_matricula,obra_codigo,data,total_funcionarios,hora_inicio,hora_fim,local,observacoes,funcionarios_matriculas
001234,OBR-001,15/11/2025,4,07:00,16:00,KM 10+000,Dia produtivo,001235;001236;001240
```

### Diários de Obra
```csv
encarregado_matricula,obra_codigo,data,total_funcionarios,funcionarios_presentes,atividades_concluidas,atividades_parciais,condicoes_climaticas,observacoes
001235,OBR-001,15/11/2025,10,9,3,1,Ensolarado 28°C,Bom andamento das obras
```

---

## 🎯 BENEFÍCIOS

### Para o Usuário
- ✅ **Importação em lote** - Centenas de registros de uma vez
- ✅ **Sem necessidade de formulários** - Use Excel/Sheets
- ✅ **Migração de dados** - Importe dados antigos
- ✅ **Backup/Restore** - Exporte e reimporte
- ✅ **Análise de dados** - Exporte para análise

### Para o Sistema
- ✅ **População inicial** - Setup rápido de novo ambiente
- ✅ **Testes** - Criar dados de teste facilmente
- ✅ **Demonstrações** - Popular sistema para demos
- ✅ **Integração** - Importar de outros sistemas

---

## 🔒 SEGURANÇA

- ✅ **Autenticação obrigatória** - JWT Token
- ✅ **Permissões** - Apenas Admin e Encarregado
- ✅ **Validação de dados** - Campos obrigatórios
- ✅ **Validação de referências** - Obras, usuários devem existir
- ✅ **Transações atômicas** - Rollback em caso de erro
- ✅ **Limite de arquivo** - Configurável no Django

---

## ⚙️ CONFIGURAÇÕES

### Tamanho Máximo de Upload
Edite `api/settings.py`:
```python
# Tamanho máximo de upload (em bytes)
DATA_UPLOAD_MAX_MEMORY_SIZE = 5242880  # 5 MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 5242880  # 5 MB
```

### Encoding de CSV
- **Suportado:** UTF-8 e Latin-1
- **Recomendado:** UTF-8
- **Excel:** Salvar como "CSV UTF-8"

---

## 🧪 TESTANDO

### Teste Automatizado
```bash
cd /home/victor/Documentos/dev/tcc-web-interface/backend
python test_import_csv.py
```

### Importar Exemplos
```bash
# 1. Login
TOKEN=$(curl -X POST "http://127.0.0.1:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tcc.com","password":"admin123"}' \
  | jq -r '.tokens.access')

# 2. Importar usuários
curl -X POST "http://127.0.0.1:8000/api/importar-csv" \
  -H "Authorization: Bearer $TOKEN" \
  -F "tipo=usuarios" \
  -F "arquivo=@exemplos_csv/exemplo_usuarios.csv"

# 3. Importar obras
curl -X POST "http://127.0.0.1:8000/api/importar-csv" \
  -H "Authorization: Bearer $TOKEN" \
  -F "tipo=obras" \
  -F "arquivo=@exemplos_csv/exemplo_obras.csv"

# Continuar com outros...
```

---

## 📈 ESTATÍSTICAS

### Código Criado
- **importers.py**: ~600 linhas (7 importadores)
- **views.py**: +250 linhas (3 endpoints)
- **Documentação**: ~1.000 linhas
- **Exemplos CSV**: 7 arquivos
- **Total**: ~1.850 linhas

### Funcionalidades
- **Importadores**: 7
- **Endpoints**: 3
- **Tipos de dados**: 7
- **Formatos suportados**: CSV
- **Encodings**: 2 (UTF-8, Latin-1)

---

## 🔜 PRÓXIMOS PASSOS

### Interface Web para Importação

Criar componente React no frontend:

```typescript
// components/ImportarCSV.tsx
export function ImportarCSV() {
  const [tipo, setTipo] = useState('obras');
  const [arquivo, setArquivo] = useState<File | null>(null);
  
  const handleImport = async () => {
    const formData = new FormData();
    formData.append('tipo', tipo);
    formData.append('arquivo', arquivo);
    
    const response = await fetch('/api/importar-csv', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    const result = await response.json();
    // Mostrar resultado...
  };
  
  return (
    <div>
      <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
        <option value="obras">Obras</option>
        <option value="equipamentos">Equipamentos</option>
        {/* ... */}
      </select>
      
      <input type="file" accept=".csv" onChange={(e) => setArquivo(e.target.files[0])} />
      
      <button onClick={handleImport}>Importar</button>
    </div>
  );
}
```

### Melhorias Futuras
- ⏳ Upload de múltiplos arquivos
- ⏳ Preview antes de importar
- ⏳ Validação do CSV antes de enviar
- ⏳ Progress bar durante importação
- ⏳ Histórico de importações
- ⏳ Agendamento de importações

---

## 📞 SUPORTE

### Documentação
- **Guia Completo**: `IMPORTACAO_CSV.md`
- **Exemplos**: `exemplos_csv/README.md`
- **API Docs**: `API_COMPLETA.md`

### Troubleshooting

**Erro: "Arquivo deve ser CSV"**
→ Verifique extensão do arquivo (.csv)

**Erro: "Campo obrigatório ausente"**
→ Veja documentação do formato CSV

**Erro: "Encoding inválido"**
→ Salve como UTF-8 no Excel

**Dados não aparecem**
→ Verifique se não houve erros na importação

---

## ✅ RESUMO

### Funcionalidades Implementadas
- ✅ Importação de 7 tipos de dados via CSV
- ✅ Download de modelos CSV prontos
- ✅ Exportação de dados para CSV
- ✅ Validação completa de dados
- ✅ Tratamento de erros detalhado
- ✅ Update ou Create automático
- ✅ Exemplos prontos para uso
- ✅ Documentação completa

### Endpoints Criados
- ✅ POST `/api/importar-csv`
- ✅ GET `/api/modelo-csv/{tipo}`
- ✅ GET `/api/exportar-csv/{tipo}`

### Total de Endpoints na API
**39 endpoints** (36 anteriores + 3 novos)

---

**🎯 Status: PRONTO PARA USO!** 🚀

Agora é possível importar dados de planilhas Excel/Google Sheets diretamente no sistema, facilitando:
- ✅ População inicial de dados
- ✅ Migração de sistemas antigos
- ✅ Importação em lote
- ✅ Backup e restore
- ✅ Integração com outros sistemas

**📥 Os exemplos estão em `/backend/exemplos_csv/` prontos para testar!**
