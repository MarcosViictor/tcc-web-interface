"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, UserCheck, UserX, Search, Plus, CheckCircle2, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function EncarregadoEquipe() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)

  const funcionarios = [
    { id: 1, matricula: "001234", nome: "José da Silva", presente: true, atividade: "Escavação" },
    { id: 2, matricula: "001235", nome: "Maria Santos", presente: true, atividade: "Escavação" },
    { id: 3, matricula: "001236", nome: "Pedro Oliveira", presente: true, atividade: null },
    { id: 4, matricula: "001237", nome: "Ana Costa", presente: false, atividade: null },
    { id: 5, matricula: "001238", nome: "Carlos Mendes", presente: true, atividade: "Compactação" },
    { id: 6, matricula: "001239", nome: "Lucia Ferreira", presente: true, atividade: null },
  ]

  const atividades = [
    { id: "escavacao", nome: "Escavação de Vala", icon: "⛏️", alocados: 2 },
    { id: "compactacao", nome: "Compactação de Aterro", icon: "🚜", alocados: 1 },
    { id: "transporte", nome: "Transporte de Material", icon: "🚛", alocados: 0 },
    { id: "nivelamento", nome: "Nivelamento de Pista", icon: "📏", alocados: 0 },
  ]

  const presentes = funcionarios.filter((f) => f.presente).length
  const alocados = funcionarios.filter((f) => f.presente && f.atividade).length

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Mobile-First */}
      <header className="bg-accent text-accent-foreground sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Minha Equipe</h1>
              <p className="text-sm opacity-90">Encarregado: Pedro Santos</p>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm" className="bg-accent-foreground/10 border-accent-foreground/20">
                Sair
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Resumo da Equipe */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="bg-card">
            <CardContent className="pt-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <div className="text-2xl font-bold">{funcionarios.length}</div>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>

          <Card className="bg-success/5 border-success/20">
            <CardContent className="pt-4 text-center">
              <UserCheck className="h-6 w-6 mx-auto mb-2 text-success" />
              <div className="text-2xl font-bold text-success">{presentes}</div>
              <p className="text-xs text-muted-foreground">Presentes</p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-4 text-center">
              <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-primary">{alocados}</div>
              <p className="text-xs text-muted-foreground">Alocados</p>
            </CardContent>
          </Card>
        </div>

        {/* Buscar Funcionário */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Adicionar à Equipe</CardTitle>
            <CardDescription>Busque por matrícula para adicionar funcionários</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Digite a matrícula..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Check-in de Presença */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Check-in de Presença</CardTitle>
            <CardDescription>Marque os funcionários presentes hoje</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {funcionarios.map((func) => (
                <div
                  key={func.id}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                    func.presente ? "bg-success/5 border-success/30" : "bg-muted/30 border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold ${
                        func.presente ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {func.nome
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="font-medium">{func.nome}</div>
                      <div className="text-sm text-muted-foreground">Mat: {func.matricula}</div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={func.presente ? "default" : "outline"}
                    className={func.presente ? "bg-success hover:bg-success/90" : ""}
                  >
                    {func.presente ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alocação de Atividades */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alocar em Atividades</CardTitle>
            <CardDescription>Arraste ou toque para alocar funcionários</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {atividades.map((ativ) => (
                <div
                  key={ativ.id}
                  className="p-4 rounded-lg border-2 border-dashed hover:border-primary transition-colors cursor-pointer"
                  onClick={() => setSelectedActivity(ativ.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{ativ.icon}</div>
                      <div>
                        <div className="font-semibold">{ativ.nome}</div>
                        <div className="text-sm text-muted-foreground">{ativ.alocados} funcionário(s) alocado(s)</div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>

                  {/* Funcionários alocados nesta atividade */}
                  {funcionarios.filter((f) => f.atividade === ativ.nome.split(" ")[0]).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
                      {funcionarios
                        .filter((f) => f.atividade === ativ.nome.split(" ")[0])
                        .map((f) => (
                          <Badge key={f.id} variant="secondary" className="text-xs">
                            {f.nome.split(" ")[0]}
                          </Badge>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Botão de Confirmação */}
        <div className="fixed bottom-6 left-4 right-4">
          <Button className="w-full" size="lg">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Confirmar Apontamento
          </Button>
        </div>
      </div>
    </div>
  )
}
