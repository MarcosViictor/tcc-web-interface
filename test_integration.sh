#!/bin/bash

echo "🧪 TESTE DE INTEGRAÇÃO FRONTEND <-> BACKEND"
echo "=========================================="
echo ""

BASE_URL="http://localhost:8000/api"

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "1️⃣ Testando LOGIN..."
LOGIN_RESPONSE=$(curl -s -X POST ${BASE_URL}/auth/login \
  -H "Content-Type: application/json" \
  -d '{"matricula": "001234", "password": "apontador123"}')

if echo "$LOGIN_RESPONSE" | grep -q "access"; then
  echo -e "${GREEN}✅ Login funcionando!${NC}"
  TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['tokens']['access'])" 2>/dev/null)
  echo "   Token: ${TOKEN:0:20}..."
else
  echo -e "${RED}❌ Erro no login!${NC}"
  echo "   Response: $LOGIN_RESPONSE"
  exit 1
fi

echo ""
echo "2️⃣ Testando EQUIPAMENTOS (sem auth)..."
EQUIP_NO_AUTH=$(curl -s -X GET ${BASE_URL}/equipamentos/)
if echo "$EQUIP_NO_AUTH" | grep -q "detail"; then
  echo -e "${GREEN}✅ Proteção funcionando! (401 esperado)${NC}"
else
  echo -e "${YELLOW}⚠️  Endpoint sem proteção!${NC}"
fi

echo ""
echo "3️⃣ Testando EQUIPAMENTOS (com auth)..."
EQUIP_RESPONSE=$(curl -s -X GET ${BASE_URL}/equipamentos/ \
  -H "Authorization: Bearer $TOKEN")

if echo "$EQUIP_RESPONSE" | grep -q "placa"; then
  COUNT=$(echo "$EQUIP_RESPONSE" | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)
  echo -e "${GREEN}✅ Equipamentos retornados: $COUNT${NC}"
  echo "$EQUIP_RESPONSE" | python3 -m json.tool | head -20
else
  echo -e "${RED}❌ Erro ao buscar equipamentos!${NC}"
  echo "   Response: $EQUIP_RESPONSE"
fi

echo ""
echo "4️⃣ Testando REGISTROS DE EQUIPAMENTO..."
HOJE=$(date +%Y-%m-%d)
REG_EQ_RESPONSE=$(curl -s -X GET "${BASE_URL}/registros-equipamentos/?data_inicio=${HOJE}&data_fim=${HOJE}" \
  -H "Authorization: Bearer $TOKEN")

if echo "$REG_EQ_RESPONSE" | grep -q "\["; then
  COUNT=$(echo "$REG_EQ_RESPONSE" | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)
  echo -e "${GREEN}✅ Registros de equipamento: $COUNT${NC}"
else
  echo -e "${RED}❌ Erro ao buscar registros!${NC}"
fi

echo ""
echo "5️⃣ Testando REGISTROS DE MÃO DE OBRA..."
REG_MO_RESPONSE=$(curl -s -X GET "${BASE_URL}/registros-mao-obra/?validado=false" \
  -H "Authorization: Bearer $TOKEN")

if echo "$REG_MO_RESPONSE" | grep -q "\["; then
  COUNT=$(echo "$REG_MO_RESPONSE" | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)
  echo -e "${GREEN}✅ Registros de mão de obra: $COUNT${NC}"
else
  echo -e "${RED}❌ Erro ao buscar registros!${NC}"
fi

echo ""
echo "6️⃣ Testando OBRAS..."
OBRAS_RESPONSE=$(curl -s -X GET ${BASE_URL}/obras/ \
  -H "Authorization: Bearer $TOKEN")

if echo "$OBRAS_RESPONSE" | grep -q "codigo"; then
  COUNT=$(echo "$OBRAS_RESPONSE" | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)
  echo -e "${GREEN}✅ Obras retornadas: $COUNT${NC}"
else
  echo -e "${RED}❌ Erro ao buscar obras!${NC}"
fi

echo ""
echo "7️⃣ Testando ATIVIDADES..."
ATIV_RESPONSE=$(curl -s -X GET ${BASE_URL}/atividades/ \
  -H "Authorization: Bearer $TOKEN")

if echo "$ATIV_RESPONSE" | grep -q "codigo"; then
  COUNT=$(echo "$ATIV_RESPONSE" | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)
  echo -e "${GREEN}✅ Atividades retornadas: $COUNT${NC}"
else
  echo -e "${RED}❌ Erro ao buscar atividades!${NC}"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}✅ TESTE CONCLUÍDO!${NC}"
echo ""
echo "📊 RESUMO DOS DADOS:"
echo "  - Equipamentos: ${COUNT_EQUIP:-N/A}"
echo "  - Registros Equipamento (hoje): ${COUNT_REG_EQ:-N/A}"
echo "  - Registros Mão de Obra: ${COUNT_REG_MO:-N/A}"
echo "  - Obras: ${COUNT_OBRAS:-N/A}"
echo "  - Atividades: ${COUNT_ATIV:-N/A}"
