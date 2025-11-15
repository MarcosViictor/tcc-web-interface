# 🔌 Guia de Integração Frontend + Backend

## 📁 Estrutura Recomendada no Next.js

```
frontend/
├── lib/
│   ├── api.ts           # Funções de API
│   ├── auth.ts          # Gerenciamento de autenticação
│   └── types.ts         # TypeScript types
├── app/
│   ├── login/
│   │   └── page.tsx     # ✅ Já existe
│   ├── admin/
│   │   └── dashboard/
│   │       └── page.tsx # ✅ Já existe
│   ├── apontador/
│   │   └── tarefas/
│   │       └── page.tsx # ✅ Já existe
│   ├── encarregado/
│   │   └── equipe/
│   │       └── page.tsx # ✅ Já existe
│   └── motorista/
│       └── equipamento/
│           └── page.tsx # ✅ Já existe
```

---

## 1️⃣ Criar `lib/api.ts`

```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// ========== HELPERS ==========

function getHeaders(token?: string) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro na requisição');
  }
  return response.json();
}

// ========== AUTENTICAÇÃO ==========

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
}

export async function loginWithMatricula(matricula: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ matricula, password }),
  });
  return handleResponse(response);
}

export async function logout(refreshToken: string, accessToken: string) {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: getHeaders(accessToken),
    body: JSON.stringify({ refresh: refreshToken }),
  });
  return handleResponse(response);
}

export async function getMe(token: string) {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: getHeaders(token),
  });
  return handleResponse(response);
}

// ========== EQUIPAMENTOS ==========

export async function getEquipamentos(token: string, filters?: {
  obra?: number;
  status?: string;
  tipo?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.obra) params.append('obra', filters.obra.toString());
  if (filters?.status) params.append('status', filters.status);
  if (filters?.tipo) params.append('tipo', filters.tipo);
  
  const url = `${API_URL}/equipamentos${params.toString() ? '?' + params.toString() : ''}`;
  
  const response = await fetch(url, {
    headers: getHeaders(token),
  });
  return handleResponse(response);
}

export async function createEquipamento(token: string, data: any) {
  const response = await fetch(`${API_URL}/equipamentos`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

// ========== REGISTROS DE EQUIPAMENTOS ==========

export async function getRegistrosEquipamentos(token: string, filters?: {
  equipamento?: number;
  motorista?: number;
  data?: string;
  validado?: boolean;
}) {
  const params = new URLSearchParams();
  if (filters?.equipamento) params.append('equipamento', filters.equipamento.toString());
  if (filters?.motorista) params.append('motorista', filters.motorista.toString());
  if (filters?.data) params.append('data', filters.data);
  if (filters?.validado !== undefined) params.append('validado', filters.validado.toString());
  
  const url = `${API_URL}/registros-equipamentos${params.toString() ? '?' + params.toString() : ''}`;
  
  const response = await fetch(url, {
    headers: getHeaders(token),
  });
  return handleResponse(response);
}

export async function createRegistroEquipamento(token: string, data: any) {
  const response = await fetch(`${API_URL}/registros-equipamentos`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function validarRegistroEquipamento(token: string, id: number) {
  const response = await fetch(`${API_URL}/registros-equipamentos/${id}/validar`, {
    method: 'POST',
    headers: getHeaders(token),
  });
  return handleResponse(response);
}

// ========== REGISTROS DE MÃO DE OBRA ==========

export async function getRegistrosMaoObra(token: string, filters?: {
  obra?: number;
  apontador?: number;
  data?: string;
  validado?: boolean;
}) {
  const params = new URLSearchParams();
  if (filters?.obra) params.append('obra', filters.obra.toString());
  if (filters?.apontador) params.append('apontador', filters.apontador.toString());
  if (filters?.data) params.append('data', filters.data);
  if (filters?.validado !== undefined) params.append('validado', filters.validado.toString());
  
  const url = `${API_URL}/registros-mao-obra${params.toString() ? '?' + params.toString() : ''}`;
  
  const response = await fetch(url, {
    headers: getHeaders(token),
  });
  return handleResponse(response);
}

export async function createRegistroMaoObra(token: string, data: any) {
  const response = await fetch(`${API_URL}/registros-mao-obra`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function validarRegistroMaoObra(token: string, id: number) {
  const response = await fetch(`${API_URL}/registros-mao-obra/${id}/validar`, {
    method: 'POST',
    headers: getHeaders(token),
  });
  return handleResponse(response);
}

// ========== ATIVIDADES DA EQUIPE ==========

export async function getAtividadesEquipe(token: string, filters?: {
  obra?: number;
  encarregado?: number;
  data?: string;
  status?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.obra) params.append('obra', filters.obra.toString());
  if (filters?.encarregado) params.append('encarregado', filters.encarregado.toString());
  if (filters?.data) params.append('data', filters.data);
  if (filters?.status) params.append('status', filters.status);
  
  const url = `${API_URL}/atividades-equipe${params.toString() ? '?' + params.toString() : ''}`;
  
  const response = await fetch(url, {
    headers: getHeaders(token),
  });
  return handleResponse(response);
}

export async function createAtividadeEquipe(token: string, data: any) {
  const response = await fetch(`${API_URL}/atividades-equipe`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

// ========== DIÁRIOS DE OBRA ==========

export async function getDiariosObra(token: string, filters?: {
  obra?: number;
  encarregado?: number;
  data?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.obra) params.append('obra', filters.obra.toString());
  if (filters?.encarregado) params.append('encarregado', filters.encarregado.toString());
  if (filters?.data) params.append('data', filters.data);
  
  const url = `${API_URL}/diarios-obra${params.toString() ? '?' + params.toString() : ''}`;
  
  const response = await fetch(url, {
    headers: getHeaders(token),
  });
  return handleResponse(response);
}

export async function createDiarioObra(token: string, data: any) {
  const response = await fetch(`${API_URL}/diarios-obra`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

// ========== OBRAS ==========

export async function getObras(token: string) {
  const response = await fetch(`${API_URL}/obras`, {
    headers: getHeaders(token),
  });
  return handleResponse(response);
}

// ========== USUÁRIOS ==========

export async function getUsuarios(token: string, tipo?: string) {
  const url = tipo 
    ? `${API_URL}/usuarios?tipo=${tipo}`
    : `${API_URL}/usuarios`;
  
  const response = await fetch(url, {
    headers: getHeaders(token),
  });
  return handleResponse(response);
}

// ========== DASHBOARD ==========

export async function getDashboardStats(token: string) {
  const response = await fetch(`${API_URL}/dashboard/stats`, {
    headers: getHeaders(token),
  });
  return handleResponse(response);
}

// ========== ATIVIDADES ==========

export async function getAtividades(token: string, filters?: {
  obra?: number;
  categoria?: number;
  ativa?: boolean;
}) {
  const params = new URLSearchParams();
  if (filters?.obra) params.append('obra', filters.obra.toString());
  if (filters?.categoria) params.append('categoria', filters.categoria.toString());
  if (filters?.ativa !== undefined) params.append('ativa', filters.ativa.toString());
  
  const url = `${API_URL}/atividades${params.toString() ? '?' + params.toString() : ''}`;
  
  const response = await fetch(url, {
    headers: getHeaders(token),
  });
  return handleResponse(response);
}
```

