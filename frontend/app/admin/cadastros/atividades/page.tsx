"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Search, Edit, Trash2, Clipboard } from "lucide-react"
import Link from "next/link"
import { useAtividadesApi } from "@/api/AtividadesApi"
import { useAuth } from "@/contexts/AuthContext"

interface AtividadeUI {
  id: string
  codigo: string
  descricao: string
  unidade: string
  categoria: string
  precoUnitario: number
  ativa: boolean
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
    ativa: true,
  })

  const { getAtividades, createAtividade, updateAtividade, deleteAtividade } = useAtividadesApi()
  const { isAuthenticated } = useAuth()
  const [atividades, setAtividades] = useState<AtividadeUI[]>([])
  const [editing, setEditing] = useState<AtividadeUI | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categorias, setCategorias] = useState<Array<{id:number; nome:string; descricao?:string}>>([])
  const [creatingCategoria, setCreatingCategoria] = useState(false)
  const [novaCategoria, setNovaCategoria] = useState({ nome: "", descricao: "" })

  function fromApi(a: any): AtividadeUI {
    return {
      id: String(a.id),
      codigo: a.codigo,
      descricao: a.descricao,
      unidade: a.unidade,
      categoria: a.categoria_nome || a.categoria?.nome || a.categoria || '',
      precoUnitario: a.preco_unitario ? Number(a.preco_unitario) : 0,
      ativa: a.ativa !== undefined ? a.ativa : true,
    }
  }

  function toApi(payload: typeof formData) {
    return {
      codigo: payload.codigo,
      descricao: payload.descricao,
      unidade: payload.unidade,
      preco_unitario: payload.precoUnitario ? parseFloat(payload.precoUnitario) : 0,
      categoria: payload.categoria ? parseInt(payload.categoria, 10) : undefined,
      obra: 1,
      ativa: payload.ativa,
    }
  }

  async function fetchAtividades() {
    if (!isAuthenticated) return
    setLoading(true); setError(null)
    try {
      const data = await getAtividades()
      const list = Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : []
      setAtividades(list.map(fromApi))
    } catch (err) {
      console.error('Erro ao carregar atividades', err)
      setError('Falha ao carregar atividades')
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchAtividades() }, [isAuthenticated])

  const { getCategoriasAtividades, createCategoriaAtividade } = useAtividadesApi()
  async function fetchCategorias() {
    if (!isAuthenticated) return
    try {
      const data = await getCategoriasAtividades()
      const list = Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : []
      setCategorias(list)
    } catch (err) {
      console.error('Erro ao carregar categorias', err)
    }
  }
  useEffect(() => { fetchCategorias() }, [isAuthenticated])

  const unidades = ["m", "m2", "m3", "kg", "t", "un", "h", "dia"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      try {
        const payload = toApi(formData)
        const updated = await updateAtividade(Number(editing.id), payload)
        const mapped = fromApi(updated)
        setAtividades(atividades.map(a => a.id === editing.id ? mapped : a))
        setEditing(null)
      } catch (err) {
        console.error('Erro ao atualizar atividade', err)
        alert('Falha ao atualizar atividade')
        return
      }
    } else {
      try {
        const payload = toApi(formData)
        const created = await createAtividade(payload)
        const mapped = fromApi(created)
        setAtividades([mapped, ...atividades])
      } catch (err) {
        console.error('Erro ao criar atividade', err)
        alert('Falha ao criar atividade')
        return
      }
    }
    setFormData({ codigo: "", descricao: "", unidade: "", categoria: "", precoUnitario: "", ativa: true })
    setShowForm(false)
  }

  const handleEdit = (a: AtividadeUI) => {
    setEditing(a)
    setFormData({
      codigo: a.codigo,
      descricao: a.descricao,
      unidade: a.unidade,
      categoria: a.categoria,
      precoUnitario: String(a.precoUnitario),
      ativa: a.ativa,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir atividade?')) return
    try {
      await deleteAtividade(Number(id))
      setAtividades(atividades.filter(a => a.id !== id))
    } catch (err) {
      console.error('Erro ao excluir atividade', err)
      alert('Falha ao excluir atividade')
    }
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
  }, {} as Record<string, AtividadeUI[]>)

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
            {editing ? 'Editar Atividade' : 'Nova Atividade'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editing ? 'Editar Atividade' : 'Nova Atividade'}</CardTitle>
              <CardDescription>{editing ? 'Atualize os dados da atividade' : 'Cadastrar serviço ou item de medição'}</CardDescription>
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
                      onChange={(e) => {
                        const val = e.target.value
                        if (val === "__new__") {
                          setCreatingCategoria(true)
                        
                          setFormData({ ...formData, categoria: "" })
                        } else {
                          setCreatingCategoria(false)
                          setFormData({ ...formData, categoria: val })
                        }
                      }}
                      required
                    >
                      <option value="">Selecione...</option>
                      {categorias.map((cat) => (
                        <option key={cat.id} value={String(cat.id)}>{cat.nome}</option>
                      ))}
                      <option value="__new__">+ Criar nova categoria…</option>
                    </select>

                    {creatingCategoria && (
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                        <Input
                          placeholder="Nome da categoria"
                          value={novaCategoria.nome}
                          onChange={(e) => setNovaCategoria({ ...novaCategoria, nome: e.target.value })}
                        />
                        <Input
                          placeholder="Descrição (opcional)"
                          value={novaCategoria.descricao}
                          onChange={(e) => setNovaCategoria({ ...novaCategoria, descricao: e.target.value })}
                        />
                        <Button
                          type="button"
                          className="bg-secondary hover:bg-secondary/90"
                          onClick={async () => {
                            if (!novaCategoria.nome.trim()) {
                              alert('Informe um nome para a categoria')
                              return
                            }
                            try {
                              const created = await createCategoriaAtividade(novaCategoria.nome.trim(), novaCategoria.descricao || undefined)
                              // Atualiza lista e seleciona a nova
                              const novoItem = { id: created.id, nome: created.nome, descricao: created.descricao }
                              setCategorias([novoItem, ...categorias])
                              setFormData({ ...formData, categoria: String(created.id) })
                              setNovaCategoria({ nome: "", descricao: "" })
                              setCreatingCategoria(false)
                            } catch (err) {
                              console.error('Erro ao criar categoria', err)
                              alert('Falha ao criar categoria')
                            }
                          }}
                        >
                          Criar
                        </Button>
                      </div>
                    )}
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
                    {editing ? 'Salvar' : 'Cadastrar'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          <h2 className="text-lg font-semibold">
            Atividades Cadastradas ({filteredAtividades.length}) {loading && <span className="text-xs">(carregando...)</span>}
          </h2>
          {error && <p className="text-destructive text-sm">{error}</p>}

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
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(ativ)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(ativ.id)}>
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
