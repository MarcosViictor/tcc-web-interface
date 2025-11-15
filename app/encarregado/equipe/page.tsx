"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, UserCheck, UserX, Search, Plus, CheckCircle2, AlertCircle, FileText } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Funcionario {
  id: number
  matricula: string
  nome: string
  presente: boolean
  atividade: string | null
}

export default function EncarregadoEquipe() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([
    { id: 1, matricula: "001234", nome: "José da Silva", presente: true, atividade: null },
    { id: 2, matricula: "001235", nome: "Maria Santos", presente: true, atividade: null },
    { id: 3, matricula: "001236", nome: "Pedro Oliveira", presente: true, atividade: null },
    { id: 4, matricula: "001237", nome: "Ana Costa", presente: false, atividade: null },
    { id: 5, matricula: "001238", nome: "Carlos Mendes", presente: true, atividade: null },
    { id: 6, matricula: "001239", nome: "Lucia Ferreira", presente: true, atividade: null },
  ])

  const togglePresenca = (id: number) => {
    setFuncionarios(funcionarios.map(f => 
      f.id === id ? { ...f, presente: !f.presente } : f
    ))
  }

  const adicionarFuncionario = () => {
    if (!searchTerm) return
    
    // TODO: Buscar funcionário no backend pela matrícula
    const novoFunc: Funcionario = {
      id: Date.now(),
      matricula: searchTerm,
      nome: "Novo Funcionário", // Virá do backend
      presente: false,
      atividade: null,
    }
    
    setFuncionarios([...funcionarios, novoFunc])
    setSearchTerm("")
  }

  const confirmarApontamento = () => {
    // TODO: Enviar dados para o backend
    const payload = {
      encarregado: "Pedro Santos",
      data: new Date().toISOString().split('T')[0],
      funcionarios: funcionarios.map(f => ({
        matricula: f.matricula,
        nome: f.nome,
        presente: f.presente,
      }))
    }
    
    console.log("Confirmando apontamento:", payload)
    alert("Apontamento confirmado com sucesso!")
  }

  const presentes = funcionarios.filter((f) => f.presente).length
  const ausentes = funcionarios.filter((f) => !f.presente).length

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
              <AlertCircle className="h-6 w-6 mx-auto mb-2 text-destructive" />
              <div className="text-2xl font-bold text-destructive">{ausentes}</div>
              <p className="text-xs text-muted-foreground">Ausentes</p>
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
              <Button onClick={adicionarFuncionario}>
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
                    onClick={() => togglePresenca(func.id)}
                  >
                    {func.presente ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Link href="/encarregado/criar-atividade">
            <Button variant="outline" className="w-full" size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Nova Atividade
            </Button>
          </Link>
          <Link href="/encarregado/diario-obra">
            <Button className="w-full bg-accent hover:bg-accent/90" size="lg">
              <FileText className="h-4 w-4 mr-2" />
              Diário de Obra
            </Button>
          </Link>
        </div>

        <div className="sticky bottom-4">
          <Button 
            onClick={confirmarApontamento}
            className="w-full bg-secondary hover:bg-secondary/90" 
            size="lg"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Confirmar Apontamento
          </Button>
        </div>
      </div>
    </div>
  )
}
