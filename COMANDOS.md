# 🚀 Guia Rápido de Comandos

## Frontend

### Iniciar o servidor de desenvolvimento
```bash
cd frontend
npm run dev
```
ou
```bash
cd frontend
pnpm dev
```

Acesse: http://localhost:3000

### Build para produção
```bash
cd frontend
npm run build
npm run start
```

### Verificar erros
```bash
cd frontend
npm run lint
```

## Backend (Futuro)

### Quando criar o backend, use:
```bash
mkdir backend
cd backend
npm init -y
```

### Estrutura sugerida:
```
backend/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.ts
├── package.json
└── tsconfig.json
```

## Git

### Primeiro commit após reorganização:
```bash
git add .
git commit -m "chore: reorganizar projeto em frontend/backend"
git push origin main
```

### Criar branch para backend:
```bash
git checkout -b feature/backend-setup
```

## Dicas

### Se o servidor não iniciar:
1. Verifique se está na pasta `frontend`
2. Rode `npm install` ou `pnpm install`
3. Limpe o cache: `rm -rf .next`
4. Tente novamente: `npm run dev`

### Se der erro de porta em uso:
```bash
# Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9
```

### Verificar versões:
```bash
node --version    # v18 ou superior
npm --version
```

## Próximos Passos

1. ✅ Frontend completo e funcionando
2. ⏳ Criar estrutura do backend
3. ⏳ Implementar APIs REST
4. ⏳ Configurar banco de dados
5. ⏳ Integrar frontend com backend
6. ⏳ Autenticação JWT
7. ⏳ Upload de imagens
8. ⏳ Geração de PDFs
9. ⏳ Deploy

## Comandos Úteis

### Instalar nova dependência no frontend:
```bash
cd frontend
npm install nome-do-pacote
```

### Adicionar componente shadcn/ui:
```bash
cd frontend
npx shadcn@latest add [component-name]
```

### Ver logs do servidor:
```bash
cd frontend
npm run dev -- --turbo  # Com Turbopack para build mais rápido
```
