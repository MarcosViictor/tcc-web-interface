"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Camera, Save, Users, Plus, X, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Funcionario {
  matricula: string
  nome: string
  presente: boolean
}

interface ServicoExecutado {
  id: string
  descricao: string
  unidade: string
  quantidade: string
  local: string
}

export default function RegistroMaoObraPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    encarregado: "Pedro Santos",
    atividade: "",
    dataExecucao: new Date().toISOString().split("T")[0],
    horaInicio: "07:00",
    horaFim: "",
    observacoes: "",
  })

  const [funcionarios] = useState<Funcionario[]>([
    { matricula: "001234", nome: "José da Silva", presente: true },
    { matricula: "001235", nome: "Maria Santos", presente: true },
    { matricula: "001236", nome: "Pedro Oliveira", presente: true },
    { matricula: "001237", nome: "Ana Costa", presente: false },
    { matricula: "001238", nome: "Carlos Mendes", presente: true },
    { matricula: "001239", nome: "Lucia Ferreira", presente: true },
  ])

  const [servicosExecutados, setServicosExecutados] = useState<ServicoExecutado[]>([
    {
      id: "1",
      descricao: "Escavação de Vala",
      unidade: "m³",
      quantidade: "",
      local: "",
    },
  ])

  const [fotos, setFotos] = useState<string[]>([])

  const atividadesDisponiveis = [
    "Escavação de Vala",
    "Compactação de Aterro",
    "Transporte de Material",
    "Nivelamento de Pista",
    "Limpeza de Área",
    "Instalação de Drenagem",
    "Aplicação de Revestimento",
    "Sinalização",
  ]

  const unidadesMedida = ["m³", "m²", "m", "un", "kg", "t"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Enviar dados para o backend
    const payload = {
      ...formData,
      funcionarios: funcionarios.filter((f) => f.presente),
      servicos: servicosExecutados,
      fotos,
    }
    console.log("Dados da mão de obra:", payload)
    router.push("/apontador/tarefas")
  }

  const adicionarServico = () => {
    const novoServico: ServicoExecutado = {
      id: Date.now().toString(),
      descricao: "",
      unidade: "m³",
      quantidade: "",
      local: "",
    }
    setServicosExecutados([...servicosExecutados, novoServico])
  }

  const removerServico = (id: string) => {
    setServicosExecutados(servicosExecutados.filter((s) => s.id !== id))
  }

  const atualizarServico = (id: string, campo: keyof ServicoExecutado, valor: string) => {
    setServicosExecutados(
      servicosExecutados.map((s) => (s.id === id ? { ...s, [campo]: valor } : s))
    )
  }

  const handleFotoCapture = () => {
    const novaFoto = `foto_${Date.now()}.jpg`
    setFotos([...fotos, novaFoto])
  }

  const calcularHorasTrabalhadas = () => {
    if (!formData.horaInicio || !formData.horaFim) return "0:00"

    const [hi, mi] = formData.horaInicio.split(":").map(Number)
    const [hf, mf] = formData.horaFim.split(":").map(Number)

    const inicio = hi * 60 + mi
    const fim = hf * 60 + mf
    const diff = fim - inicio

    const horas = Math.floor(diff / 60)
    const minutos = diff % 60

    return `${horas}h ${minutos}min`
  }

  const funcionariosPresentes = funcionarios.filter((f) => f.presente).length

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-secondary text-secondary-foreground sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/apontador/tarefas">
              <Button variant="ghost" size="sm" className="text-secondary-foreground">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Registro de Mão de Obra</h1>
              <p className="text-sm opacity-90">Diário de obras - Serviços executados</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Gerais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Informações da Equipe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Encarregado Responsável</label>
                  <Input
                    value={formData.encarregado}
                    onChange={(e) => setFormData({ ...formData, encarregado: e.target.value })}
                    required
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Data de Execução</label>
                  <Input
                    type="date"
                    value={formData.dataExecucao}
                    onChange={(e) => setFormData({ ...formData, dataExecucao: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Atividade Principal</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {atividadesDisponiveis.map((ativ) => (
                    <Button
                      key={ativ}
                      type="button"
                      variant={formData.atividade === ativ ? "default" : "outline"}
                      className="h-auto py-3 text-xs"
                      onClick={() => setFormData({ ...formData, atividade: ativ })}
                    >
                      {ativ}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Funcionários Presentes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Equipe Presente</CardTitle>
                  <CardDescription>Funcionários alocados nesta atividade</CardDescription>
                </div>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {funcionariosPresentes} presentes
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {funcionarios.map((func) => (
                  <div
                    key={func.matricula}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      func.presente ? "bg-success/5 border-success/20" : "bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {func.presente ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                      )}
                      <div>
                        <p className="font-medium">{func.nome}</p>
                        <p className="text-sm text-muted-foreground">Mat. {func.matricula}</p>
                      </div>
                    </div>
                    {func.presente && <Badge variant="outline">Presente</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Horário de Trabalho */}
          <Card>
            <CardHeader>
              <CardTitle>Horário de Trabalho</CardTitle>
              <CardDescription>Período de execução da atividade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hora Início</label>
                  <Input
                    type="time"
                    value={formData.horaInicio}
                    onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Hora Fim</label>
                  <Input
                    type="time"
                    value={formData.horaFim}
                    onChange={(e) => setFormData({ ...formData, horaFim: e.target.value })}
                    required
                  />
                </div>
              </div>

              {formData.horaInicio && formData.horaFim && (
                <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tempo Trabalhado:</span>
                    <span className="text-lg font-bold text-accent">{calcularHorasTrabalhadas()}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Serviços Executados */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Serviços Executados</CardTitle>
                  <CardDescription>Quantificação dos serviços realizados</CardDescription>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={adicionarServico}>
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {servicosExecutados.map((servico, index) => (
                <div key={servico.id} className="p-4 border rounded-lg space-y-3 bg-card">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Serviço {index + 1}</h4>
                    {servicosExecutados.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removerServico(servico.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Descrição do Serviço</label>
                      <Input
                        placeholder="Ex: Escavação de vala para drenagem"
                        value={servico.descricao}
                        onChange={(e) => atualizarServico(servico.id, "descricao", e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Quantidade</label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={servico.quantidade}
                          onChange={(e) => atualizarServico(servico.id, "quantidade", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Unidade</label>
                        <select
                          className="w-full h-10 px-3 rounded-md border border-input bg-background"
                          value={servico.unidade}
                          onChange={(e) => atualizarServico(servico.id, "unidade", e.target.value)}
                        >
                          {unidadesMedida.map((un) => (
                            <option key={un} value={un}>
                              {un}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Local/Estaqueamento</label>
                      <Input
                        placeholder="Ex: km 45+200 a 45+450"
                        value={servico.local}
                        onChange={(e) => atualizarServico(servico.id, "local", e.target.value)}
                        required
                      />
                    </div>

                    {servico.quantidade && servico.unidade && (
                      <div className="bg-primary/5 p-3 rounded-md">
                        <p className="text-sm text-center">
                          <span className="font-semibold text-primary text-lg">
                            {servico.quantidade} {servico.unidade}
                          </span>{" "}
                          <span className="text-muted-foreground">de {servico.descricao}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Observações */}
          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
              <CardDescription>Informações complementares sobre a execução</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background"
                placeholder="Condições climáticas, dificuldades encontradas, materiais utilizados, etc..."
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              />
            </CardContent>
          </Card>

          {/* Fotos */}
          <Card>
            <CardHeader>
              <CardTitle>Evidências Fotográficas</CardTitle>
              <CardDescription>Registre o serviço executado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button type="button" variant="outline" className="w-full" onClick={handleFotoCapture}>
                <Camera className="h-4 w-4 mr-2" />
                Capturar Foto
              </Button>

              {fotos.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {fotos.map((foto, idx) => (
                    <div key={idx} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <Camera className="h-6 w-6 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              )}

              <p className="text-sm text-muted-foreground">{fotos.length} foto(s) capturada(s)</p>
            </CardContent>
          </Card>

          {/* Alerta */}
          <Card className="bg-warning/5 border-warning">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">Importante:</p>
                  <p className="text-muted-foreground">
                    Verifique todos os dados antes de salvar. Este registro será incluído no diário de obras e
                    enviado para aprovação.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-3 sticky bottom-4">
            <Link href="/apontador/tarefas" className="flex-1">
              <Button type="button" variant="outline" className="w-full" size="lg">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" className="flex-1 bg-secondary hover:bg-secondary/90" size="lg">
              <Save className="h-4 w-4 mr-2" />
              Salvar no Diário
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
