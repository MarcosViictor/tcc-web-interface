#!/bin/bash

# Script para iniciar o sistema completo (Backend + Frontend)

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Sistema de Gestão de Obras - TCC                        ║${NC}"
echo -e "${BLUE}║   Iniciando Backend + Frontend                             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar se está na pasta raiz
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${YELLOW}⚠️  Execute este script da pasta raiz do projeto!${NC}"
    exit 1
fi

# Função para iniciar backend
start_backend() {
    echo -e "${GREEN}🔧 Iniciando Backend (Django)...${NC}"
    cd backend
    
    # Verificar se venv existe
    if [ -d "venv" ]; then
        echo "   → Ativando ambiente virtual..."
        source venv/bin/activate
    fi
    
    # Aplicar migrações (se necessário)
    echo "   → Verificando migrações..."
    python manage.py migrate --noinput > /dev/null 2>&1
    
    # Iniciar servidor
    echo "   → Iniciando servidor Django em http://127.0.0.1:8000"
    python manage.py runserver
}

# Função para iniciar frontend
start_frontend() {
    echo -e "${GREEN}🎨 Iniciando Frontend (Next.js)...${NC}"
    cd frontend
    
    # Verificar se node_modules existe
    if [ ! -d "node_modules" ]; then
        echo "   → Instalando dependências..."
        npm install
    fi
    
    # Verificar se .env.local existe
    if [ ! -f ".env.local" ]; then
        echo "   → Criando .env.local..."
        echo "NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api" > .env.local
    fi
    
    # Iniciar servidor
    echo "   → Iniciando servidor Next.js em http://localhost:3000"
    npm run dev
}

# Menu de escolha
echo "Escolha como iniciar:"
echo "1) Apenas Backend"
echo "2) Apenas Frontend"
echo "3) Ambos (em terminais separados)"
echo ""
read -p "Opção [1-3]: " choice

case $choice in
    1)
        start_backend
        ;;
    2)
        start_frontend
        ;;
    3)
        echo -e "${YELLOW}📝 Abrindo dois terminais...${NC}"
        echo ""
        echo -e "${BLUE}Terminal 1:${NC} Backend"
        echo -e "${BLUE}Terminal 2:${NC} Frontend"
        echo ""
        
        # Tentar usar gnome-terminal (Ubuntu/Debian)
        if command -v gnome-terminal &> /dev/null; then
            gnome-terminal -- bash -c "cd backend && ([ -d venv ] && source venv/bin/activate); python manage.py runserver; exec bash"
            gnome-terminal -- bash -c "cd frontend && npm run dev; exec bash"
        # Tentar usar xterm
        elif command -v xterm &> /dev/null; then
            xterm -e "cd backend && ([ -d venv ] && source venv/bin/activate); python manage.py runserver; bash" &
            xterm -e "cd frontend && npm run dev; bash" &
        else
            echo -e "${YELLOW}⚠️  Não foi possível abrir terminais automaticamente.${NC}"
            echo ""
            echo "Execute manualmente em dois terminais separados:"
            echo ""
            echo -e "${BLUE}Terminal 1:${NC}"
            echo "  cd backend"
            echo "  python manage.py runserver"
            echo ""
            echo -e "${BLUE}Terminal 2:${NC}"
            echo "  cd frontend"
            echo "  npm run dev"
        fi
        ;;
    *)
        echo -e "${YELLOW}⚠️  Opção inválida!${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Sistema iniciado!${NC}"
echo ""
echo -e "${BLUE}📍 URLs:${NC}"
echo "   Backend:  http://127.0.0.1:8000"
echo "   Frontend: http://localhost:3000"
echo "   Admin:    http://localhost:3000/login"
echo ""
echo -e "${BLUE}🔑 Credenciais de Teste:${NC}"
echo "   Admin:       admin@tcc.com / admin123"
echo "   Motorista:   001236 / senha123"
echo "   Apontador:   001234 / senha123"
echo "   Encarregado: 001235 / senha123"
echo ""
echo -e "${YELLOW}📝 Para parar os servidores, pressione Ctrl+C${NC}"
