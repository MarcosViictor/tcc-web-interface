"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Search, Edit, Trash2, Users, Upload, Download, User } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useUsuariosApi, UsuarioApi } from "@/api/UsuariosApi"
import { useRouter } from "next/navigation"

interface Funcionario {
  id: string
  matricula: string
  nome: string
  funcao: string
  tipoUsuario?: "admin" | "apontador" | "encarregado" | "motorista"
  cargo: string
  email: string
  telefone: string
  cpf?: string
  dataAdmissao: string
  status: "ativo" | "ferias" | "afastado" | "desligado"
  

}

export default function CadastroFuncionariosPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { getUsuarios, createUsuario, updateUsuario, deleteUsuario } = useUsuariosApi()
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingFunc, setEditingFunc] = useState<Funcionario | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    matricula: "",
    nome: "",
    cpf: "",
    funcao: "",
    tipoUsuario: "apontador" as "admin" | "apontador" | "encarregado" | "motorista",
    cargo: "",
    email: "",
    telefone: "",
    dataAdmissao: "",
    password: "",
    passwordConfirm: "",
  })

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const loadOnceRef = useRef(false)

  const TIPO_USUARIO_CHOICES = [
    { value: "admin", label: "Administrador" },
    { value: "apontador", label: "Apontador" },
    { value: "encarregado", label: "Encarregado" },
    { value: "motorista", label: "Motorista" },
  ] as const

  const FUNCAO_CHOICES = [
    { value: "engenheiro", label: "Engenheiro" },
    { value: "tecnico", label: "Técnico" },
    { value: "encarregado", label: "Encarregado" },
    { value: "apontador", label: "Apontador" },
    { value: "motorista", label: "Motorista" },
    { value: "operador", label: "Operador de Equipamento" },
    { value: "servente", label: "Servente" },
    { value: "pedreiro", label: "Pedreiro" },
    { value: "armador", label: "Armador" },
    { value: "carpinteiro", label: "Carpinteiro" },
    { value: "eletricista", label: "Eletricista" },
    { value: "mecanico", label: "Mecânico" },
  ] as const

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError(null)
      // validação de senha
      if (editingFunc) {
        const hasPasswordChange = !!formData.password || !!formData.passwordConfirm
        if (hasPasswordChange) {
          if (!formData.password || !formData.passwordConfirm) {
            setError("Para alterar a senha, preencha os dois campos.")
            return
          }
          if (formData.password !== formData.passwordConfirm) {
            setError("As senhas não coincidem.")
            return
          }
        }
      } else {
        // criação exige senha e confirmação
        if (!formData.password || !formData.passwordConfirm) {
          setError("Informe a senha e a confirmação para criar o usuário.")
          return
        }
        if (formData.password !== formData.passwordConfirm) {
          setError("As senhas não coincidem.")
          return
        }
      }
      if (editingFunc) {
        const updated = await updateUsuario(Number(editingFunc.id), {
          nome: formData.nome,
          telefone: formData.telefone,
          cargo: formData.cargo,
          funcao: formData.funcao,
          email: formData.email,
          tipo_usuario: formData.tipoUsuario,
          matricula: formData.matricula,
          cpf: formData.cpf,
          ...(formData.password ? { password: formData.password } : {}),
          ...(formData.passwordConfirm ? { password_confirm: formData.passwordConfirm } : {}),
        })
        setFuncionarios(prev => prev.map(f => f.id === String(updated.id) ? fromApiToFuncionario(updated) : f))
      } else {
        const created = await createUsuario({
          nome: formData.nome,
          email: formData.email,
          matricula: formData.matricula,
          cpf: formData.cpf,
          telefone: formData.telefone,
          funcao: formData.funcao,
          cargo: formData.cargo,
          tipo_usuario: formData.tipoUsuario,
          password: formData.password,
          password_confirm: formData.passwordConfirm,
        })
        setFuncionarios(prev => [fromApiToFuncionario(created), ...prev])
      }

      setFormData({
        matricula: "",
        nome: "",
        cpf: "",
        funcao: "",
        tipoUsuario: "apontador",
        cargo: "",
        email: "",
        telefone: "",
        dataAdmissao: "",
        password: "",
        passwordConfirm: "",
      })
      setShowForm(false)
      setEditingFunc(null)
    } catch (err: any) {
      console.error("Erro ao salvar usuário:", err)
      setError("Erro ao salvar usuário. Verifique os dados e tente novamente.")
    }
  }

  function fromApiToFuncionario(u: UsuarioApi): Funcionario {
    return {
      id: String(u.id),
      matricula: u.matricula || "",
      nome: u.nome || u.email || "",
      funcao: u.funcao || u.tipo_usuario || "",
      tipoUsuario: (u.tipo_usuario as any) ?? undefined,
      cargo: u.cargo || "",
      email: u.email || "",
      telefone: u.telefone || "",
      cpf: u.cpf || "",
      dataAdmissao: u.created_at ? new Date(u.created_at).toISOString().slice(0, 10) : "",
      status: "ativo",
    }
  }

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const fetchUsuarios = async () => {
      try {
        setError(null)
        const res = await getUsuarios()
        const mapped = res.results.map(fromApiToFuncionario)
        setFuncionarios(mapped)
      } catch (err: any) {
        console.error("Erro ao carregar usuários:", err)
        setError("Erro ao carregar funcionários. Tente novamente.")
      } 
    }

    // Garante que só carregue uma vez após autenticação pronta
    if (!loadOnceRef.current) {
      loadOnceRef.current = true
      fetchUsuarios()
    }
  }, [isAuthenticated, isLoading])

  const handleEdit = (func: Funcionario) => {
    setEditingFunc(func)
    setFormData({
      matricula: func.matricula,
      nome: func.nome,
      cpf: func.cpf || "",
      funcao: func.funcao,
      tipoUsuario: func.tipoUsuario ?? "apontador",
      cargo: func.cargo,
      email: func.email,
      telefone: func.telefone,
      dataAdmissao: func.dataAdmissao,
      password: "",
      passwordConfirm: "",
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este funcionário?")) return
    try {
      await deleteUsuario(Number(id))
      setFuncionarios(prev => prev.filter(f => f.id !== id))
    } catch (err: any) {
      console.error("Erro ao excluir usuário:", err)
      setError("Erro ao excluir usuário. Tente novamente.")
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
                      {FUNCAO_CHOICES.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo de Usuário *</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={formData.tipoUsuario}
                      onChange={(e) => setFormData({ ...formData, tipoUsuario: e.target.value as any })}
                      required
                    >
                      <option value="">Selecione...</option>
                      {TIPO_USUARIO_CHOICES.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Senha {editingFunc ? "(opcional)" : "*"}</label>
                    <Input
                      type="password"
                      placeholder={editingFunc ? "Deixe em branco para não alterar" : "Informe a senha"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirmar Senha {editingFunc ? "(opcional)" : "*"}</label>
                    <Input
                      type="password"
                      placeholder={editingFunc ? "Deixe em branco para não alterar" : "Repita a senha"}
                      value={formData.passwordConfirm}
                      onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
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
