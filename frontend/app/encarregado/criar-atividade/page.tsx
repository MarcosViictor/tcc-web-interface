"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Users, Clipboard, MapPin, Calendar, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface AtividadeDiaria {
  id: string
  descricao: string
  funcionarios: string[]
  local: string
  horaInicio: string
  horaFim: string
}

export default function CriarAtividadePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    descricao: "",
    local: "",
    horaInicio: "07:00",
    horaFim: "",
    observacoes: "",
  })

  const [funcionariosSelecionados, setFuncionariosSelecionados] = useState<string[]>([])

  const funcionariosDisponiveis = [
    { matricula: "001234", nome: "José da Silva" },
    { matricula: "001235", nome: "Maria Santos" },
    { matricula: "001236", nome: "Pedro Oliveira" },
    { matricula: "001238", nome: "Carlos Mendes" },
    { matricula: "001239", nome: "Lucia Ferreira" },
  ]

  const atividadesSugeridas = [
    "Escavação de Vala",
    "Compactação de Aterro",
    "Transporte de Material",
    "Nivelamento de Pista",
    "Limpeza de Área",
    "Instalação de Drenagem",
    "Aplicação de Revestimento",
    "Sinalização",
  ]

  const toggleFuncionario = (matricula: string) => {
    if (funcionariosSelecionados.includes(matricula)) {
      setFuncionariosSelecionados(funcionariosSelecionados.filter(m => m !== matricula))
    } else {
      setFuncionariosSelecionados([...funcionariosSelecionados, matricula])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const payload = {
      encarregado: "Pedro Santos",
      data: new Date().toISOString().split('T')[0],
      atividade: formData.descricao,
      funcionarios: funcionariosSelecionados,
      local: formData.local,
      horaInicio: formData.horaInicio,
      horaFim: formData.horaFim,
      observacoes: formData.observacoes,
    }
    
    console.log("Criando atividade:", payload)
    // TODO: Enviar para backend
    
    alert("Atividade criada com sucesso!")
    router.push("/encarregado/equipe")
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-accent text-accent-foreground sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/encarregado/equipe">
              <Button variant="ghost" size="sm" className="text-accent-foreground">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Nova Atividade</h1>
              <p className="text-sm opacity-90">Criar atividade para a equipe</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Descrição da Atividade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clipboard className="h-5 w-5" />
                Descrição da Atividade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Atividade *</label>
                <Input
                  placeholder="Ex: Escavação de Vala"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  required
                />
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Sugestões:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {atividadesSugeridas.map((ativ) => (
                    <Button
                      key={ativ}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData({ ...formData, descricao: ativ })}
                    >
                      {ativ}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selecionar Funcionários */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Equipe Alocada
              </CardTitle>
              <CardDescription>Selecione os funcionários para esta atividade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {funcionariosDisponiveis.map((func) => {
                  const selecionado = funcionariosSelecionados.includes(func.matricula)
                  return (
                    <div
                      key={func.matricula}
                      className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selecionado
                          ? "bg-primary/5 border-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => toggleFuncionario(func.matricula)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold ${
                            selecionado ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          {func.nome.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium">{func.nome}</p>
                          <p className="text-sm text-muted-foreground">Mat. {func.matricula}</p>
                        </div>
                      </div>
                      {selecionado && (
                        <Badge className="bg-primary">Selecionado</Badge>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">
                  {funcionariosSelecionados.length} funcionário(s) selecionado(s)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Local e Horário */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Local e Horário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Local/Estaqueamento *</label>
                <Input
                  placeholder="Ex: km 45+200 a 45+450"
                  value={formData.local}
                  onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hora Início *</label>
                  <Input
                    type="time"
                    value={formData.horaInicio}
                    onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Hora Fim *</label>
                  <Input
                    type="time"
                    value={formData.horaFim}
                    onChange={(e) => setFormData({ ...formData, horaFim: e.target.value })}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full min-h-20 p-3 rounded-md border border-input bg-background"
                placeholder="Informações adicionais sobre a atividade..."
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              />
            </CardContent>
          </Card>

          {/* Botões */}
          <div className="flex gap-3 sticky bottom-4">
            <Link href="/encarregado/equipe" className="flex-1">
              <Button type="button" variant="outline" className="w-full" size="lg">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" className="flex-1 bg-secondary hover:bg-secondary/90" size="lg">
              <Save className="h-4 w-4 mr-2" />
              Criar Atividade
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
