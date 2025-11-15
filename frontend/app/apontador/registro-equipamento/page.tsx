"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Camera, Save, Truck, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegistroEquipamentoPage() {
  const router = useRouter()
  
  // TODO: Receber dados do equipamento via query params ou state
  // Exemplo: const { equipamento, motorista, ultimaLeitura } = useSearchParams()
  
  const [formData, setFormData] = useState({
    equipamento: "Escavadeira 104.F570", // Vindo da página de tarefas
    modelo: "Caterpillar 320D", // Vindo do backend
    motorista: "João Silva", // Atribuído pelo encarregado
    horimetroInicial: "2450", // Última leitura registrada
    horimetroFinal: "",
    horaInicio: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    horaFim: "",
    atividade: "",
    local: "",
    observacoes: "",
  })

  const [fotos, setFotos] = useState<string[]>([])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Enviar dados para o backend
    console.log("Dados do equipamento:", formData)
    router.push("/apontador/tarefas")
  }

  const handleFotoCapture = () => {
    // TODO: Implementar captura de foto com câmera
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

  const calcularHorimetro = () => {
    if (!formData.horimetroInicial || !formData.horimetroFinal) return "0.0"
    
    const diff = parseFloat(formData.horimetroFinal) - parseFloat(formData.horimetroInicial)
    return diff.toFixed(1)
  }

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
              <h1 className="text-xl font-bold">Registro de Equipamento</h1>
              <p className="text-sm opacity-90">Validar jornada diária</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
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
                    value={formData.equipamento}
                    onChange={(e) => setFormData({ ...formData, equipamento: e.target.value })}
                    required
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Modelo</label>
                  <Input
                    value={formData.modelo}
                    onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                    required
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Motorista/Operador</label>
                <Input
                  value={formData.motorista}
                  onChange={(e) => setFormData({ ...formData, motorista: e.target.value })}
                  required
                  disabled
                  className="bg-muted"
                />
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
                    <div key={idx} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <Camera className="h-6 w-6 text-muted-foreground" />
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
              <Button type="button" variant="outline" className="w-full" size="lg">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" className="flex-1 bg-secondary hover:bg-secondary/90" size="lg">
              <Save className="h-4 w-4 mr-2" />
              Validar e Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
