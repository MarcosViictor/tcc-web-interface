"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Search, Edit, Trash2, Truck, Wrench, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"

interface Equipamento {
  id: string
  nome: string
  tipo: string
  modelo: string
  placa: string
  fabricante: string
  anoFabricacao: string
  horimetroAtual: number
  status: "ativo" | "manutencao" | "inativo"
  ultimaManutencao: string
}

export default function CadastroEquipamentosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingEquip, setEditingEquip] = useState<Equipamento | null>(null)
  
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "",
    modelo: "",
    placa: "",
    fabricante: "",
    anoFabricacao: "",
    horimetroInicial: "",
    capacidade: "",
    potencia: "",
    combustivel: "Diesel",
  })

  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([
    {
      id: "1",
      nome: "Escavadeira 104.F570",
      tipo: "Escavadeira Hidráulica",
      modelo: "320D",
      placa: "ABC-1234",
      fabricante: "Caterpillar",
      anoFabricacao: "2020",
      horimetroAtual: 2450,
      status: "ativo",
      ultimaManutencao: "2024-11-01",
    },
    {
      id: "2",
      nome: "Caminhão 205.G320",
      tipo: "Caminhão Basculante",
      modelo: "2726",
      placa: "DEF-5678",
      fabricante: "Mercedes-Benz",
      anoFabricacao: "2019",
      horimetroAtual: 5200,
      status: "ativo",
      ultimaManutencao: "2024-10-28",
    },
    {
      id: "3",
      nome: "Motoniveladora 301.H450",
      tipo: "Motoniveladora",
      modelo: "140K",
      placa: "GHI-9012",
      fabricante: "Caterpillar",
      anoFabricacao: "2021",
      horimetroAtual: 1850,
      status: "manutencao",
      ultimaManutencao: "2024-11-10",
    },
  ])

  const tiposEquipamento = [
    "Escavadeira Hidráulica",
    "Caminhão Basculante",
    "Motoniveladora",
    "Pá Carregadeira",
    "Rolo Compactador",
    "Retroescavadeira",
    "Trator de Esteiras",
    "Caminhão Pipa",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingEquip) {
      setEquipamentos(equipamentos.map(equip => 
        equip.id === editingEquip.id 
          ? { 
              ...equip, 
              nome: formData.nome,
              tipo: formData.tipo,
              modelo: formData.modelo,
              placa: formData.placa,
              fabricante: formData.fabricante,
              anoFabricacao: formData.anoFabricacao,
            }
          : equip
      ))
    } else {
      const novoEquip: Equipamento = {
        id: Date.now().toString(),
        nome: formData.nome,
        tipo: formData.tipo,
        modelo: formData.modelo,
        placa: formData.placa,
        fabricante: formData.fabricante,
        anoFabricacao: formData.anoFabricacao,
        horimetroAtual: parseFloat(formData.horimetroInicial) || 0,
        status: "ativo",
        ultimaManutencao: new Date().toISOString().split("T")[0],
      }
      setEquipamentos([...equipamentos, novoEquip])
    }
    
    setFormData({
      nome: "",
      tipo: "",
      modelo: "",
      placa: "",
      fabricante: "",
      anoFabricacao: "",
      horimetroInicial: "",
      capacidade: "",
      potencia: "",
      combustivel: "Diesel",
    })
    setShowForm(false)
    setEditingEquip(null)
  }

  const handleEdit = (equip: Equipamento) => {
    setEditingEquip(equip)
    setFormData({
      nome: equip.nome,
      tipo: equip.tipo,
      modelo: equip.modelo,
      placa: equip.placa,
      fabricante: equip.fabricante,
      anoFabricacao: equip.anoFabricacao,
      horimetroInicial: equip.horimetroAtual.toString(),
      capacidade: "",
      potencia: "",
      combustivel: "Diesel",
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este equipamento?")) {
      setEquipamentos(equipamentos.filter(e => e.id !== id))
    }
  }

  const getStatusBadge = (status: Equipamento["status"]) => {
    const variants = {
      ativo: { 
        label: "Ativo", 
        className: "bg-success/10 text-success border-success/30",
        icon: <CheckCircle2 className="h-3 w-3" />
      },
      manutencao: { 
        label: "Manutenção", 
        className: "bg-warning/10 text-warning border-warning/30",
        icon: <Wrench className="h-3 w-3" />
      },
      inativo: { 
        label: "Inativo", 
        className: "bg-muted text-muted-foreground",
        icon: <AlertCircle className="h-3 w-3" />
      },
    }
    const variant = variants[status]
    return (
      <Badge variant="outline" className={`${variant.className} flex items-center gap-1`}>
        {variant.icon}
        {variant.label}
      </Badge>
    )
  }

  const filteredEquipamentos = equipamentos.filter(equip =>
    equip.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equip.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equip.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equip.fabricante.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              <h1 className="text-xl font-bold">Cadastro de Equipamentos</h1>
              <p className="text-sm opacity-90">Gerenciar frota de equipamentos</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, tipo, placa ou fabricante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-secondary hover:bg-secondary/90">
            <Plus className="h-4 w-4 mr-2" />
            Novo Equipamento
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingEquip ? "Editar Equipamento" : "Novo Equipamento"}</CardTitle>
              <CardDescription>Preencha as informações do equipamento</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Identificação/Nome *</label>
                    <Input
                      placeholder="Ex: Escavadeira 104.F570"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo de Equipamento *</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={formData.tipo}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                      required
                    >
                      <option value="">Selecione...</option>
                      {tiposEquipamento.map((tipo) => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Fabricante *</label>
                    <Input
                      placeholder="Ex: Caterpillar"
                      value={formData.fabricante}
                      onChange={(e) => setFormData({ ...formData, fabricante: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Modelo *</label>
                    <Input
                      placeholder="Ex: 320D"
                      value={formData.modelo}
                      onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ano de Fabricação *</label>
                    <Input
                      type="number"
                      placeholder="Ex: 2020"
                      value={formData.anoFabricacao}
                      onChange={(e) => setFormData({ ...formData, anoFabricacao: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Placa *</label>
                    <Input
                      placeholder="Ex: ABC-1234"
                      value={formData.placa}
                      onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Horímetro Inicial</label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Ex: 2450.0"
                      value={formData.horimetroInicial}
                      onChange={(e) => setFormData({ ...formData, horimetroInicial: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Capacidade</label>
                    <Input
                      placeholder="Ex: 20 toneladas"
                      value={formData.capacidade}
                      onChange={(e) => setFormData({ ...formData, capacidade: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Potência</label>
                    <Input
                      placeholder="Ex: 130 HP"
                      value={formData.potencia}
                      onChange={(e) => setFormData({ ...formData, potencia: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Combustível</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={formData.combustivel}
                      onChange={(e) => setFormData({ ...formData, combustivel: e.target.value })}
                    >
                      <option value="Diesel">Diesel</option>
                      <option value="Gasolina">Gasolina</option>
                      <option value="Elétrico">Elétrico</option>
                      <option value="Híbrido">Híbrido</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setEditingEquip(null)
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-secondary hover:bg-secondary/90">
                    {editingEquip ? "Atualizar" : "Cadastrar"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Equipamentos Cadastrados ({filteredEquipamentos.length})
            </h2>
          </div>

          {filteredEquipamentos.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? "Nenhum equipamento encontrado" : "Nenhum equipamento cadastrado"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEquipamentos.map((equip) => (
                <Card key={equip.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Truck className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold">{equip.nome}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{equip.tipo}</p>
                        {getStatusBadge(equip.status)}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(equip)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(equip.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fabricante:</span>
                        <span className="font-medium">{equip.fabricante} {equip.modelo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Placa:</span>
                        <span className="font-medium">{equip.placa}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ano:</span>
                        <span className="font-medium">{equip.anoFabricacao}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Horímetro:</span>
                        <span className="font-medium">{equip.horimetroAtual.toFixed(1)}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Última Manutenção:</span>
                        <span className="font-medium">
                          {new Date(equip.ultimaManutencao).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
