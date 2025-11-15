"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Search, Edit, Trash2, Truck, Wrench, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useEquipamentosApi } from "@/api/EquipamentosApi"
import { useAuth } from "@/contexts/AuthContext"

interface EquipamentoUI {
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
  const [editingEquip, setEditingEquip] = useState<EquipamentoUI | null>(null)
  const { getEquipamentos, createEquipamento, updateEquipamento, deleteEquipamento } = useEquipamentosApi()
  const { isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
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

  const [equipamentos, setEquipamentos] = useState<EquipamentoUI[]>([])

  // Mapping helpers
  function fromApi(e: any): EquipamentoUI {
    return {
      id: String(e.id),
      nome: e.nome || '',
      tipo: e.tipo || '',
      modelo: e.modelo || '',
      placa: e.placa || '',
      fabricante: e.fabricante || '',
      anoFabricacao: e.ano ? String(e.ano) : '',
      horimetroAtual: e.horimetro_atual || 0,
      status: (e.status || 'ativo'),
      ultimaManutencao: e.updated_at || e.created_at || new Date().toISOString(),
    }
  }

  function toApi(payload: typeof formData, existing?: EquipamentoUI) {
    return {
      nome: payload.nome,
      tipo: payload.tipo,
      modelo: payload.modelo,
      placa: payload.placa,
      fabricante: payload.fabricante,
      ano: payload.anoFabricacao ? parseInt(payload.anoFabricacao, 10) : undefined,
      horimetro_atual: payload.horimetroInicial ? parseFloat(payload.horimetroInicial) : undefined,
      status: existing?.status || 'ativo',
      obra: 1, // TODO: selecionar obra real
    }
  }

  async function fetchEquipamentos() {
    if (!isAuthenticated) return
    setLoading(true)
    setError(null)
    try {
      const data = await getEquipamentos()
      const list = Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : []
      setEquipamentos(list.map(fromApi))
    } catch (err: any) {
      console.error('Erro ao carregar equipamentos:', err)
      setError('Falha ao carregar equipamentos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEquipamentos() }, [isAuthenticated])

  const tiposEquipamento = [
   `caminhao`, `escavadeira`, `rolo_compactador`, `motoniveladora`, `retroescavadeira`, `trator`, `carregadeira`, `patrol`
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingEquip) {
      try {
        const payload = toApi(formData, editingEquip)
        const updated = await updateEquipamento(Number(editingEquip.id), payload)
        const mapped = fromApi(updated)
        setEquipamentos(equipamentos.map(e => e.id === editingEquip.id ? mapped : e))
      } catch (err) {
        console.error('Erro ao atualizar equipamento:', err)
        alert('Falha ao atualizar equipamento.')
        return
      }
    } else {
      try {
        const payload = toApi(formData)
        const created = await createEquipamento(payload)
        const mapped = fromApi(created)
        setEquipamentos([mapped, ...equipamentos])
      } catch (err) {
        console.error('Erro ao criar equipamento:', err)
        alert('Falha ao criar equipamento.')
        return
      }
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

  const handleEdit = (equip: EquipamentoUI) => {
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

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este equipamento?")) return
    try {
      await deleteEquipamento(Number(id))
      setEquipamentos(equipamentos.filter(e => e.id !== id))
    } catch (err) {
      console.error('Erro ao excluir equipamento:', err)
      alert('Falha ao excluir equipamento.')
    }
  }

  const getStatusBadge = (status: EquipamentoUI["status"]) => {
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
              Equipamentos Cadastrados ({filteredEquipamentos.length}) {loading && <span className="text-xs">(carregando...)</span>}
            </h2>
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}

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
                        <span className="font-medium">{equip.horimetroAtual}h</span>
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
