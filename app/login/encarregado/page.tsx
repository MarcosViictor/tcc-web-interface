"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, ArrowLeft, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function EncarregadoLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    matricula: "",
    password: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implementar lógica de autenticação com backend
    // Por enquanto, apenas redireciona para a página de equipe
    router.push("/encarregado/equipe")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/10 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Botão Voltar */}
        <Link href="/login">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <Card className="border-2">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center">
              <Users className="h-10 w-10 text-accent" />
            </div>
            <CardTitle className="text-2xl">Encarregado</CardTitle>
            <CardDescription>Gestão de equipes e atividades</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="matricula" className="text-sm font-medium">
                  Matrícula
                </label>
                <Input
                  id="matricula"
                  type="text"
                  placeholder="Digite sua matrícula"
                  value={formData.matricula}
                  onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Senha
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-muted-foreground">Lembrar-me</span>
                </label>
                <Link href="#" className="text-accent hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>

              <Button type="submit" className="w-full bg-accent hover:bg-accent/90" size="lg">
                Entrar
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <div className="bg-accent/5 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Suas Responsabilidades:</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Controle de presença da equipe</li>
                  <li>• Alocação de funcionários</li>
                  <li>• Registro de atividades diárias</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
              <p>Rodovia BR-116 - Trecho Cariri</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
