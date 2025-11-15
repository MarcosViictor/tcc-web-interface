"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Truck, Play, AlertTriangle, Coffee, Wrench, Clock, Fuel } from "lucide-react"
import Link from "next/link"

export default function MotoristaEquipamento() {
  const [statusAtual, setStatusAtual] = useState<string>("Transporte de Terra")
  const [horaInicio, setHoraInicio] = useState("07:00")

  const statusOptions = [
    { id: "transporte", nome: "Transporte de Terra", icon: Truck, color: "bg-success" },
    { id: "escavacao", nome: "Escavação", icon: Truck, color: "bg-success" },
    { id: "almoco", nome: "Almoço", icon: Coffee, color: "bg-warning" },
    { id: "manutencao", nome: "Manutenção", icon: Wrench, color: "bg-destructive" },
    { id: "aguardando", nome: "Aguardando Carga", icon: Clock, color: "bg-info" },
    { id: "abastecimento", nome: "Abastecimento", icon: Fuel, color: "bg-warning" },
  ]

  const calcularTempoDecorrido = () => {
    // Simulação - em produção seria calculado com a hora real
    return "3h 45min"
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
        {/* Informações do Equipamento */}
        <Card className="mb-6 border-2 border-success">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
                <Truck className="h-8 w-8 text-success" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">Caminhão 205.G320</h2>
                <p className="text-muted-foreground">Mercedes-Benz 2726</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Horímetro Inicial</p>
                <p className="text-lg font-semibold">3.245h</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Início da Jornada</p>
                <p className="text-lg font-semibold">{horaInicio}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Atual */}
        <Card className="mb-6 bg-success/5 border-2 border-success">
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
                    variant={isAtivo ? "default" : "outline"}
                    className={`h-auto flex-col gap-3 py-6 ${isAtivo ? status.color : ""}`}
                    onClick={() => setStatusAtual(status.nome)}
                  >
                    <Icon className="h-8 w-8" />
                    <span className="text-sm font-medium text-center leading-tight">{status.nome}</span>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Histórico do Dia */}
        <Card className="mt-6">
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
        <Card className="mt-6 bg-warning/5 border-warning">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Lembre-se:</p>
                <p className="text-muted-foreground">
                  Atualize o status sempre que mudar de atividade para garantir o registro preciso da sua jornada.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