---

## 2️⃣ Criar `lib/auth.ts`

```typescript
// lib/auth.ts
const TOKEN_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';
const USER_KEY = 'user';

export function saveTokens(access: string, refresh: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  }
}

export function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function getRefreshToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(REFRESH_KEY);
  }
  return null;
}

export function saveUser(user: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getUser() {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
}

export function clearAuth() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}
```

---

## 3️⃣ Criar `lib/types.ts`

```typescript
// lib/types.ts
export interface Usuario {
  id: number;
  nome: string;
  email?: string;
  matricula?: string;
  tipo_usuario: 'admin' | 'apontador' | 'encarregado' | 'motorista';
  funcao: string;
  cargo: string;
}

export interface Equipamento {
  id: number;
  nome: string;
  tipo: string;
  modelo: string;
  placa: string;
  fabricante: string;
  ano: number;
  horimetro_atual: number;
  status: 'ativo' | 'manutencao' | 'inativo';
  obra?: number;
  obra_nome?: string;
  motorista_atual?: number;
  motorista_nome?: string;
}

export interface RegistroEquipamento {
  id?: number;
  equipamento: number;
  motorista: number;
  data: string;
  horimetro_inicial: number;
  horimetro_final: number;
  hora_inicio: string;
  hora_fim: string;
  atividade_principal: string;
  local: string;
  observacoes?: string;
  fotos?: string[];
  validado?: boolean;
  horas_trabalhadas?: number;
  horimetro_trabalhado?: number;
}

export interface RegistroMaoObra {
  id?: number;
  apontador: number;
  obra: number;
  data: string;
  funcionarios_presentes: number[];
  total_funcionarios: number;
  hora_inicio: string;
  hora_fim: string;
  local: string;
  observacoes?: string;
  fotos?: string[];
  validado?: boolean;
}

export interface AtividadeEquipe {
  id?: number;
  encarregado: number;
  obra: number;
  descricao: string;
  data: string;
  hora_inicio: string;
  hora_fim?: string;
  local: string;
  funcionarios: number[];
  status: 'planejada' | 'em_andamento' | 'concluida' | 'cancelada';
  observacoes?: string;
}

export interface DiarioObra {
  id?: number;
  encarregado: number;
  obra: number;
  data: string;
  total_funcionarios: number;
  funcionarios_presentes: number;
  atividades_concluidas: number;
  atividades_parciais: number;
  condicoes_climaticas: string;
  observacoes: string;
  atividades?: number[];
  equipamentos?: number[];
}
```

