# 📁 Exemplos de CSV para Importação

Esta pasta contém arquivos CSV de exemplo prontos para importação no sistema.

## 📋 Arquivos Disponíveis

1. **exemplo_obras.csv** - 3 obras de exemplo
2. **exemplo_equipamentos.csv** - 5 equipamentos variados
3. **exemplo_usuarios.csv** - 5 usuários (motoristas, apontadores, encarregados)
4. **exemplo_atividades.csv** - 10 atividades em 4 categorias
5. **exemplo_registros_equipamentos.csv** - 5 registros diários
6. **exemplo_registros_mao_obra.csv** - 3 registros de equipe
7. **exemplo_diarios_obra.csv** - 3 RDOs

## 🚀 Como Usar

### Opção 1: Importar via API

```bash
# 1. Fazer login e obter token
TOKEN="seu_token_aqui"

# 2. Importar cada arquivo
curl -X POST "http://127.0.0.1:8000/api/importar-csv" \
  -H "Authorization: Bearer $TOKEN" \
  -F "tipo=obras" \
  -F "arquivo=@exemplo_obras.csv"

curl -X POST "http://127.0.0.1:8000/api/importar-csv" \
  -H "Authorization: Bearer $TOKEN" \
  -F "tipo=equipamentos" \
  -F "arquivo=@exemplo_equipamentos.csv"

# ... continuar com os outros
```

### Opção 2: Importar via Interface Web

1. Faça login no sistema
2. Acesse a página de importação
3. Selecione o tipo de dados
4. Escolha o arquivo CSV correspondente
5. Clique em "Importar"

## 📝 Ordem Recomendada de Importação

Para evitar erros de dependência, importe nesta ordem:

1. ✅ **usuarios** - Criar funcionários primeiro
2. ✅ **obras** - Criar obras
3. ✅ **equipamentos** - Equipamentos dependem de obras e motoristas
4. ✅ **atividades** - Atividades dependem de obras
5. ✅ **registros_equipamentos** - Dependem de equipamentos e motoristas
6. ✅ **registros_mao_obra** - Dependem de obras, apontadores e funcionários
7. ✅ **diarios_obra** - Dependem de obras e encarregados

## ⚠️ Notas Importantes

- Os exemplos usam matrículas e emails dos usuários de teste já existentes no sistema
- Se importar os usuários de exemplo, eles terão a senha: `senha123`
- Os códigos de obras, placas de equipamentos e códigos de atividades devem ser únicos
- Datas estão no formato brasileiro: DD/MM/YYYY
- Números decimais usam ponto: 1500.5

## 🔄 Reimportação

Você pode reimportar os mesmos arquivos:
- Registros existentes serão **atualizados**
- Novos registros serão **criados**
- Isso permite corrigir dados sem duplicar

## 📊 Dados nos Exemplos

### Obras
- OBR-001: Pavimentação BR-101 (em andamento)
- OBR-002: Ponte Rio Grande (planejamento)
- OBR-003: Manutenção BR-050 (planejamento)

### Equipamentos
- 5 equipamentos variados (caminhões, escavadeira, rolo, niveladora)
- Todos alocados em obras
- Com horímetros atualizados

### Usuários
- 5 funcionários de diferentes tipos
- Matrículas: 001240 a 001244
- Todos com senha: senha123

### Atividades
- 10 atividades em 4 categorias
- Terraplenagem, Pavimentação, Drenagem, Sinalização
- Preços unitários variados

### Registros
- Registros de equipamentos dos últimos 2 dias
- Registros de mão de obra com funcionários alocados
- Diários de obra completos com observações

## 🛠️ Personalizando os Exemplos

1. Abra os arquivos CSV em Excel/LibreOffice/Google Sheets
2. Modifique os dados conforme necessário
3. Salve como CSV (UTF-8)
4. Importe no sistema

## 💡 Dicas

- Use os exemplos como template para seus próprios dados
- Mantenha o formato das colunas
- Não altere os nomes dos cabeçalhos
- Verifique referências (obras existentes, usuários, etc)

---

**📘 Documentação completa:** Veja `../IMPORTACAO_CSV.md`
