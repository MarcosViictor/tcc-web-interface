"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Search, Edit, Trash2, Calculator, AlertCircle } from "lucide-react"
import Link from "next/link"
import useCriteriosMedicaoApi, { CriterioMedicao } from "@/api/CriteriosMedicaoApi"
import { useObraApi } from "@/api/ObraApi"
import { useAuth } from "@/contexts/AuthContext"

interface CriterioUI {
  id: number
  nome: string
  tipo: "desconto" | "acrescimo" | "regra"
  percentual?: number
  condicao: string
  aplicacao: string
  ativo: boolean
  obra: number
}

export default function CriteriosMedicaoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const criteriosApi = useCriteriosMedicaoApi()
  const obraApi = useObraApi()
  const { tokens } = useAuth()
  
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "desconto",
    percentual: "",
    condicao: "",
    aplicacao: "",
    descricao: "",
  })

  const [criterios, setCriterios] = useState<CriterioUI[]>([])
  const [obras, setObras] = useState<Array<{ id: number; nome: string }>>([])
  const [obraId, setObraId] = useState<number | null>(null)

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        if (!tokens?.access) {
          setError('Faça login para visualizar e gerenciar critérios.')
          return
        }
        // Listar critérios
        const lista = await criteriosApi.listar()
        const mapped: CriterioUI[] = lista.map((c: CriterioMedicao) => ({
          id: c.id,
          nome: c.nome,
          tipo: (c.tipo as any) ?? 'desconto',
          percentual: c.percentual,
          condicao: c.condicao || '',
          aplicacao: c.aplicacao || '',
          ativo: !!c.ativo,
          obra: c.obra,
        }))
        if (!isMounted) return
        setCriterios(mapped)
        // Listar obras para o select
        const obrasResp = await obraApi.getObras()
        const obrasList = Array.isArray(obrasResp) ? obrasResp : (obrasResp?.results || obrasResp?.data || [])
        const normalized = obrasList.map((o: any) => ({ id: o.id, nome: o.nome }))
        if (!isMounted) return
        setObras(normalized)
        if (normalized.length > 0) setObraId(normalized[0].id)
      } catch (err: any) {
        setError(err?.message || 'Erro ao carregar critérios/obras')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => { isMounted = false }
  }, [tokens?.access])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!obraId) {
      setError('Selecione uma obra')
      return
    }
    setLoading(true)
    setError(null)
    try {
      if (editingId) {
        const atual = criterios.find(c => c.id === editingId)
        const payload = {
          nome: formData.nome,
          tipo: formData.tipo as any,
          percentual: formData.percentual ? parseFloat(formData.percentual) : undefined,
          condicao: formData.condicao,
          aplicacao: formData.aplicacao,
          obra: obraId,
          ativo: atual?.ativo ?? true,
        }
        const updated = await criteriosApi.atualizar(editingId, payload)
        setCriterios(prev => prev.map(c => c.id === editingId ? {
          id: updated.id,
          nome: updated.nome,
          tipo: updated.tipo as any,
          percentual: updated.percentual,
          condicao: updated.condicao || '',
          aplicacao: updated.aplicacao || '',
          ativo: !!updated.ativo,
          obra: updated.obra,
        } : c))
      } else {
        const payload = {
          nome: formData.nome,
          tipo: formData.tipo as any,
          percentual: formData.percentual ? parseFloat(formData.percentual) : undefined,
          condicao: formData.condicao,
          aplicacao: formData.aplicacao,
          obra: obraId,
          ativo: true,
        }
        const created = await criteriosApi.criar(payload)
        const novo: CriterioUI = {
          id: created.id,
          nome: created.nome,
          tipo: created.tipo as any,
          percentual: created.percentual,
          condicao: created.condicao || '',
          aplicacao: created.aplicacao || '',
          ativo: !!created.ativo,
          obra: created.obra,
        }
        setCriterios(prev => [novo, ...prev])
      }
      setFormData({
        nome: "",
        tipo: "desconto",
        percentual: "",
        condicao: "",
        aplicacao: "",
        descricao: "",
      })
      setEditingId(null)
      setShowForm(false)
    } catch (err: any) {
      setError(err?.message || 'Erro ao salvar critério')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      await criteriosApi.deletar(id)
      setCriterios(prev => prev.filter(c => c.id !== id))
    } catch (err: any) {
      setError(err?.message || 'Erro ao remover critério')
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (id: number) => {
    const atual = criterios.find(c => c.id === id)
    if (!atual) return
    setLoading(true)
    setError(null)
    try {
      // Alguns backends exigem PUT com todos os campos obrigatórios
      const payload = {
        nome: atual.nome,
        tipo: atual.tipo as any,
        percentual: atual.percentual,
        condicao: atual.condicao,
        aplicacao: atual.aplicacao,
        obra: atual.obra,
        ativo: !atual.ativo,
      }
      const updated = await criteriosApi.atualizar(id, payload)
      setCriterios(prev => prev.map(c => c.id === id ? {
        ...c,
        ativo: !!updated.ativo,
      } : c))
    } catch (err: any) {
      setError(err?.message || 'Erro ao alterar status')
    } finally {
      setLoading(false)
    }
  }

  const getTipoBadge = (tipo: CriterioUI["tipo"]) => {
    const variants = {
      desconto: { label: "Desconto", className: "bg-destructive/10 text-destructive border-destructive/30" },
      acrescimo: { label: "Acréscimo", className: "bg-success/10 text-success border-success/30" },
      regra: { label: "Regra", className: "bg-primary/10 text-primary border-primary/30" },
    }
    return <Badge variant="outline" className={variants[tipo].className}>{variants[tipo].label}</Badge>
  }

  const filteredCriterios = criterios.filter(c =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.condicao.toLowerCase().includes(searchTerm.toLowerCase())
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
              <h1 className="text-xl font-bold">Critérios de Medição</h1>
              <p className="text-sm opacity-90">Configurar descontos e regras</p>
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
              placeholder="Buscar por nome ou condição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-secondary hover:bg-secondary/90" disabled={!tokens?.access}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Critério
          </Button>
        </div>

        {/* Info Box */}
        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Sobre os Critérios de Medição:</p>
                <p className="text-muted-foreground">
                  Os critérios configurados aqui serão aplicados automaticamente nas medições mensais.
                  Descontos reduzem o valor a ser pago, enquanto acréscimos aumentam conforme regras estabelecidas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {showForm && tokens?.access && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Novo Critério</CardTitle>
              <CardDescription>Configurar desconto, acréscimo ou regra</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome do Critério *</label>
                    <Input
                      placeholder="Ex: Desconto por Atraso"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo *</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={formData.tipo}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                      required
                    >
                      <option value="desconto">Desconto</option>
                      <option value="acrescimo">Acréscimo</option>
                      <option value="regra">Regra Personalizada</option>
                    </select>
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
                      {obras.map(o => (
                        <option key={o.id} value={o.id}>{o.nome}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Percentual (%) *</label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Ex: 5.0"
                      value={formData.percentual}
                      onChange={(e) => setFormData({ ...formData, percentual: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Aplicação *</label>
                    <Input
                      placeholder="Ex: Contratos de Locação"
                      value={formData.aplicacao}
                      onChange={(e) => setFormData({ ...formData, aplicacao: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Condição para Aplicação *</label>
                  <Input
                    placeholder="Ex: Atraso > 5 dias"
                    value={formData.condicao}
                    onChange={(e) => setFormData({ ...formData, condicao: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição Detalhada</label>
                  <textarea
                    className="w-full min-h-20 p-3 rounded-md border border-input bg-background"
                    placeholder="Descreva quando e como este critério deve ser aplicado..."
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-secondary hover:bg-secondary/90" disabled={loading}>
                    Cadastrar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Critérios Cadastrados ({filteredCriterios.length})
          </h2>

          {filteredCriterios.map((criterio) => (
            <Card key={criterio.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Calculator className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">{criterio.nome}</h3>
                      {getTipoBadge(criterio.tipo)}
                      {criterio.ativo ? (
                        <Badge className="bg-success text-success-foreground">Ativo</Badge>
                      ) : (
                        <Badge variant="outline">Inativo</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStatus(criterio.id)}
                    >
                      {criterio.ativo ? "Desativar" : "Ativar"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingId(criterio.id)
                        setFormData({
                          nome: criterio.nome,
                          tipo: criterio.tipo,
                          percentual: criterio.percentual != null ? String(criterio.percentual) : "",
                          condicao: criterio.condicao,
                          aplicacao: criterio.aplicacao,
                          descricao: "",
                        })
                        setObraId(criterio.obra)
                        setShowForm(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(criterio.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Percentual</p>
                    <p className="font-semibold text-lg text-primary">
                      {criterio.tipo === "desconto" ? "-" : "+"}{criterio.percentual}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Condição</p>
                    <p className="font-medium">{criterio.condicao}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Aplicação</p>
                    <p className="font-medium">{criterio.aplicacao}</p>
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
