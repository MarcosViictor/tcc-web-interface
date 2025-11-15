"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, FileText, Download, CheckCircle2, Clock, Users, MapPin, AlertCircle, ClipboardList } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface AtividadeRealizada {
  id: string
  descricao: string
  funcionarios: string[]
  local: string
  horaInicio: string
  horaFim: string
  status: "concluida" | "parcial" | "nao-iniciada"
}

export default function DiarioObraPage() {
  const router = useRouter()
  const dataHoje = new Date().toLocaleDateString("pt-BR")

  const atividadesRealizadas: AtividadeRealizada[] = [
    {
      id: "1",
      descricao: "Escavação de Vala",
      funcionarios: ["José da Silva", "Maria Santos", "Pedro Oliveira"],
      local: "km 45+200 a 45+450",
      horaInicio: "07:00",
      horaFim: "12:00",
      status: "concluida",
    },
    {
      id: "2",
      descricao: "Compactação de Aterro",
      funcionarios: ["Carlos Mendes", "Lucia Ferreira"],
      local: "km 44+800 a 45+100",
      horaInicio: "07:00",
      horaFim: "11:30",
      status: "concluida",
    },
    {
      id: "3",
      descricao: "Transporte de Material",
      funcionarios: ["Ana Costa"],
      local: "km 45+000",
      horaInicio: "13:00",
      horaFim: "",
      status: "parcial",
    },
  ]

  const equipamentosUtilizados = [
    { nome: "Escavadeira CAT 320", horimetro: "2.340h", horas: "5h" },
    { nome: "Rolo Compactador", horimetro: "1.890h", horas: "4.5h" },
    { nome: "Caminhão Basculante", horimetro: "4.120h", horas: "3h" },
  ]

  const observacoes = [
    "Chuva leve entre 10h00 e 10h30",
    "Solo com alto índice de umidade",
    "Necessário ajuste no compactador (vibração irregular)",
  ]

  const estatisticas = {
    totalFuncionarios: 6,
    presentes: 5,
    ausentes: 1,
    atividadesConcluidas: 2,
    atividadesParciais: 1,
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "concluida":
        return <Badge className="bg-green-500">Concluída</Badge>
      case "parcial":
        return <Badge className="bg-yellow-500">Em Andamento</Badge>
      default:
        return <Badge variant="secondary">Não Iniciada</Badge>
    }
  }

  const gerarDiario = () => {
    const payload = {
      encarregado: "Pedro Santos",
      data: new Date().toISOString().split('T')[0],
      obra: "Duplicação BR-116 - Lote 03",
      estatisticas,
      atividades: atividadesRealizadas,
      equipamentos: equipamentosUtilizados,
      observacoes,
      condicoesClimaticas: "Parcialmente nublado, chuva leve pela manhã",
    }

    console.log("Gerando Diário de Obra:", payload)
    // TODO: Enviar para backend e gerar PDF
    
    alert("Diário de Obra gerado com sucesso! O arquivo PDF será baixado.")
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-accent text-accent-foreground sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/encarregado/equipe">
              <Button variant="ghost" size="sm" className="text-accent-foreground">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Diário de Obra</h1>
              <p className="text-sm opacity-90">Encarregado: Pedro Santos</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Informações do Dia */}
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {dataHoje}
              </span>
              <Badge className="bg-primary">{new Date().toLocaleDateString("pt-BR", { weekday: "long" })}</Badge>
            </CardTitle>
            <CardDescription>Duplicação BR-116 - Lote 03</CardDescription>
          </CardHeader>
        </Card>

        {/* Estatísticas do Dia */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{estatisticas.presentes}/{estatisticas.totalFuncionarios}</p>
                  <p className="text-sm text-muted-foreground">Presentes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{estatisticas.atividadesConcluidas}</p>
                  <p className="text-sm text-muted-foreground">Concluídas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{estatisticas.atividadesParciais}</p>
                  <p className="text-sm text-muted-foreground">Em Andamento</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{estatisticas.ausentes}</p>
                  <p className="text-sm text-muted-foreground">Ausentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Atividades Realizadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Atividades Realizadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {atividadesRealizadas.map((ativ) => (
              <div key={ativ.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{ativ.descricao}</h3>
                    {getStatusBadge(ativ.status)}
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium">{ativ.horaInicio} - {ativ.horaFim || "..."}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{ativ.local}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  <div className="flex flex-wrap gap-1">
                    {ativ.funcionarios.map((func, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {func}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Equipamentos Utilizados */}
        <Card>
          <CardHeader>
            <CardTitle>Equipamentos Utilizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {equipamentosUtilizados.map((equip, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{equip.nome}</p>
                    <p className="text-sm text-muted-foreground">Horímetro: {equip.horimetro}</p>
                  </div>
                  <Badge>{equip.horas} trabalhadas</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card>
          <CardHeader>
            <CardTitle>Observações e Condições</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {observacoes.map((obs, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                  <span className="text-sm">{obs}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex gap-3 sticky bottom-4">
          <Link href="/encarregado/equipe" className="flex-1">
            <Button variant="outline" className="w-full" size="lg">
              Voltar
            </Button>
          </Link>
          <Button 
            onClick={gerarDiario}
            className="flex-1 bg-secondary hover:bg-secondary/90" 
            size="lg"
          >
            <Download className="h-4 w-4 mr-2" />
            Gerar PDF
          </Button>
        </div>
      </div>
    </div>
  )
}
