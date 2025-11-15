# Sistema de Login - TCC Web Interface

## 📋 Visão Geral

Sistema de autenticação com múltiplos perfis de usuário para o WebApp de gestão de obras da construção civil.

## 🔐 Perfis de Usuário

### 1. **Administrador**
- **Rota:** `/login/admin`
- **Credencial:** E-mail e Senha
- **Redirecionamento:** `/admin/dashboard`
- **Funcionalidades:**
  - Dashboard executivo
  - Gestão de obras e contratos
  - Relatórios e análises
  - Gerenciamento completo do sistema

### 2. **Apontador**
- **Rota:** `/login/apontador`
- **Credencial:** Matrícula e Senha
- **Redirecionamento:** `/apontador/tarefas`
- **Funcionalidades:**
  - Validação de equipamentos
  - Registro de atividades de campo
  - Quantificação de serviços
  - Verificação de jornadas

### 3. **Encarregado**
- **Rota:** `/login/encarregado`
- **Credencial:** Matrícula e Senha
- **Redirecionamento:** `/encarregado/equipe`
- **Funcionalidades:**
  - Controle de presença da equipe
  - Alocação de funcionários em atividades
  - Registro de atividades diárias
  - Gestão de equipes de trabalho

### 4. **Motorista/Operador**
- **Rota:** `/login/motorista`
- **Credencial:** Matrícula e Senha
- **Redirecionamento:** `/motorista/equipamento`
- **Funcionalidades:**
  - Registro de status do equipamento
  - Controle de horímetro
  - Histórico de atividades
  - Atualização de status em tempo real

## 🎨 Características da Interface

### Página de Seleção de Perfil (`/login`)
- Grid responsivo com cards para cada perfil
- Ícones diferenciados por perfil
- Cores temáticas:
  - **Administrador:** Primary (Azul)
  - **Apontador:** Secondary (Laranja)
  - **Encarregado:** Accent (Roxo)
  - **Motorista:** Success (Verde)
- Efeitos hover e animações
- Layout mobile-first

### Páginas de Login Individuais
Cada página de login possui:
- ✅ Formulário específico do perfil
- ✅ Campos apropriados (E-mail ou Matrícula)
- ✅ Campo de senha com visualização toggle
- ✅ Checkbox "Lembrar-me"
- ✅ Link "Esqueceu a senha?"
- ✅ Botão "Voltar" para página de seleção
- ✅ Informações contextuais do perfil
- ✅ Cores e ícones consistentes com o tema

## 🔄 Fluxo de Navegação

```
Página Inicial (/)
    ↓
Seleção de Perfil (/login)
    ↓
    ├─→ Login Admin (/login/admin) → Dashboard (/admin/dashboard)
    ├─→ Login Apontador (/login/apontador) → Tarefas (/apontador/tarefas)
    ├─→ Login Encarregado (/login/encarregado) → Equipe (/encarregado/equipe)
    └─→ Login Motorista (/login/motorista) → Equipamento (/motorista/equipamento)
```

## 🛠️ Implementação Técnica

### Tecnologias Utilizadas
- **Framework:** Next.js 16.0 (App Router)
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Forms:** React Hooks (useState)
- **Navigation:** Next.js Navigation (useRouter)

### Estrutura de Arquivos
```
app/
├── page.tsx                          # Página inicial
├── login/
│   ├── page.tsx                     # Seleção de perfil
│   ├── admin/
│   │   └── page.tsx                 # Login administrador
│   ├── apontador/
│   │   └── page.tsx                 # Login apontador
│   ├── encarregado/
│   │   └── page.tsx                 # Login encarregado
│   └── motorista/
│       └── page.tsx                 # Login motorista
```

### State Management
Cada página de login gerencia:
```typescript
const [showPassword, setShowPassword] = useState(false)
const [formData, setFormData] = useState({
  email: "",      // ou matricula
  password: "",
})
```

### Função de Submit
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  // TODO: Implementar lógica de autenticação com backend
  router.push("/destino")
}
```

## 🔜 Próximos Passos (Backend)

### Implementação Necessária:
1. **API de Autenticação**
   - Endpoint de login para cada perfil
   - Validação de credenciais
   - Geração de tokens JWT

2. **Gerenciamento de Sessão**
   - Storage de tokens (localStorage/cookies)
   - Verificação de autenticação em rotas protegidas
   - Logout e expiração de sessão

3. **Integração com Banco de Dados**
   - Tabela de usuários
   - Tabela de perfis/roles
   - Hash de senhas
   - Recuperação de senha

4. **Middleware de Proteção**
   - Verificação de autenticação
   - Verificação de permissões por perfil
   - Redirecionamento automático

### Exemplo de Integração (Backend)
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        role: 'admin' // ou 'apontador', 'encarregado', 'motorista'
      })
    })
    
    const data = await response.json()
    
    if (data.success) {
      localStorage.setItem('token', data.token)
      router.push('/admin/dashboard')
    } else {
      // Tratar erro
    }
  } catch (error) {
    console.error('Erro no login:', error)
  }
}
```

## 📱 Responsividade

Todas as páginas são totalmente responsivas com breakpoints:
- **Mobile:** < 768px (1 coluna)
- **Tablet:** 768px - 1024px (2 colunas)
- **Desktop:** > 1024px (4 colunas na seleção)

## ♿ Acessibilidade

- Labels associados aos inputs
- Contraste adequado de cores
- Navegação por teclado
- Ícones descritivos
- Feedback visual em interações

## 🎯 Objetivos Alcançados

- ✅ Interface moderna e profissional
- ✅ Separação clara de perfis de usuário
- ✅ UX intuitiva e consistente
- ✅ Preparado para integração com backend
- ✅ Código organizado e manutenível
- ✅ Design system consistente (shadcn/ui)

---

**Obra:** Rodovia BR-116 - Trecho Cariri  
**Projeto:** TCC - Sistema de Gestão de Obras  
**Desenvolvido por:** Victor Marcos
