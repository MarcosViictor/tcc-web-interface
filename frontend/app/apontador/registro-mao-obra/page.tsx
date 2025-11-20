"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Camera, Save, Users, Plus, X, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { UserHeader } from "@/components/UserHeader"
import { 
  obrasAPI,
  registrosMaoObraAPI,
  type Obra,
  type RegistroMaoObra
} from "@/lib/apontador-api"

interface ServicoExecutado {
  id: string
  descricao: string
  unidade: string
  quantidade: string
  local: string
}

function RegistroMaoObraContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { tokens, user } = useAuth()
  
  const registroId = searchParams.get('registro')
  
  const [obras, setObras] = useState<Obra[]>([])
  const [registro, setRegistro] = useState<RegistroMaoObra | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    obra_id: "",
    funcionarios_matriculas: "", // Separado por vírgula
    dataExecucao: new Date().toISOString().split("T")[0],
    horaInicio: "07:00",
    horaFim: "",
    local: "",
    observacoes: "",
  })

  const [servicosExecutados, setServicosExecutados] = useState<ServicoExecutado[]>([])
  const [fotos, setFotos] = useState<File[]>([])

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

  // Carregar dados ao montar
  useEffect(() => {
    if (tokens?.access) {
      loadData()
    }
  }, [tokens, registroId])

  const loadData = async () => {
    if (!tokens?.access) return

    try {
      setIsLoading(true)
      setError("")

      // Buscar obras disponíveis
      const obrasData = await obrasAPI.listar(tokens.access)
      setObras(obrasData)

      // Se tem registro ID, carrega registro existente
      if (registroId) {
        const registroData = await registrosMaoObraAPI.obter(tokens.access, parseInt(registroId))
        setRegistro(registroData)
        
        // Preenche formulário com dados do registro
        setFormData({
          obra_id: registroData.obra.toString(),
          funcionarios_matriculas: "", // TODO: carregar do registro
          dataExecucao: registroData.data,
          horaInicio: registroData.hora_inicio,
          horaFim: registroData.hora_fim || "",
          local: registroData.local,
          observacoes: registroData.observacoes || "",
        })
      } else if (obrasData.length > 0) {
        // Seleciona primeira obra por padrão
        setFormData(prev => ({ ...prev, obra_id: obrasData[0].id.toString() }))
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
      setError('Erro ao carregar dados.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!tokens?.access || !user?.id) {
      setError('Usuário não autenticado')
      return
    }

    try {
      setIsSaving(true)
      setError("")

      // Conta funcionários (separados por vírgula ou ponto-e-vírgula)
      const matriculas = formData.funcionarios_matriculas
        .split(/[,;]/)
        .map(m => m.trim())
        .filter(m => m.length > 0)

      const dados = {
        apontador: user.id,
        obra: parseInt(formData.obra_id),
        data: formData.dataExecucao,
        total_funcionarios: matriculas.length,
        hora_inicio: formData.horaInicio,
        hora_fim: formData.horaFim || undefined,
        local: formData.local,
        observacoes: formData.observacoes,
        validado: false
      }

      if (registro?.id) {
        // Atualizar registro existente
        await registrosMaoObraAPI.atualizar(tokens.access, registro.id, dados)
      } else {
        // Criar novo registro
        await registrosMaoObraAPI.criar(tokens.access, dados)
      }

      router.push("/apontador/tarefas")
    } catch (err: any) {
      console.error('Erro ao salvar registro:', err)
      setError(err.message || 'Erro ao salvar registro. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
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
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment'
    input.onchange = (e: any) => {
      const file = e.target.files?.[0]
      if (file) {
        setFotos([...fotos, file])
      }
    }
    input.click()
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

  const totalFuncionarios = formData.funcionarios_matriculas
    .split(/[,;]/)
    .filter(m => m.trim().length > 0)
    .length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <UserHeader />

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/apontador/tarefas">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">Registro de Mão de Obra</h1>
            <p className="text-sm text-muted-foreground">
              {registro ? 'Editar registro' : 'Novo registro'}
            </p>
          </div>
        </div>

        {error && (
          <Card className="mb-4 border-destructive bg-destructive/10">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}
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
                  <label className="text-sm font-medium">Obra</label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={formData.obra_id}
                    onChange={(e) => setFormData({ ...formData, obra_id: e.target.value })}
                    required
                  >
                    <option value="">Selecione uma obra</option>
                    {obras.map((obra) => (
                      <option key={obra.id} value={obra.id}>
                        {obra.codigo} - {obra.nome}
                      </option>
                    ))}
                  </select>
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
                <label className="text-sm font-medium">Matrículas dos Funcionários</label>
                <Input
                  placeholder="Ex: 001234, 001235, 001236"
                  value={formData.funcionarios_matriculas}
                  onChange={(e) => setFormData({ ...formData, funcionarios_matriculas: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Separe as matrículas por vírgula. Total: {totalFuncionarios} funcionário(s)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Equipe - Removida seção de funcionários mockados */}

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

          {/* Serviços - Removida seção de serviços (não está no modelo backend) */}

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
                    <div key={idx} className="aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                      <img 
                        src={URL.createObjectURL(foto)} 
                        alt={`Foto ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
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
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                size="lg"
                disabled={isSaving}
              >
                Cancelar
              </Button>
            </Link>
            <Button 
              type="submit" 
              className="flex-1 bg-secondary hover:bg-secondary/90" 
              size="lg"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {registro ? 'Atualizar Registro' : 'Salvar no Diário'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function RegistroMaoObraPage() {
  return (
    <ProtectedRoute allowedTypes={['apontador', 'encarregado', 'admin']}>
      <RegistroMaoObraContent />
    </ProtectedRoute>
  )
}
