"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Calendar,
  Filter,
  CheckCircle2,
  Truck,
  Users,
  Clipboard,
  Building2
} from "lucide-react"
import Link from "next/link"

export default function ExportarDadosPage() {
  const [selectedType, setSelectedType] = useState<string>("")
  const [selectedFormat, setSelectedFormat] = useState<"csv" | "excel" | "pdf">("csv")
  const [dateRange, setDateRange] = useState({
    inicio: "",
    fim: "",
  })
  const [filters, setFilters] = useState({
    obra: "",
    equipamento: "",
    funcionario: "",
    atividade: "",
    status: "todos",
  })
  const [isExporting, setIsExporting] = useState(false)

  const tiposExportacao = [
    {
      id: "equipamentos",
      titulo: "Registros de Equipamentos",
      descricao: "Horímetro, atividades, jornadas",
      icon: Truck,
      campos: ["Equipamento", "Motorista", "Horímetro", "Atividade", "Local", "Data"],
    },
    {
      id: "mao-obra",
      titulo: "Registros de Mão de Obra",
      descricao: "Equipes, serviços executados",
      icon: Users,
      campos: ["Encarregado", "Funcionários", "Serviços", "Quantidades", "Data"],
    },
    {
      id: "atividades",
      titulo: "Atividades e Serviços",
      descricao: "Cadastro completo de atividades",
      icon: Clipboard,
      campos: ["Código", "Descrição", "Unidade", "Categoria", "Preço"],
    },
    {
      id: "funcionarios",
      titulo: "Cadastro de Funcionários",
      descricao: "Dados da equipe completa",
      icon: Users,
      campos: ["Matrícula", "Nome", "Função", "Cargo", "Status"],
    },
    {
      id: "contratos",
      titulo: "Contratos e Fornecedores",
      descricao: "Terceirizados e locações",
      icon: Building2,
      campos: ["Fornecedor", "CNPJ", "Tipo", "Vigência", "Valor"],
    },
    {
      id: "consolidado",
      titulo: "Relatório Consolidado",
      descricao: "Todos os dados do período",
      icon: FileText,
      campos: ["Equipamentos", "Mão de Obra", "Atividades", "Medições"],
    },
  ]

  const handleExport = async () => {
    setIsExporting(true)

    // TODO: Chamar API de exportação
    const payload = {
      tipo: selectedType,
      formato: selectedFormat,
      dataInicio: dateRange.inicio,
      dataFim: dateRange.fim,
      filtros: filters,
    }

    console.log("Exportando dados:", payload)

    // Simular download
    setTimeout(() => {
      // TODO: Implementar download real do backend
      const filename = `${selectedType}_${new Date().toISOString().split('T')[0]}.${selectedFormat}`
      console.log(`Arquivo gerado: ${filename}`)
      
      // Simular sucesso
      alert(`Exportação concluída!\n\nArquivo: ${filename}\n\nEm produção, o download iniciará automaticamente.`)
      setIsExporting(false)
    }, 2000)
  }

  const tipoSelecionado = tiposExportacao.find(t => t.id === selectedType)

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
              <h1 className="text-xl font-bold">Exportar Dados</h1>
              <p className="text-sm opacity-90">Exportar planilhas e relatórios</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Instruções */}
        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Download className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Como exportar:</p>
                <p className="text-muted-foreground">
                  1. Selecione o tipo de dados a exportar
                  {" • "}2. Escolha o formato do arquivo
                  {" • "}3. Defina o período e filtros (opcional)
                  {" • "}4. Clique em "Exportar"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Passo 1: Tipo de Dados */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>1. Selecione o Tipo de Dados</CardTitle>
            <CardDescription>Escolha quais informações deseja exportar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tiposExportacao.map((tipo) => {
                const Icon = tipo.icon
                return (
                  <Card
                    key={tipo.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedType === tipo.id
                        ? "border-primary border-2 bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedType(tipo.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{tipo.titulo}</h3>
                          <p className="text-xs text-muted-foreground">{tipo.descricao}</p>
                        </div>
                        {selectedType === tipo.id && (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {tipo.campos.slice(0, 3).map((campo) => (
                          <Badge key={campo} variant="secondary" className="text-xs">
                            {campo}
                          </Badge>
                        ))}
                        {tipo.campos.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{tipo.campos.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Passo 2: Formato */}
        {selectedType && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>2. Escolha o Formato</CardTitle>
              <CardDescription>Formato do arquivo a ser exportado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedFormat === "csv"
                      ? "border-primary border-2 bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedFormat("csv")}
                >
                  <CardContent className="p-4 text-center">
                    <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold mb-1">CSV</h3>
                    <p className="text-xs text-muted-foreground">Valores separados por vírgula</p>
                    <p className="text-xs text-muted-foreground mt-1">Compatível com Excel</p>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedFormat === "excel"
                      ? "border-primary border-2 bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedFormat("excel")}
                >
                  <CardContent className="p-4 text-center">
                    <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 text-success" />
                    <h3 className="font-semibold mb-1">Excel (.xlsx)</h3>
                    <p className="text-xs text-muted-foreground">Planilha formatada</p>
                    <p className="text-xs text-muted-foreground mt-1">Com fórmulas e gráficos</p>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedFormat === "pdf"
                      ? "border-primary border-2 bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedFormat("pdf")}
                >
                  <CardContent className="p-4 text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-destructive" />
                    <h3 className="font-semibold mb-1">PDF</h3>
                    <p className="text-xs text-muted-foreground">Documento portátil</p>
                    <p className="text-xs text-muted-foreground mt-1">Ideal para impressão</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Passo 3: Filtros */}
        {selectedType && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                3. Filtros e Período (Opcional)
              </CardTitle>
              <CardDescription>Refine os dados a serem exportados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Período */}
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Período
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Data Início</label>
                    <Input
                      type="date"
                      value={dateRange.inicio}
                      onChange={(e) => setDateRange({ ...dateRange, inicio: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Data Fim</label>
                    <Input
                      type="date"
                      value={dateRange.fim}
                      onChange={(e) => setDateRange({ ...dateRange, fim: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Filtros específicos por tipo */}
              {selectedType === "equipamentos" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Equipamento Específico</label>
                    <Input
                      placeholder="Ex: Escavadeira 104.F570"
                      value={filters.equipamento}
                      onChange={(e) => setFilters({ ...filters, equipamento: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                      <option value="todos">Todos</option>
                      <option value="ativo">Apenas Ativos</option>
                      <option value="manutencao">Em Manutenção</option>
                      <option value="inativo">Inativos</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedType === "mao-obra" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Atividade</label>
                    <Input
                      placeholder="Ex: Escavação de Vala"
                      value={filters.atividade}
                      onChange={(e) => setFilters({ ...filters, atividade: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                      <option value="todos">Todos</option>
                      <option value="validado">Validados</option>
                      <option value="pendente">Pendentes</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedType === "funcionarios" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Função</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      <option value="">Todas</option>
                      <option value="servente">Servente</option>
                      <option value="pedreiro">Pedreiro</option>
                      <option value="operador">Operador de Máquinas</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                      <option value="todos">Todos</option>
                      <option value="ativo">Ativos</option>
                      <option value="ferias">Em Férias</option>
                      <option value="afastado">Afastados</option>
                    </select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Resumo e Ação */}
        {selectedType && (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Resumo da Exportação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Tipo de Dados</p>
                  <p className="font-semibold">{tipoSelecionado?.titulo}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Formato</p>
                  <p className="font-semibold uppercase">{selectedFormat}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Período</p>
                  <p className="font-semibold">
                    {dateRange.inicio && dateRange.fim
                      ? `${new Date(dateRange.inicio).toLocaleDateString("pt-BR")} - ${new Date(dateRange.fim).toLocaleDateString("pt-BR")}`
                      : "Todos os registros"}
                  </p>
                </div>
              </div>

              {tipoSelecionado && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium mb-2">Campos que serão exportados:</p>
                  <div className="flex flex-wrap gap-2">
                    {tipoSelecionado.campos.map((campo) => (
                      <Badge key={campo} variant="outline" className="bg-background">
                        {campo}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full bg-secondary hover:bg-secondary/90"
                size="lg"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-background border-t-transparent rounded-full" />
                    Exportando...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Dados
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                O arquivo será baixado automaticamente após a conclusão
              </p>
            </CardContent>
          </Card>
        )}

        {/* Estado inicial */}
        {!selectedType && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileSpreadsheet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Selecione um tipo de dados para começar a exportação
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
