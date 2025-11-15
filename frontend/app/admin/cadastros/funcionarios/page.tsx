"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Search, Edit, Trash2, Users, Upload, Download, User } from "lucide-react"
import Link from "next/link"

interface Funcionario {
  id: string
  matricula: string
  nome: string
  funcao: string
  cargo: string
  email: string
  telefone: string
  dataAdmissao: string
  status: "ativo" | "ferias" | "afastado" | "desligado"
}

export default function CadastroFuncionariosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingFunc, setEditingFunc] = useState<Funcionario | null>(null)
  
  const [formData, setFormData] = useState({
    matricula: "",
    nome: "",
    cpf: "",
    funcao: "",
    cargo: "",
    email: "",
    telefone: "",
    dataAdmissao: "",
    endereco: "",
    cidade: "",
    estado: "",
  })

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([
    {
      id: "1",
      matricula: "001234",
      nome: "José da Silva",
      funcao: "Servente",
      cargo: "Operacional",
      email: "jose.silva@empresa.com",
      telefone: "(88) 99999-0001",
      dataAdmissao: "2024-01-15",
      status: "ativo",
    },
    {
      id: "2",
      matricula: "001235",
      nome: "Maria Santos",
      funcao: "Pedreiro",
      cargo: "Operacional",
      email: "maria.santos@empresa.com",
      telefone: "(88) 99999-0002",
      dataAdmissao: "2024-02-20",
      status: "ativo",
    },
    {
      id: "3",
      matricula: "001236",
      nome: "Pedro Oliveira",
      funcao: "Operador de Máquinas",
      cargo: "Operacional",
      email: "pedro.oliveira@empresa.com",
      telefone: "(88) 99999-0003",
      dataAdmissao: "2023-11-10",
      status: "ativo",
    },
    {
      id: "4",
      matricula: "001237",
      nome: "Ana Costa",
      funcao: "Carpinteiro",
      cargo: "Operacional",
      email: "ana.costa@empresa.com",
      telefone: "(88) 99999-0004",
      dataAdmissao: "2024-03-05",
      status: "ferias",
    },
  ])

  const funcoes = [
    "Servente",
    "Pedreiro",
    "Carpinteiro",
    "Armador",
    "Operador de Máquinas",
    "Motorista",
    "Mecânico",
    "Eletricista",
    "Encanador",
    "Pintor",
    "Mestre de Obras",
    "Encarregado",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingFunc) {
      setFuncionarios(funcionarios.map(func => 
        func.id === editingFunc.id 
          ? { 
              ...func, 
              matricula: formData.matricula,
              nome: formData.nome,
              funcao: formData.funcao,
              cargo: formData.cargo,
              email: formData.email,
              telefone: formData.telefone,
              dataAdmissao: formData.dataAdmissao,
            }
          : func
      ))
    } else {
      const novoFunc: Funcionario = {
        id: Date.now().toString(),
        matricula: formData.matricula,
        nome: formData.nome,
        funcao: formData.funcao,
        cargo: formData.cargo,
        email: formData.email,
        telefone: formData.telefone,
        dataAdmissao: formData.dataAdmissao,
        status: "ativo",
      }
      setFuncionarios([...funcionarios, novoFunc])
    }
    
    setFormData({
      matricula: "",
      nome: "",
      cpf: "",
      funcao: "",
      cargo: "",
      email: "",
      telefone: "",
      dataAdmissao: "",
      endereco: "",
      cidade: "",
      estado: "",
    })
    setShowForm(false)
    setEditingFunc(null)
  }

  const handleEdit = (func: Funcionario) => {
    setEditingFunc(func)
    setFormData({
      matricula: func.matricula,
      nome: func.nome,
      cpf: "",
      funcao: func.funcao,
      cargo: func.cargo,
      email: func.email,
      telefone: func.telefone,
      dataAdmissao: func.dataAdmissao,
      endereco: "",
      cidade: "",
      estado: "",
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este funcionário?")) {
      setFuncionarios(funcionarios.filter(f => f.id !== id))
    }
  }

  const getStatusBadge = (status: Funcionario["status"]) => {
    const variants = {
      ativo: { label: "Ativo", className: "bg-success/10 text-success border-success/30" },
      ferias: { label: "Férias", className: "bg-chart-2/10 text-chart-2 border-chart-2/30" },
      afastado: { label: "Afastado", className: "bg-warning/10 text-warning border-warning/30" },
      desligado: { label: "Desligado", className: "bg-muted text-muted-foreground" },
    }
    const variant = variants[status]
    return <Badge variant="outline" className={variant.className}>{variant.label}</Badge>
  }

  const filteredFuncionarios = funcionarios.filter(func =>
    func.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    func.matricula.includes(searchTerm) ||
    func.funcao.toLowerCase().includes(searchTerm.toLowerCase())
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
              <h1 className="text-xl font-bold">Cadastro de Funcionários</h1>
              <p className="text-sm opacity-90">Importar e gerenciar equipes</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, matrícula ou função..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button onClick={() => setShowForm(!showForm)} className="bg-secondary hover:bg-secondary/90">
              <Plus className="h-4 w-4 mr-2" />
              Novo
            </Button>
          </div>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingFunc ? "Editar Funcionário" : "Novo Funcionário"}</CardTitle>
              <CardDescription>Preencha as informações do funcionário</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Matrícula *</label>
                    <Input
                      placeholder="Ex: 001234"
                      value={formData.matricula}
                      onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Nome Completo *</label>
                    <Input
                      placeholder="Ex: José da Silva"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CPF *</label>
                    <Input
                      placeholder="000.000.000-00"
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Função *</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={formData.funcao}
                      onChange={(e) => setFormData({ ...formData, funcao: e.target.value })}
                      required
                    >
                      <option value="">Selecione...</option>
                      {funcoes.map((funcao) => (
                        <option key={funcao} value={funcao}>{funcao}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cargo</label>
                    <Input
                      placeholder="Ex: Operacional"
                      value={formData.cargo}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">E-mail</label>
                    <Input
                      type="email"
                      placeholder="email@exemplo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Telefone</label>
                    <Input
                      placeholder="(00) 00000-0000"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data de Admissão *</label>
                    <Input
                      type="date"
                      value={formData.dataAdmissao}
                      onChange={(e) => setFormData({ ...formData, dataAdmissao: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cidade</label>
                    <Input
                      placeholder="Ex: Juazeiro do Norte"
                      value={formData.cidade}
                      onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Estado</label>
                    <Input
                      placeholder="Ex: CE"
                      value={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                      maxLength={2}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Endereço</label>
                  <Input
                    placeholder="Rua, número, bairro"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setEditingFunc(null)
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-secondary hover:bg-secondary/90">
                    {editingFunc ? "Atualizar" : "Cadastrar"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Funcionários Cadastrados ({filteredFuncionarios.length})
            </h2>
          </div>

          {filteredFuncionarios.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? "Nenhum funcionário encontrado" : "Nenhum funcionário cadastrado"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFuncionarios.map((func) => (
                <Card key={func.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{func.nome}</h3>
                          <p className="text-xs text-muted-foreground">Mat. {func.matricula}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(func)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(func.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm mb-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Função:</span>
                        <span className="font-medium">{func.funcao}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cargo:</span>
                        <span className="font-medium">{func.cargo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Admissão:</span>
                        <span className="font-medium">
                          {new Date(func.dataAdmissao).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      {getStatusBadge(func.status)}
                      <div className="text-xs text-muted-foreground">
                        {func.telefone}
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
