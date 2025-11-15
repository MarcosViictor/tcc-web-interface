"use client"

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'

export function UserHeader() {
  const { user, logout } = useAuth()

  if (!user) return null

  // Mapear tipo de usuário para label
  const userTypeLabels = {
    admin: 'Administrador',
    apontador: 'Apontador',
    encarregado: 'Encarregado',
    motorista: 'Motorista',
  }

  // Cores por tipo de usuário
  const userTypeColors = {
    admin: 'bg-primary text-primary-foreground',
    apontador: 'bg-secondary text-secondary-foreground',
    encarregado: 'bg-accent text-accent-foreground',
    motorista: 'bg-success text-success-foreground',
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo/Título */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-lg font-bold text-primary-foreground">
              {user.nome.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-sm font-semibold">Sistema de Gestão de Obras</h1>
            <p className="text-xs text-muted-foreground">BR-116 - Trecho Cariri</p>
          </div>
        </div>

        {/* Informações do Usuário */}
        <div className="flex items-center gap-3">
          {/* Badge do tipo de usuário */}
          <div className={`rounded-full px-3 py-1 text-xs font-medium ${userTypeColors[user.tipo_usuario]}`}>
            {userTypeLabels[user.tipo_usuario]}
          </div>

          {/* Nome e dados */}
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">{user.nome}</p>
            <p className="text-xs text-muted-foreground">
              {user.email || `Mat. ${user.matricula}`}
            </p>
          </div>

          {/* Botão de perfil (opcional) */}
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <User className="h-4 w-4" />
          </Button>

          {/* Botão de logout */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={logout}
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