---

## 4️⃣ Exemplo de Uso na Página de Login

```typescript
// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, loginWithMatricula } from '@/lib/api';
import { saveTokens, saveUser } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [useEmail, setUseEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = useEmail
        ? await login(email, password)
        : await loginWithMatricula(matricula, password);

      // Salvar tokens e usuário
      saveTokens(response.tokens.access, response.tokens.refresh);
      saveUser(response.user);

      // Redirecionar baseado no tipo de usuário
      switch (response.user.tipo_usuario) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'apontador':
          router.push('/apontador/tarefas');
          break;
        case 'encarregado':
          router.push('/encarregado/equipe');
          break;
        case 'motorista':
          router.push('/motorista/equipamento');
          break;
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-4 w-96">
        <h1 className="text-2xl font-bold">Login</h1>

        <div>
          <button
            type="button"
            onClick={() => setUseEmail(!useEmail)}
            className="text-sm text-blue-600"
          >
            {useEmail ? 'Usar matrícula' : 'Usar email'}
          </button>
        </div>

        {useEmail ? (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
        ) : (
          <input
            type="text"
            placeholder="Matrícula"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            className="w-full p-2 border rounded"
          />
        )}

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
```

---

## 5️⃣ Exemplo: Motorista - Página de Equipamento

```typescript
// app/motorista/equipamento/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getAccessToken, getUser } from '@/lib/auth';
import { 
  getRegistrosEquipamentos, 
  createRegistroEquipamento,
  getEquipamentos 
} from '@/lib/api';
import { RegistroEquipamento, Equipamento } from '@/lib/types';

export default function MotoristaEquipamentoPage() {
  const [registros, setRegistros] = useState<RegistroEquipamento[]>([]);
  const [equipamento, setEquipamento] = useState<Equipamento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = getAccessToken();
    const user = getUser();
    
    if (!token || !user) return;

    try {
      // Buscar equipamento do motorista
      const equipamentos = await getEquipamentos(token, { 
        motorista_atual: user.id 
      });
      if (equipamentos.length > 0) {
        setEquipamento(equipamentos[0]);
      }

      // Buscar registros do motorista
      const regs = await getRegistrosEquipamentos(token, { 
        motorista: user.id 
      });
      setRegistros(regs);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRegistro = async (data: Partial<RegistroEquipamento>) => {
    const token = getAccessToken();
    if (!token) return;

    try {
      await createRegistroEquipamento(token, data);
      await loadData(); // Recarregar dados
    } catch (error) {
      console.error('Erro ao criar registro:', error);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Meu Equipamento</h1>
      
      {equipamento && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold">{equipamento.nome}</h2>
          <p>Placa: {equipamento.placa}</p>
          <p>Horímetro Atual: {equipamento.horimetro_atual}</p>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Meus Registros</h2>
      
      <div className="space-y-4">
        {registros.map((registro) => (
          <div key={registro.id} className="bg-white p-4 rounded shadow">
            <p className="font-semibold">{registro.data}</p>
            <p>Horas: {registro.horas_trabalhadas}h</p>
            <p>Status: {registro.validado ? '✅ Validado' : '⏳ Pendente'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 6️⃣ Variável de Ambiente

Crie `.env.local` no frontend:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

---

## 🚀 Próximos Passos

1. ✅ Implementar funções de API no `lib/api.ts`
2. ✅ Criar gerenciamento de auth no `lib/auth.ts`
3. ✅ Definir TypeScript types no `lib/types.ts`
4. ✅ Atualizar páginas para usar API real
5. ⏳ Implementar upload de fotos
6. ⏳ Adicionar loading states
7. ⏳ Tratamento de erros
8. ⏳ Refresh de tokens automático

---

**🎯 Com isso, você terá um sistema fullstack completo e funcional!** 🚀
