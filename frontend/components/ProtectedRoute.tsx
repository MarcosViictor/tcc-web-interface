"use client"

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedTypes?: ('admin' | 'apontador' | 'encarregado' | 'motorista')[]
  requireAuth?: boolean
}

export function ProtectedRoute({ 
  children, 
  allowedTypes,
  requireAuth = true 
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Se não precisa autenticação, renderiza direto
    if (!requireAuth) return

    // Aguarda carregar dados do localStorage
    if (isLoading) return

    // Se não está autenticado, redireciona para login
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Se especificou tipos permitidos, verifica se o usuário tem permissão
    if (user && allowedTypes && !allowedTypes.includes(user.tipo_usuario)) {
      // Redireciona para a página correta do tipo de usuário
      const routes = {
        admin: '/admin/dashboard',
        apontador: '/apontador/tarefas',
        encarregado: '/encarregado/equipe',
        motorista: '/motorista/equipamento',
      }
      router.push(routes[user.tipo_usuario])
    }
  }, [isAuthenticated, isLoading, user, requireAuth, allowedTypes, router])

  // Mostra loading enquanto verifica autenticação
  if (requireAuth && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não está autenticado e requer autenticação, não renderiza nada
  // (vai redirecionar no useEffect)
  if (requireAuth && !isAuthenticated) {
    return null
  }

  // Se está autenticado mas não tem permissão, não renderiza
  // (vai redirecionar no useEffect)
  if (user && allowedTypes && !allowedTypes.includes(user.tipo_usuario)) {
    return null
  }

  // Tudo certo, renderiza o conteúdo
  return <>{children}</>
}
