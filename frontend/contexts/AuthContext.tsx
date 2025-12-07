"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI, type User, type AuthTokens, type LoginCredentials, type RegisterData, APIError } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  tokens: AuthTokens | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (data: Partial<User>) => Promise<void>
  refreshAccessToken: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Chaves do localStorage
const STORAGE_KEYS = {
  USER: 'tcc_user',
  TOKENS: 'tcc_tokens',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [tokens, setTokens] = useState<AuthTokens | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    loadFromStorage()
  }, [])

  // Salvar no localStorage quando mudar
  useEffect(() => {
    if (user && tokens) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
      localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens))
    }
  }, [user, tokens])

  // Carregar dados do localStorage
  const loadFromStorage = () => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER)
      const storedTokens = localStorage.getItem(STORAGE_KEYS.TOKENS)

      if (storedUser && storedTokens) {
        setUser(JSON.parse(storedUser))
        setTokens(JSON.parse(storedTokens))
      }
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error)
      clearStorage()
    } finally {
      setIsLoading(false)
    }
  }

  // Limpar dados do localStorage
  const clearStorage = () => {
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.TOKENS)
  }

  // Login
  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true)
      const response = await authAPI.login(credentials)
      console.log('Login response:', response)
      
      setUser(response.user)
      setTokens(response.tokens)

      // Redirecionar baseado no tipo de usuário
      redirectByUserType(response.user.tipo_usuario)
    } catch (error) {
      if (error instanceof APIError) {
        throw new Error(error.message)
      }
      throw new Error('Erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  // Registro
  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true)
      const response = await authAPI.register(data)
      
      setUser(response.user)
      setTokens(response.tokens)

      // Redirecionar baseado no tipo de usuário
      redirectByUserType(response.user.tipo_usuario)
    } catch (error) {
      if (error instanceof APIError) {
        throw new Error(error.message)
      }
      throw new Error('Erro ao fazer registro')
    } finally {
      setIsLoading(false)
    }
  }

  // Logout
  const logout = () => {
    setUser(null)
    setTokens(null)
    clearStorage()
    router.push('/login')
  }

  // Atualizar perfil
  const updateUser = async (data: Partial<User>) => {
    if (!tokens?.access) {
      throw new Error('Usuário não autenticado')
    }

    try {
      const updatedUser = await authAPI.updateProfile(tokens.access, data)
      setUser(updatedUser)
    } catch (error) {
      if (error instanceof APIError) {
        throw new Error(error.message)
      }
      throw new Error('Erro ao atualizar perfil')
    }
  }

  // Renovar access token
  const refreshAccessToken = async () => {
    if (!tokens?.refresh) {
      logout()
      return
    }

    try {
      const newTokens = await authAPI.refreshToken(tokens.refresh)
      setTokens(newTokens)
    } catch (error) {
      console.error('Erro ao renovar token:', error)
      logout()
    }
  }

  // Redirecionar baseado no tipo de usuário
  const redirectByUserType = (tipoUsuario: User['tipo_usuario']) => {
    const routes = {
      admin: '/admin/dashboard',
      apontador: '/apontador/tarefas',
      encarregado: '/encarregado/equipe',
      motorista: '/motorista/equipamento',
    }

    router.push(routes[tipoUsuario])
  }

  const value = {
    user,
    tokens,
    isLoading,
    isAuthenticated: !!user && !!tokens,
    login,
    register,
    logout,
    updateUser,
    refreshAccessToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
