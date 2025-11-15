"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Search, Edit, Trash2, FileText, Building } from "lucide-react"
import Link from "next/link"

interface Contrato {
  id: string
  fornecedor: string
  cnpj: string
  tipo: string
  numeroContrato: string
  dataInicio: string
  dataTermino: string
  valorMensal: number
  status: "ativo" | "suspenso" | "encerrado"
  responsavel: string
}

export default function CadastroContratosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  
  const [formData, setFormData] = useState({
    fornecedor: "",
    cnpj: "",
    tipo: "",
    numeroContrato: "",
    dataInicio: "",
    dataTermino: "",
    valorMensal: "",
    responsavel: "",
    objeto: "",
  })

  const [contratos, setContratos] = useState<Contrato[]>([
    {
      id: "1",
      fornecedor: "Locadora ABC Equipamentos Ltda",
      cnpj: "12.345.678/0001-90",
      tipo: "Locação de Equipamentos",
      numeroContrato: "CONT-2024-001",
      dataInicio: "2024-01-01",
      dataTermino: "2024-12-31",
      valorMensal: 150000,
      status: "ativo",
      responsavel: "Eng. João Carlos",
    },
    {
      id: "2",
      fornecedor: "Transportes XYZ S.A.",
      cnpj: "98.765.432/0001-10",
      tipo: "Transporte de Materiais",
      numeroContrato: "CONT-2024-002",
      dataInicio: "2024-02-01",
      dataTermino: "2025-01-31",
      valorMensal: 80000,
      status: "ativo",
      responsavel: "Eng. Maria Oliveira",
    },
  ])

  const tiposContrato = [
    "Locação de Equipamentos",
    "Transporte de Materiais",
    "Fornecimento de Agregados",
    "Mão de Obra Terceirizada",
    "Serviços de Topografia",
    "Consultoria Técnica",
    "Manutenção de Equipamentos",
    "Fornecimento de Combustível",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const novoContrato: Contrato = {
      id: Date.now().toString(),
      fornecedor: formData.fornecedor,
      cnpj: formData.cnpj,
      tipo: formData.tipo,
      numeroContrato: formData.numeroContrato,
      dataInicio: formData.dataInicio,
      dataTermino: formData.dataTermino,
      valorMensal: parseFloat(formData.valorMensal),
      status: "ativo",
      responsavel: formData.responsavel,
    }
    setContratos([...contratos, novoContrato])
    setFormData({
      fornecedor: "",
      cnpj: "",
      tipo: "",
      numeroContrato: "",
      dataInicio: "",
      dataTermino: "",
      valorMensal: "",
      responsavel: "",
      objeto: "",
    })
    setShowForm(false)
  }

  const getStatusBadge = (status: Contrato["status"]) => {
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
                        <option key={tipo} value={tipo}>{tipo}</option>
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
                  <label className="text-sm font-medium">Responsável pelo Contrato *</label>
                  <Input
                    placeholder="Ex: Eng. João Carlos Silva"
                    value={formData.responsavel}
                    onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                    required
                  />
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
                    <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
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
