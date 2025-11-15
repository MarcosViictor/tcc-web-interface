"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Truck, Play, AlertTriangle, Coffee, Wrench, Clock, Fuel, Save, Camera, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function MotoristaEquipamento() {
  const router = useRouter()
  const [statusAtual, setStatusAtual] = useState<string>("Transporte de Terra")
  
  const [formData, setFormData] = useState({
    equipamento: "Caminhão 205.G320",
    modelo: "Mercedes-Benz 2726",
    horimetroInicial: "3245",
    horimetroFinal: "",
    horaInicio: "07:00",
    horaFim: "",
    atividadePrincipal: "Transporte de Terra",
    local: "",
    observacoes: "",
  })

  const [fotos, setFotos] = useState<string[]>([])

  const statusOptions = [
    { id: "transporte-terra", nome: "Transporte de Terra", icon: Truck, color: "bg-success" },
    { id: "transporte-brita", nome: "Transporte de Brita", icon: Truck, color: "bg-success" },
    { id: "escavacao", nome: "Escavação", icon: Truck, color: "bg-success" },
    { id: "almoco", nome: "Almoço", icon: Coffee, color: "bg-warning" },
    { id: "manutencao", nome: "Manutenção", icon: Wrench, color: "bg-destructive" },
    { id: "aguardando", nome: "Aguardando Carga", icon: Clock, color: "bg-secondary" },
    { id: "abastecimento", nome: "Abastecimento", icon: Fuel, color: "bg-warning" },
  ]

  const calcularTempoDecorrido = () => {
    if (!formData.horaInicio || !formData.horaFim) return "0h 0min"
    
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

  const handleFotoCapture = () => {
    const novaFoto = `foto_${Date.now()}.jpg`
    setFotos([...fotos, novaFoto])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const payload = {
      motorista: "João Silva",
      equipamento: formData.equipamento,
      modelo: formData.modelo,
      data: new Date().toISOString().split('T')[0],
      horimetroInicial: formData.horimetroInicial,
      horimetroFinal: formData.horimetroFinal,
      horaInicio: formData.horaInicio,
      horaFim: formData.horaFim,
      atividadePrincipal: formData.atividadePrincipal,
      local: formData.local,
      observacoes: formData.observacoes,
      fotos: fotos.length,
    }
    
    console.log("Finalizando jornada do motorista:", payload)
    alert("Jornada finalizada com sucesso!")
    router.push("/motorista/equipamento")
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Mobile-First */}
      <header className="bg-success text-success-foreground sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Meu Equipamento</h1>
              <p className="text-sm opacity-90">Motorista: João Silva</p>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm" className="bg-success-foreground/10 border-success-foreground/20">
                Sair
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações do Equipamento */}
          <Card className="border-2 border-success">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
                  <Truck className="h-8 w-8 text-success" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{formData.equipamento}</h2>
                  <p className="text-muted-foreground">{formData.modelo}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Horímetro Inicial</p>
                  <p className="text-lg font-semibold">{formData.horimetroInicial}h</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Início da Jornada</p>
                  <p className="text-lg font-semibold">{formData.horaInicio}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Atual */}
          <Card className="bg-success/5 border-2 border-success">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Play className="h-5 w-5 text-success" />
                Status Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-3xl font-bold mb-2">{statusAtual}</div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Tempo decorrido: {calcularTempoDecorrido()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alterar Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alterar Status</CardTitle>
              <CardDescription>Toque no botão para mudar a atividade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {statusOptions.map((status) => {
                  const Icon = status.icon
                  const isAtivo = statusAtual === status.nome

                  return (
                    <Button
                      key={status.id}
                      type="button"
                      variant={isAtivo ? "default" : "outline"}
                      className={`h-auto flex-col gap-3 py-6 ${isAtivo ? status.color : ""}`}
                      onClick={() => {
                        setStatusAtual(status.nome)
                        setFormData({ ...formData, atividadePrincipal: status.nome })
                      }}
                    >
                      <Icon className="h-8 w-8" />
                      <span className="text-sm font-medium text-center leading-tight">{status.nome}</span>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Horímetro Final */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Finalização da Jornada
              </CardTitle>
              <CardDescription>Registre o horímetro final e horário</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Horímetro Final (h)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.horimetroFinal}
                    onChange={(e) => setFormData({ ...formData, horimetroFinal: e.target.value })}
                    placeholder="3253.5"
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

              {formData.horimetroInicial && formData.horimetroFinal && (
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Trabalhado:</span>
                    <span className="text-2xl font-bold text-primary">{calcularHorimetro()}h</span>
                  </div>
                </div>
              )}

              {formData.horaInicio && formData.horaFim && (
                <div className="bg-success/5 p-4 rounded-lg border border-success/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tempo de Jornada:</span>
                    <span className="text-lg font-bold text-success">{calcularTempoDecorrido()}</span>
                  </div>
                </div>
              )}
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
                className="w-full min-h-20 p-3 rounded-md border border-input bg-background"
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

          {/* Histórico do Dia */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Histórico de Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { hora: "07:00", status: "Início da Jornada", duracao: null },
                  { hora: "07:05", status: "Transporte de Terra", duracao: "2h 30min" },
                  { hora: "09:35", status: "Abastecimento", duracao: "15min" },
                  { hora: "09:50", status: "Transporte de Terra", duracao: "1h 00min" },
                ].map((evento, i) => (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{evento.status}</span>
                        <span className="text-sm text-muted-foreground">{evento.hora}</span>
                      </div>
                      {evento.duracao && <span className="text-sm text-muted-foreground">Duração: {evento.duracao}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerta de Segurança */}
          <Card className="bg-warning/5 border-warning">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">Lembre-se:</p>
                  <p className="text-muted-foreground">
                    Atualize o status sempre que mudar de atividade para garantir o registro preciso da sua jornada.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-3 sticky bottom-4">
            <Link href="/" className="flex-1">
              <Button type="button" variant="outline" className="w-full" size="lg">
                Voltar
              </Button>
            </Link>
            <Button type="submit" className="flex-1 bg-success hover:bg-success/90" size="lg">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Finalizar Jornada
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
