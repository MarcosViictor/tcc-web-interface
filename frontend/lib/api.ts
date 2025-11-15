// Configuração da API e funções de autenticação

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'

// Tipos
export interface LoginCredentials {
  email?: string
  matricula?: string
  password: string
}

export interface RegisterData {
  nome: string
  email?: string
  matricula?: string
  cpf: string
  telefone: string
  tipo_usuario: 'admin' | 'apontador' | 'encarregado' | 'motorista'
  funcao: string
  cargo: string
  password: string
}

export interface User {
  id: number
  nome: string
  email?: string
  matricula?: string
  cpf: string
  telefone: string
  tipo_usuario: 'admin' | 'apontador' | 'encarregado' | 'motorista'
  funcao: string
  cargo: string
  is_active: boolean
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

// Classe de erro customizada
export class APIError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message)
    this.name = 'APIError'
  }
}

// Função auxiliar para fazer requisições
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    
    // Se não houver conteúdo (204), retorna null
    if (response.status === 204) {
      return null
    }

    const data = await response.json()

    if (!response.ok) {
      throw new APIError(
        response.status,
        data.detail || data.message || 'Erro na requisição',
        data
      )
    }

    return data
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError(0, 'Erro de conexão com o servidor')
  }
}

// Funções de autenticação
export const authAPI = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  },

  // Registro
  async register(data: RegisterData): Promise<AuthResponse> {
    return fetchAPI('/auth/registro', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    return fetchAPI('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    })
  },

  // Obter perfil do usuário
  async getProfile(token: string): Promise<User> {
    return fetchAPI('/auth/perfil', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  },

  // Atualizar perfil
  async updateProfile(token: string, data: Partial<User>): Promise<User> {
    return fetchAPI('/auth/perfil', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
  },

  // Trocar senha
  async changePassword(token: string, oldPassword: string, newPassword: string): Promise<{ message: string }> {
    return fetchAPI('/auth/trocar-senha', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    })
  },
}

// Função auxiliar para fazer requisições autenticadas
export async function fetchWithAuth(endpoint: string, token: string, options: RequestInit = {}) {
  return fetchAPI(endpoint, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  })
}

export default fetchAPI
