"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ClipboardCheck, Users, HardHat } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary mb-4">
            <Shield className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Sistema de Gestão de Obras</h1>
          <p className="text-muted-foreground">Selecione seu perfil para acessar</p>
        </div>

        {/* Grid de Perfis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Administrador */}
          <Link href="/login/admin">
            <Card className="hover:shadow-xl transition-all hover:scale-105 cursor-pointer border-2 hover:border-primary group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Administrador</CardTitle>
                <CardDescription>Acesso completo ao sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Dashboard executivo</li>
                  <li>• Gestão de obras e contratos</li>
                  <li>• Relatórios e análises</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          {/* Apontador */}
          <Link href="/login/apontador">
            <Card className="hover:shadow-xl transition-all hover:scale-105 cursor-pointer border-2 hover:border-secondary group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <ClipboardCheck className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-xl">Apontador</CardTitle>
                <CardDescription>Validação e registro de campo</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Validação de equipamentos</li>
                  <li>• Registro de atividades</li>
                  <li>• Quantificação de serviços</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          {/* Encarregado */}
          <Link href="/login/encarregado">
            <Card className="hover:shadow-xl transition-all hover:scale-105 cursor-pointer border-2 hover:border-accent group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl">Encarregado</CardTitle>
                <CardDescription>Gestão de equipes</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Controle de presença</li>
                  <li>• Alocação de funcionários</li>
                  <li>• Gestão de atividades</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          {/* Motorista/Operador */}
          <Link href="/login/motorista">
            <Card className="hover:shadow-xl transition-all hover:scale-105 cursor-pointer border-2 hover:border-success group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                  <HardHat className="h-8 w-8 text-success" />
                </div>
                <CardTitle className="text-xl">Motorista</CardTitle>
                <CardDescription>Operação de equipamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Registro de status</li>
                  <li>• Controle de horímetro</li>
                  <li>• Histórico de atividades</li>
                </ul>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Rodovia BR-116 - Trecho Cariri</p>
        </div>
      </div>
    </div>
  )
}
