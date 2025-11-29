"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Camera, Save, Truck, Clock, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { UserHeader } from "@/components/UserHeader"
import { 
  equipamentosAPI, 
  registrosEquipamentoAPI,
  type Equipamento,
  type RegistroEquipamento 
} from "@/lib/apontador-api"

function RegistroEquipamentoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { tokens, user } = useAuth()
  
  const equipamentoId = searchParams.get('equipamento')
  const registroId = searchParams.get('registro')
  
  const [equipamento, setEquipamento] = useState<Equipamento | null>(null)
  const [registro, setRegistro] = useState<RegistroEquipamento | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    horimetroInicial: "",
    horimetroFinal: "",
    horaInicio: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    horaFim: "",
    atividade: "",
    local: "",
    observacoes: "",
  })

  const [fotos, setFotos] = useState<File[]>([])

  const atividades = [
    "Transporte de Terra",
    "Transporte de Brita",
    "Escavação",
    "Compactação",
    "Nivelamento",
    "Aguardando Carga",
    "Manutenção",
    "Abastecimento",
  ]

  // Carregar dados ao montar
  useEffect(() => {
    if (tokens?.access) {
      loadData()
    }
  }, [tokens, equipamentoId, registroId])

  const loadData = async () => {
    if (!tokens?.access) return

    try {
      setIsLoading(true)
      setError("")

      // Se tem registro ID, carrega registro existente
      if (registroId) {
        const registroData = await registrosEquipamentoAPI.obter(tokens.access, parseInt(registroId))
        setRegistro(registroData)
        
        // Preenche formulário com dados do registro
        setFormData({
          horimetroInicial: registroData.horimetro_inicial,
          horimetroFinal: registroData.horimetro_final || "",
          horaInicio: registroData.hora_inicio,
          horaFim: registroData.hora_fim || "",
          atividade: registroData.atividade_principal,
          local: registroData.local,
          observacoes: registroData.observacoes || "",
        })

        // Carrega equipamento do registro
        const equipData = await equipamentosAPI.obter(tokens.access, registroData.equipamento)
        setEquipamento(equipData)
      }
      // Se tem equipamento ID, carrega equipamento para novo registro
      else if (equipamentoId) {
        const equipData = await equipamentosAPI.obter(tokens.access, parseInt(equipamentoId))
        setEquipamento(equipData)
        
        // Preenche horímetro inicial com valor atual do equipamento
        setFormData(prev => ({
          ...prev,
          horimetroInicial: equipData.horimetro_atual
        }))
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
      setError('Erro ao carregar dados do equipamento.')
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

      const dados = {
        equipamento: equipamento!.id,
        motorista: user.id,
        data: new Date().toISOString().split('T')[0],
        horimetro_inicial: formData.horimetroInicial,
        horimetro_final: formData.horimetroFinal || undefined,
        hora_inicio: formData.horaInicio,
        hora_fim: formData.horaFim || undefined,
        atividade_principal: formData.atividade,
        local: formData.local,
        observacoes: formData.observacoes,
        validado: false
      }

      if (registro?.id) {
        // Atualizar registro existente
        await registrosEquipamentoAPI.atualizar(tokens.access, registro.id, dados)
      } else {
        // Criar novo registro
        await registrosEquipamentoAPI.criar(tokens.access, dados)
      }

      // TODO: Upload de fotos se houver
      
      router.push("/apontador/tarefas")
    } catch (err: any) {
      console.error('Erro ao salvar registro:', err)
      setError(err.message || 'Erro ao salvar registro. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleFotoCapture = () => {
    // Criar input file para capturar foto
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

  const calcularHorimetro = () => {
    if (!formData.horimetroInicial || !formData.horimetroFinal) return "0.0"
    
    const diff = parseFloat(formData.horimetroFinal) - parseFloat(formData.horimetroInicial)
    return diff.toFixed(1)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando equipamento...</p>
        </div>
      </div>
    )
  }

  if (!equipamento) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <h2 className="text-xl font-bold mb-2">Equipamento não encontrado</h2>
              <p className="text-muted-foreground mb-4">
                Não foi possível carregar os dados do equipamento.
              </p>
              <Link href="/apontador/tarefas">
                <Button>Voltar para Tarefas</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
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
            <h1 className="text-xl font-bold">Registro de Equipamento</h1>
            <p className="text-sm text-muted-foreground">
              {registro ? 'Finalizar jornada' : 'Iniciar jornada'}
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
          {/* Informações do Equipamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Dados do Equipamento
              </CardTitle>
              <CardDescription>Informações básicas da jornada</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Equipamento</label>
                  <Input
                    value={equipamento.nome}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Modelo</label>
                  <Input
                    value={`${equipamento.fabricante} ${equipamento.modelo}`}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Placa</label>
                  <Input
                    value={equipamento.placa}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Motorista/Operador</label>
                  <Input
                    value={user?.nome || ""}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Horímetro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horímetro
              </CardTitle>
              <CardDescription>Leituras inicial e final</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Inicial (h)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.horimetroInicial}
                    onChange={(e) => setFormData({ ...formData, horimetroInicial: e.target.value })}
                    required
                    placeholder="2450.0"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Final (h)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.horimetroFinal}
                    onChange={(e) => setFormData({ ...formData, horimetroFinal: e.target.value })}
                    required
                    placeholder="2458.5"
                  />
                </div>
              </div>

              {formData.horimetroInicial && formData.horimetroFinal && (
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Trabalhado:</span>
                    <span className="text-2xl font-bold text-primary">{calcularHorimetro()}h</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Horário */}
          <Card>
            <CardHeader>
              <CardTitle>Horário de Operação</CardTitle>
              <CardDescription>Início e término da jornada</CardDescription>
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
                    <span className="text-sm font-medium">Tempo de Jornada:</span>
                    <span className="text-lg font-bold text-accent">{calcularHorasTrabalhadas()}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Atividade Principal */}
          <Card>
            <CardHeader>
              <CardTitle>Atividade Principal</CardTitle>
              <CardDescription>Selecione a atividade predominante do dia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {atividades.map((ativ) => (
                  <Button
                    key={ativ}
                    type="button"
                    variant={formData.atividade === ativ ? "default" : "outline"}
                    className="h-auto py-3"
                    onClick={() => setFormData({ ...formData, atividade: ativ })}
                  >
                    {ativ}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Local de Operação */}
          <Card>
            <CardHeader>
              <CardTitle>Local de Operação</CardTitle>
              <CardDescription>Estaqueamento ou referência do local</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Ex: km 45+200 a 45+450"
                value={formData.local}
                onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                required
              />
            </CardContent>
          </Card>

          {/* Observações */}
          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
              <CardDescription>Ocorrências, problemas ou informações adicionais</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background"
                placeholder="Descreva ocorrências, paradas, manutenções, etc..."
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              />
            </CardContent>
          </Card>

          {/* Fotos */}
          <Card>
            <CardHeader>
              <CardTitle>Evidências Fotográficas</CardTitle>
              <CardDescription>Registre fotos do equipamento e do serviço executado</CardDescription>
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

              <p className="text-sm text-muted-foreground">
                {fotos.length} foto(s) capturada(s)
              </p>
            </CardContent>
          </Card>

          {/* Alerta de Validação */}
          <Card className="bg-warning/5 border-warning">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">Atenção:</p>
                  <p className="text-muted-foreground">
                    Verifique se todos os dados estão corretos antes de salvar. Após a validação, o registro será
                    enviado para aprovação do administrador.
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
                  {registro ? 'Finalizar Jornada' : 'Iniciar Jornada'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function RegistroEquipamentoPage() {
  return (
    <ProtectedRoute allowedTypes={['apontador', 'motorista', 'admin']}>
      <RegistroEquipamentoContent />
    </ProtectedRoute>
  )
}
