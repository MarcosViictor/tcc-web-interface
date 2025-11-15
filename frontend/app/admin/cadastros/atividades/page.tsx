"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Search, Edit, Trash2, Clipboard } from "lucide-react"
import Link from "next/link"

interface Atividade {
  id: string
  codigo: string
  descricao: string
  unidade: string
  categoria: string
  precoUnitario: number
}

export default function CadastroAtividadesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  
  const [formData, setFormData] = useState({
    codigo: "",
    descricao: "",
    unidade: "",
    categoria: "",
    precoUnitario: "",
  })

  const [atividades, setAtividades] = useState<Atividade[]>([
    {
      id: "1",
      codigo: "001.001",
      descricao: "Escavação de Vala",
      unidade: "m³",
      categoria: "Terraplenagem",
      precoUnitario: 45.50,
    },
    {
      id: "2",
      codigo: "001.002",
      descricao: "Compactação de Aterro",
      unidade: "m³",
      categoria: "Terraplenagem",
      precoUnitario: 32.00,
    },
    {
      id: "3",
      codigo: "002.001",
      descricao: "Transporte de Material (DMT < 5km)",
      unidade: "m³.km",
      categoria: "Transporte",
      precoUnitario: 8.75,
    },
    {
      id: "4",
      codigo: "003.001",
      descricao: "Aplicação de Revestimento Asfáltico",
      unidade: "m²",
      categoria: "Pavimentação",
      precoUnitario: 125.00,
    },
  ])

  const categorias = [
    "Terraplenagem",
    "Transporte",
    "Pavimentação",
    "Drenagem",
    "Obras de Arte",
    "Sinalização",
    "Obras Complementares",
    "Meio Ambiente",
  ]

  const unidades = ["m³", "m²", "m", "m³.km", "un", "kg", "t", "h"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const novaAtividade: Atividade = {
      id: Date.now().toString(),
      codigo: formData.codigo,
      descricao: formData.descricao,
      unidade: formData.unidade,
      categoria: formData.categoria,
      precoUnitario: parseFloat(formData.precoUnitario),
    }
    setAtividades([...atividades, novaAtividade])
    setFormData({
      codigo: "",
      descricao: "",
      unidade: "",
      categoria: "",
      precoUnitario: "",
    })
    setShowForm(false)
  }

  const filteredAtividades = atividades.filter(a =>
    a.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.codigo.includes(searchTerm) ||
    a.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const atividadesPorCategoria = filteredAtividades.reduce((acc, ativ) => {
    if (!acc[ativ.categoria]) acc[ativ.categoria] = []
    acc[ativ.categoria].push(ativ)
    return acc
  }, {} as Record<string, Atividade[]>)

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-secondary text-secondary-foreground sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm" className="text-secondary-foreground">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Cadastro de Atividades</h1>
              <p className="text-sm opacity-90">Serviços e itens de medição</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por código, descrição ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-secondary hover:bg-secondary/90">
            <Plus className="h-4 w-4 mr-2" />
            Nova Atividade
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Nova Atividade</CardTitle>
              <CardDescription>Cadastrar serviço ou item de medição</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Código *</label>
                    <Input
                      placeholder="Ex: 001.001"
                      value={formData.codigo}
                      onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Descrição *</label>
                    <Input
                      placeholder="Ex: Escavação de Vala"
                      value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Unidade *</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={formData.unidade}
                      onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                      required
                    >
                      <option value="">Selecione...</option>
                      {unidades.map((un) => (
                        <option key={un} value={un}>{un}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Categoria *</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      required
                    >
                      <option value="">Selecione...</option>
                      {categorias.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Preço Unitário (R$)</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={formData.precoUnitario}
                      onChange={(e) => setFormData({ ...formData, precoUnitario: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-secondary hover:bg-secondary/90">
                    Cadastrar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          <h2 className="text-lg font-semibold">
            Atividades Cadastradas ({filteredAtividades.length})
          </h2>

          {Object.entries(atividadesPorCategoria).map(([categoria, ativs]) => (
            <div key={categoria}>
              <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
                <Clipboard className="h-4 w-4" />
                {categoria}
                <Badge variant="secondary">{ativs.length}</Badge>
              </h3>

              <div className="grid grid-cols-1 gap-2">
                {ativs.map((ativ) => (
                  <Card key={ativ.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <Badge variant="outline" className="font-mono text-xs">
                            {ativ.codigo}
                          </Badge>
                          <div className="flex-1">
                            <p className="font-medium">{ativ.descricao}</p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Unidade: <span className="font-medium">{ativ.unidade}</span>
                          </div>
                          {ativ.precoUnitario > 0 && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">Preço: </span>
                              <span className="font-medium text-primary">
                                R$ {ativ.precoUnitario.toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
