"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Search, Edit, Trash2, FileText, Building } from "lucide-react"
import Link from "next/link"
import useContratosApi, { Contrato as ContratoApi } from "@/api/ContratosApi"
import { useObraApi } from "@/api/ObraApi"

interface ContratoUI {
  id: number
  fornecedor: string
  cnpj: string
  tipo: string
  numeroContrato: string
  dataInicio: string
  dataTermino: string
  valorMensal: number
  status: "ativo" | "suspenso" | "encerrado"
}

export default function CadastroContratosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const contratosApi = useContratosApi()
  const obraApi = useObraApi()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    fornecedor: "",
    cnpj: "",
    tipo: "",
    numeroContrato: "",
    dataInicio: "",
    dataTermino: "",
    valorMensal: "",
    objeto: "",
  })

  const [contratos, setContratos] = useState<ContratoUI[]>([])
  const [obras, setObras] = useState<Array<{ id: number; nome: string }>>([])
  const [obraId, setObraId] = useState<number | null>(null)

  const tiposContrato = [
    { value: 'materiais', label: 'Materiais' },
    { value: 'mao_obra', label: 'Mão de Obra' },
    { value: 'equipamentos', label: 'Equipamentos' },
    { value: 'servicos', label: 'Serviços' },
    { value: 'consultoria', label: 'Consultoria' },
    { value: 'locacao', label: 'Locação' },
    { value: 'manutencao', label: 'Manutenção' },
    { value: 'outros', label: 'Outros' },
  ]

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const lista = await contratosApi.listar()
        const mapped: ContratoUI[] = lista.map((c: ContratoApi) => ({
          id: c.id,
          fornecedor: c.fornecedor,
          cnpj: c.cnpj,
          tipo: c.tipo,
          numeroContrato: c.numero_contrato,
          dataInicio: c.data_inicio,
          dataTermino: c.data_fim,
          valorMensal: c.valor_mensal,
          status: c.ativo ? "ativo" : "encerrado",
        }))
        setContratos(mapped)
        const obrasResp = await obraApi.getObras()
        const obrasList = Array.isArray(obrasResp)
          ? obrasResp
          : (obrasResp?.results || obrasResp?.data || [])
        const normalized = obrasList.map((o: any) => ({ id: o.id, nome: o.nome }))
        setObras(normalized)
        if (normalized.length > 0) setObraId(normalized[0].id)
      } catch (err: any) {
        setError(err?.message || "Erro ao carregar contratos")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [contratosApi])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (editingId) {
        const payloadUpdate = {
          fornecedor: formData.fornecedor,
          cnpj: formData.cnpj,
          tipo: formData.tipo as any,
          numero_contrato: formData.numeroContrato,
          valor_mensal: parseFloat(formData.valorMensal),
          data_inicio: formData.dataInicio,
          data_fim: formData.dataTermino,
          obra: obraId ?? undefined,
        }
        const updated = await contratosApi.atualizar(editingId, payloadUpdate as any)
        setContratos((prev) => prev.map((c) => c.id === editingId ? {
          id: updated.id,
          fornecedor: updated.fornecedor,
          cnpj: updated.cnpj,
          tipo: updated.tipo,
          numeroContrato: updated.numero_contrato,
          dataInicio: updated.data_inicio,
          dataTermino: updated.data_fim,
          valorMensal: updated.valor_mensal,
          status: updated.ativo ? "ativo" : "encerrado",
        } : c))
      } else {
        const payloadCreate = {
          fornecedor: formData.fornecedor,
          cnpj: formData.cnpj,
          tipo: formData.tipo as any,
          numero_contrato: formData.numeroContrato,
          valor_mensal: parseFloat(formData.valorMensal),
          data_inicio: formData.dataInicio,
          data_fim: formData.dataTermino,
          obra: obraId as number,
          ativo: true,
        }
        const created = await contratosApi.criar(payloadCreate as any)
        const novo: ContratoUI = {
          id: created.id,
          fornecedor: created.fornecedor,
          cnpj: created.cnpj,
          tipo: created.tipo,
          numeroContrato: created.numero_contrato,
          dataInicio: created.data_inicio,
          dataTermino: created.data_fim,
          valorMensal: created.valor_mensal,
          status: created.ativo ? "ativo" : "encerrado",
        }
        setContratos((prev) => [novo, ...prev])
      }
      setFormData({
        fornecedor: "",
        cnpj: "",
        tipo: "",
        numeroContrato: "",
        dataInicio: "",
        dataTermino: "",
        valorMensal: "",
        objeto: "",
      })
      setEditingId(null)
      setShowForm(false)
    } catch (err: any) {
      setError(err?.message || "Erro ao cadastrar contrato")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: ContratoUI["status"]) => {
    const variants = {
      ativo: { label: "Ativo", className: "bg-success/10 text-success border-success/30" },
      suspenso: { label: "Suspenso", className: "bg-warning/10 text-warning border-warning/30" },
      encerrado: { label: "Encerrado", className: "bg-muted text-muted-foreground" },
    }
    return <Badge variant="outline" className={variants[status].className}>{variants[status].label}</Badge>
  }

  const filteredContratos = contratos.filter(c =>
    c.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.numeroContrato.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      await contratosApi.deletar(id)
      setContratos((prev) => prev.filter((c) => c.id !== id))
    } catch (err: any) {
      setError(err?.message || "Erro ao excluir contrato")
    } finally {
      setLoading(false)
    }
  }

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
              <h1 className="text-xl font-bold">Cadastro de Contratos</h1>
              <p className="text-sm opacity-90">Fornecedores e terceirizados</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 text-sm text-destructive">{error}</div>
        )}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por fornecedor ou número do contrato..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-secondary hover:bg-secondary/90">
            <Plus className="h-4 w-4 mr-2" />
            Novo Contrato
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Novo Contrato</CardTitle>
              <CardDescription>Cadastrar fornecedor/terceirizado</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Fornecedor/Empresa *</label>
                    <Input
                      placeholder="Ex: Locadora ABC Ltda"
                      value={formData.fornecedor}
                      onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">CNPJ *</label>
                    <Input
                      placeholder="00.000.000/0000-00"
                      value={formData.cnpj}
                      onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo de Contrato *</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={formData.tipo}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                      required
                    >
                      <option value="">Selecione...</option>
                      {tiposContrato.map((tipo) => (
                        <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Número do Contrato *</label>
                    <Input
                      placeholder="Ex: CONT-2024-001"
                      value={formData.numeroContrato}
                      onChange={(e) => setFormData({ ...formData, numeroContrato: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Obra *</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={obraId ?? ''}
                      onChange={(e) => setObraId(Number(e.target.value))}
                      required
                    >
                      <option value="">Selecione...</option>
                      {obras.map((o) => (
                        <option key={o.id} value={o.id}>{o.nome}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data Início *</label>
                    <Input
                      type="date"
                      value={formData.dataInicio}
                      onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data Término *</label>
                    <Input
                      type="date"
                      value={formData.dataTermino}
                      onChange={(e) => setFormData({ ...formData, dataTermino: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Valor Mensal (R$) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={formData.valorMensal}
                      onChange={(e) => setFormData({ ...formData, valorMensal: e.target.value })}
                      required
                    />
                  </div>
                </div>

          

                <div className="space-y-2">
                  <label className="text-sm font-medium">Objeto do Contrato</label>
                  <textarea
                    className="w-full min-h-20 p-3 rounded-md border border-input bg-background"
                    placeholder="Descrição detalhada do objeto..."
                    value={formData.objeto}
                    onChange={(e) => setFormData({ ...formData, objeto: e.target.value })}
                  />
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

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Contratos Cadastrados ({filteredContratos.length})</h2>

          {filteredContratos.map((contrato) => (
            <Card key={contrato.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Building className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">{contrato.fornecedor}</h3>
                      {getStatusBadge(contrato.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">CNPJ: {contrato.cnpj}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingId(contrato.id)
                        setFormData({
                          fornecedor: contrato.fornecedor,
                          cnpj: contrato.cnpj,
                          tipo: contrato.tipo,
                          numeroContrato: contrato.numeroContrato,
                          dataInicio: contrato.dataInicio,
                          dataTermino: contrato.dataTermino,
                          valorMensal: String(contrato.valorMensal),
                          objeto: "",
                        })
                        setShowForm(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(contrato.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Tipo</p>
                    <p className="font-medium">{contrato.tipo}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">N° Contrato</p>
                    <p className="font-medium">{contrato.numeroContrato}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Vigência</p>
                    <p className="font-medium">
                      {new Date(contrato.dataInicio).toLocaleDateString("pt-BR")} - {new Date(contrato.dataTermino).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Valor Mensal</p>
                    <p className="font-medium text-primary">
                      R$ {contrato.valorMensal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
