"use client"

import { use, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Search, Edit, Trash2, MapPin, Calendar, Building2 } from "lucide-react"
import Link from "next/link"

import { useObraApi } from "@/api/ObraApi"
import { useAuth } from "@/contexts/AuthContext"
import { Obra as ApiObra } from "@/lib/types/ObraTypes"

interface Obra {
  id: string
  nome: string
  codigo: string
  local: string
  dataInicio: string
  dataPrevisaoTermino: string
  status: string
  responsavel: string
}

export default function CadastroObrasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingObra, setEditingObra] = useState<Obra | null>(null)
  const { getObras, createObra, updateObra, deleteObra } = useObraApi();
  const { isAuthenticated } = useAuth();
  const [obras, setObras] = useState<Obra[]>([])

  
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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingObra) {
      try {
        const payload: Partial<ApiObra> = {
          codigo: formData.codigo,
          nome: formData.nome,
          local: formData.local,
          km_inicial: formData.kmInicial ? parseFloat(formData.kmInicial) : 0,
          km_final: formData.kmFinal ? parseFloat(formData.kmFinal) : 0,
          data_inicio: formData.dataInicio,
          data_prevista_fim: formData.dataPrevisaoTermino,
          status: toApiStatus(editingObra.status || 'em_andamento'),
          // responsavel pode ser id ou null; manter como undefined para não alterar
        }

        const updated = await updateObra(Number(editingObra.id), payload)

        const mapped: Obra = {
          id: String(updated.id),
          nome: updated.nome,
          codigo: updated.codigo,
          local: updated.local,
          dataInicio: updated.data_inicio,
          dataPrevisaoTermino: updated.data_prevista_fim,
          status: updated.status,
          responsavel: updated.responsavel_nome || '',
        }

        setObras(obras.map(o => (o.id === editingObra.id ? mapped : o)))
      } catch (err) {
        console.error('Erro ao atualizar obra:', err)
        alert('Falha ao atualizar obra. Verifique os campos e tente novamente.')
        return
      }
    } else {
      try {
        const payload: Omit<ApiObra, 'id' | 'status'> & { status?: string } = {
          codigo: formData.codigo,
          nome: formData.nome,
          local: formData.local,
          km_inicial: formData.kmInicial ? parseFloat(formData.kmInicial) : 0,
          km_final: formData.kmFinal ? parseFloat(formData.kmFinal) : 0,
          data_inicio: formData.dataInicio,
          data_prevista_fim: formData.dataPrevisaoTermino,
          responsavel: undefined, // precisa ser id de usuário; manter undefined/null
          numero_contrato: formData.contrato || undefined,
          descricao: formData.descricao || undefined,
        }
        // Envia para API; status padrão é 'planejamento' no backend
        const created = await createObra(payload)
        // Mapeia resposta para interface interna
        const mapped: Obra = {
          id: String(created.id),
          nome: created.nome,
          codigo: created.codigo,
          local: created.local,
          dataInicio: created.data_inicio,
          dataPrevisaoTermino: created.data_prevista_fim,
          status: created.status || 'planejamento',
          responsavel: created.responsavel_nome || '',
        }
        setObras([mapped, ...obras])
      } catch (err) {
        console.error('Erro ao criar obra:', err)
        alert('Falha ao criar obra. Verifique os campos e tente novamente.')
      }
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

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta obra?")) {
      try {
        await deleteObra(Number(id));
        setObras(obras.filter(obra => obra.id !== id));
      } catch (err) {
        console.error('Erro ao excluir obra:', err);
        alert('Falha ao excluir obra. Tente novamente.');
      }
    }
  }

  const getStatusBadge = (status: Obra["status"]) => {
    const variants: Record<string, { label: string; className: string }> = {
      ativa: { label: "Ativa", className: "bg-success/10 text-success border-success/30" },
      pausada: { label: "Pausada", className: "bg-warning/10 text-warning border-warning/30" },
      concluida: { label: "Concluída", className: "bg-muted text-muted-foreground" },
      em_andamento: { label: "Em Andamento", className: "bg-success/10 text-success border-success/30" },
      suspensa: { label: "Suspensa", className: "bg-warning/10 text-warning border-warning/30" },
    }
    const variant = variants[status] || { label: status || "Indefinido", className: "bg-muted text-muted-foreground" }
    return <Badge variant="outline" className={variant.className}>{variant.label}</Badge>
  }

  const filteredObras = obras.filter(obra =>
    obra.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    obra.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    obra.local.toLowerCase().includes(searchTerm.toLowerCase())
  )



  function mapStatus(status: string): string {
    if (status === 'em_andamento') return 'em_andamento';
    if (status === 'suspensa') return 'suspensa';
    return status; // concluida ou já mapeado
  }

  const allowedApiStatuses = new Set(['em_andamento','concluida','suspensa'])
  function toApiStatus(status: string): ApiObra['status'] {
    return (allowedApiStatuses.has(status) ? (status as ApiObra['status']) : 'em_andamento')
  }

  async function fetchObras() {
    try {
      const data = await getObras();
      const mapped = (data.results || []).map((o: any): Obra => ({
        id: String(o.id),
        nome: o.nome || '',
        codigo: o.codigo || '',
        local: o.local || '',
        dataInicio: o.data_inicio || o.dataInicio || '',
        dataPrevisaoTermino: o.data_prevista_fim || o.dataPrevisaoTermino || '',
        status: mapStatus(o.status || 'em_andamento'),
        responsavel: o.responsavel || '',
      }));
      console.log('Obras fetched from API (mapped):', mapped);
      setObras(mapped);
    } catch (error) {
      console.error('Erro ao buscar obras da API:', error);
    }
  }

  // Faz o fetch somente quando o usuário estiver autenticado
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchObras();
  }, [isAuthenticated]);
  

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
                    <label className="text-sm font-medium">Responsável Técnico</label>
                    <Input
                      placeholder="Ex: Eng. João Carlos Silva"
                      value={formData.responsavel}
                      onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                     
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
                    className="w-full min-h-20 p-3 rounded-md border border-input bg-background"
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
                          {obra.dataInicio ? new Date(obra.dataInicio).toLocaleDateString("pt-BR") : "-"} até{" "}
                          {obra.dataPrevisaoTermino ? new Date(obra.dataPrevisaoTermino).toLocaleDateString("pt-BR") : "-"}
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
