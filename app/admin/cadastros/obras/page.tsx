"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Search, Edit, Trash2, MapPin, Calendar, Building2 } from "lucide-react"
import Link from "next/link"

interface Obra {
  id: string
  nome: string
  codigo: string
  local: string
  dataInicio: string
  dataPrevisaoTermino: string
  status: "ativa" | "pausada" | "concluida"
  responsavel: string
}

export default function CadastroObrasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingObra, setEditingObra] = useState<Obra | null>(null)
  
  const [formData, setFormData] = useState({
    nome: "",
    codigo: "",
    local: "",
    kmInicial: "",
    kmFinal: "",
    dataInicio: "",
    dataPrevisaoTermino: "",
    responsavel: "",
    contrato: "",
    descricao: "",
  })

  const [obras, setObras] = useState<Obra[]>([
    {
      id: "1",
      nome: "Rodovia BR-116 - Trecho Cariri",
      codigo: "BR116-CARIRI-2024",
      local: "CE - Juazeiro do Norte a Barbalha",
      dataInicio: "2024-01-15",
      dataPrevisaoTermino: "2025-12-31",
      status: "ativa",
      responsavel: "Eng. João Carlos Silva",
    },
    {
      id: "2",
      nome: "Duplicação BR-230 - Trecho Paraíba",
      codigo: "BR230-PB-2023",
      local: "PB - João Pessoa a Campina Grande",
      dataInicio: "2023-06-01",
      dataPrevisaoTermino: "2025-06-30",
      status: "ativa",
      responsavel: "Eng. Maria Oliveira",
    },
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingObra) {
      // Editar obra existente
      setObras(obras.map(obra => 
        obra.id === editingObra.id 
          ? { 
              ...obra, 
              nome: formData.nome,
              codigo: formData.codigo,
              local: formData.local,
              dataInicio: formData.dataInicio,
              dataPrevisaoTermino: formData.dataPrevisaoTermino,
              responsavel: formData.responsavel,
            }
          : obra
      ))
    } else {
      // Criar nova obra
      const novaObra: Obra = {
        id: Date.now().toString(),
        nome: formData.nome,
        codigo: formData.codigo,
        local: formData.local,
        dataInicio: formData.dataInicio,
        dataPrevisaoTermino: formData.dataPrevisaoTermino,
        status: "ativa",
        responsavel: formData.responsavel,
      }
      setObras([...obras, novaObra])
    }
    
    // Reset form
    setFormData({
      nome: "",
      codigo: "",
      local: "",
      kmInicial: "",
      kmFinal: "",
      dataInicio: "",
      dataPrevisaoTermino: "",
      responsavel: "",
      contrato: "",
      descricao: "",
    })
    setShowForm(false)
    setEditingObra(null)
  }

  const handleEdit = (obra: Obra) => {
    setEditingObra(obra)
    setFormData({
      nome: obra.nome,
      codigo: obra.codigo,
      local: obra.local,
      kmInicial: "",
      kmFinal: "",
      dataInicio: obra.dataInicio,
      dataPrevisaoTermino: obra.dataPrevisaoTermino,
      responsavel: obra.responsavel,
      contrato: "",
      descricao: "",
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta obra?")) {
      setObras(obras.filter(obra => obra.id !== id))
    }
  }

  const getStatusBadge = (status: Obra["status"]) => {
    const variants = {
      ativa: { label: "Ativa", className: "bg-success/10 text-success border-success/30" },
      pausada: { label: "Pausada", className: "bg-warning/10 text-warning border-warning/30" },
      concluida: { label: "Concluída", className: "bg-muted text-muted-foreground" },
    }
    const variant = variants[status]
    return <Badge variant="outline" className={variant.className}>{variant.label}</Badge>
  }

  const filteredObras = obras.filter(obra =>
    obra.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    obra.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    obra.local.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-secondary text-secondary-foreground sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm" className="text-secondary-foreground">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Cadastro de Obras</h1>
              <p className="text-sm opacity-90">Gerenciar obras e projetos</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Barra de Ações */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, código ou local..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-secondary hover:bg-secondary/90">
            <Plus className="h-4 w-4 mr-2" />
            Nova Obra
          </Button>
        </div>

        {/* Formulário */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingObra ? "Editar Obra" : "Nova Obra"}</CardTitle>
              <CardDescription>Preencha as informações da obra</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome da Obra *</label>
                    <Input
                      placeholder="Ex: Rodovia BR-116 - Trecho Cariri"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Código da Obra *</label>
                    <Input
                      placeholder="Ex: BR116-CARIRI-2024"
                      value={formData.codigo}
                      onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Localização *</label>
                  <Input
                    placeholder="Ex: CE - Juazeiro do Norte a Barbalha"
                    value={formData.local}
                    onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">KM Inicial</label>
                    <Input
                      placeholder="Ex: 450+000"
                      value={formData.kmInicial}
                      onChange={(e) => setFormData({ ...formData, kmInicial: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">KM Final</label>
                    <Input
                      placeholder="Ex: 485+000"
                      value={formData.kmFinal}
                      onChange={(e) => setFormData({ ...formData, kmFinal: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data de Início *</label>
                    <Input
                      type="date"
                      value={formData.dataInicio}
                      onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Previsão de Término *</label>
                    <Input
                      type="date"
                      value={formData.dataPrevisaoTermino}
                      onChange={(e) => setFormData({ ...formData, dataPrevisaoTermino: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Responsável Técnico *</label>
                    <Input
                      placeholder="Ex: Eng. João Carlos Silva"
                      value={formData.responsavel}
                      onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Número do Contrato</label>
                    <Input
                      placeholder="Ex: DNIT-2024-001"
                      value={formData.contrato}
                      onChange={(e) => setFormData({ ...formData, contrato: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição</label>
                  <textarea
                    className="w-full min-h-[80px] p-3 rounded-md border border-input bg-background"
                    placeholder="Descrição detalhada do escopo da obra..."
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setEditingObra(null)
                      setFormData({
                        nome: "",
                        codigo: "",
                        local: "",
                        kmInicial: "",
                        kmFinal: "",
                        dataInicio: "",
                        dataPrevisaoTermino: "",
                        responsavel: "",
                        contrato: "",
                        descricao: "",
                      })
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-secondary hover:bg-secondary/90">
                    {editingObra ? "Atualizar" : "Cadastrar"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de Obras */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Obras Cadastradas ({filteredObras.length})
            </h2>
          </div>

          {filteredObras.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? "Nenhuma obra encontrada" : "Nenhuma obra cadastrada"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredObras.map((obra) => (
              <Card key={obra.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{obra.nome}</h3>
                        {getStatusBadge(obra.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">Código: {obra.codigo}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(obra)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(obra.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Local</p>
                        <p className="text-sm font-medium">{obra.local}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Período</p>
                        <p className="text-sm font-medium">
                          {new Date(obra.dataInicio).toLocaleDateString("pt-BR")} até{" "}
                          {new Date(obra.dataPrevisaoTermino).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Responsável</p>
                        <p className="text-sm font-medium">{obra.responsavel}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
