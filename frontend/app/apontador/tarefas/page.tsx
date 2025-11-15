"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Truck, Users, Camera, AlertCircle, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function ApontadorTarefas() {
  const [selectedTab, setSelectedTab] = useState<"equipamentos" | "mao-obra">("equipamentos")

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Mobile-First */}
      <header className="bg-secondary text-secondary-foreground sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Painel de Tarefas</h1>
              <p className="text-sm opacity-90">Apontador de Produção</p>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm" className="bg-secondary-foreground/10 border-secondary-foreground/20">
                Sair
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Resumo do Dia */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                <Truck className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Equipamentos</span>
              </div>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Pendentes</p>
            </CardContent>
          </Card>

          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Atividades</span>
              </div>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">A validar</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Navegação */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={selectedTab === "equipamentos" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setSelectedTab("equipamentos")}
          >
            <Truck className="h-4 w-4 mr-2" />
            Equipamentos
          </Button>
          <Button
            variant={selectedTab === "mao-obra" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setSelectedTab("mao-obra")}
          >
            <Users className="h-4 w-4 mr-2" />
            Mão de Obra
          </Button>
        </div>

        {/* Lista de Equipamentos */}
        {selectedTab === "equipamentos" && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold mb-3">Equipamentos Pendentes</h2>

            {/* Equipamento para Iniciar */}
            <Card className="border-l-4 border-l-warning">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                        Aguardando Início
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg">Escavadeira 104.F570</h3>
                    <p className="text-sm text-muted-foreground">Caterpillar 320D</p>
                  </div>
                  <Clock className="h-5 w-5 text-warning" />
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Motorista:</span>
                    <span className="font-medium">João Silva</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Última leitura:</span>
                    <span className="font-medium">2.450h</span>
                  </div>
                </div>

                <Link href="/apontador/registro-equipamento" className="block">
                  <Button className="w-full" size="lg">
                    <Camera className="h-4 w-4 mr-2" />
                    Iniciar Jornada
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Equipamento em Operação */}
            <Card className="border-l-4 border-l-success">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                        Em Operação
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg">Caminhão 205.G320</h3>
                    <p className="text-sm text-muted-foreground">Mercedes-Benz 2726</p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Motorista:</span>
                    <span className="font-medium">Carlos Mendes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Iniciado às:</span>
                    <span className="font-medium">07:00</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Atividade atual:</span>
                    <span className="font-medium">Transporte de Terra</span>
                  </div>
                </div>

                <Link href="/apontador/registro-equipamento" className="block">
                  <Button className="w-full bg-transparent" size="lg" variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    Finalizar Jornada
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Equipamento com Alerta */}
            <Card className="border-l-4 border-l-destructive">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                        Paralisado
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg">Motoniveladora 301.H450</h3>
                    <p className="text-sm text-muted-foreground">Caterpillar 140K</p>
                  </div>
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Motivo:</span>
                    <span className="font-medium">Quebra Mecânica</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Desde:</span>
                    <span className="font-medium">10:30 (2h30min)</span>
                  </div>
                </div>

                <Button className="w-full bg-transparent" size="lg" variant="outline">
                  Registrar Manutenção
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lista de Mão de Obra */}
        {selectedTab === "mao-obra" && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold mb-3">Atividades a Validar</h2>

            {/* Atividade Pendente */}
            <Card className="border-l-4 border-l-warning">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                        Pendente Validação
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg">Escavação de Vala</h3>
                    <p className="text-sm text-muted-foreground">Encarregado: Pedro Santos</p>
                  </div>
                  <Clock className="h-5 w-5 text-warning" />
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Equipe:</span>
                    <span className="font-medium">8 funcionários</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Período:</span>
                    <span className="font-medium">07:00 - 12:00</span>
                  </div>
                </div>

                <Link href="/apontador/registro-mao-obra" className="block">
                  <Button className="w-full" size="lg">
                    Validar e Quantificar
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Atividade Validada */}
            <Card className="border-l-4 border-l-success">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                        Validado
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg">Compactação de Aterro</h3>
                    <p className="text-sm text-muted-foreground">Encarregado: Maria Oliveira</p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Equipe:</span>
                    <span className="font-medium">6 funcionários</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Estaqueamento:</span>
                    <span className="font-medium">km 45+200 a 45+450</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Volume:</span>
                    <span className="font-medium">180 m³</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Botão Flutuante para Ações Adicionais */}
        <div className="fixed bottom-6 right-6">
          <Button size="lg" className="rounded-full h-14 w-14 shadow-lg">
            <Camera className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}
