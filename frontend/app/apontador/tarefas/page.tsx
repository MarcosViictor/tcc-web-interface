"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Truck, Users, Camera, AlertCircle, ChevronRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { UserHeader } from "@/components/UserHeader"
import { 
  type Equipamento,
  type RegistroEquipamento,
  type RegistroMaoObra
} from "@/lib/apontador-api"
import { useEquipamentosApi } from "@/api/EquipamentosApi"
import { useMaoDeObraApi } from "@/api/MaoDeObraApi"
import { APIError } from "@/lib/api"

function ApontadorTarefasContent() {
  const { tokens } = useAuth()
  const equipamentosApi = useEquipamentosApi()
  const maoDeObraApi = useMaoDeObraApi()
  
  console.log('🔄 [Tarefas] Componente renderizado!')
  console.log('🔄 [Tarefas] useAuth() retornou:', { tokens })
  
  const [selectedTab, setSelectedTab] = useState<"equipamentos" | "mao-obra">("equipamentos")
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([])
  const [registrosEquipamento, setRegistrosEquipamento] = useState<RegistroEquipamento[]>([])
  const [registrosMaoObra, setRegistrosMaoObra] = useState<RegistroMaoObra[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Carregar dados ao montar componente
  useEffect(() => {
    console.log('🔍 [Tarefas] useEffect triggered')
    console.log('🔍 [Tarefas] tokens:', tokens)
    console.log('🔍 [Tarefas] tokens?.access:', tokens?.access)
    
    if (tokens?.access) {
      console.log('✅ [Tarefas] Token encontrado! Chamando loadData...')
      loadData()
    } else {
      console.log('❌ [Tarefas] SEM TOKEN! Usuário não está logado.')
    }
  }, [tokens])

  const loadData = async () => {
    if (!tokens?.access) return

    try {
      setIsLoading(true)
      setError("")

      console.log('📡 [Tarefas] Iniciando busca de dados...')
      console.log('📡 [Tarefas] Token:', tokens.access.substring(0, 20) + '...')

      // Buscar equipamentos (via hook useEquipamentosApi)
      console.log('🚜 [Tarefas] Buscando equipamentos (hook)...')
      const equipamentosData = await equipamentosApi.getEquipamentos()
      const equipamentosList = Array.isArray(equipamentosData)
        ? equipamentosData
        : (equipamentosData?.results ?? equipamentosData?.data ?? [])
      console.log('✅ [Tarefas] Equipamentos recebidos:', equipamentosList.length, equipamentosList)
      setEquipamentos(equipamentosList as Equipamento[])

      // Registros de equipamento (novo endpoint ainda não definido)
      console.log('📅 [Tarefas] Registros de equipamento: endpoint novo não definido, deixando vazio')
      setRegistrosEquipamento([])

      // Registros de mão de obra pendentes de validação (GET via hook)
      console.log('👷 [Tarefas] Buscando registros de mão de obra pendentes...')
      const maoObraData = await maoDeObraApi.listar({ validado: false })
      const maoObraList = Array.isArray(maoObraData)
        ? maoObraData
        : (maoObraData?.results ?? maoObraData?.data ?? [])
      console.log('✅ [Tarefas] Registros de mão de obra recebidos:', maoObraList.length, maoObraList)
      setRegistrosMaoObra(maoObraList as RegistroMaoObra[])

      console.log('🎉 [Tarefas] Todos os dados carregados com sucesso!')

    } catch (err) {
      console.error('❌ [Tarefas] Erro ao carregar dados:', err)
      const message = err instanceof APIError ? err.message : 'Erro ao carregar dados. Tente novamente.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  // Calcular estatísticas
  const equipamentosPendentes = (equipamentos || []).filter(eq => {
    // Equipamento pendente se não tem registro hoje ou registro está em andamento
    const registroHoje = (registrosEquipamento || []).find(r => 
      r.equipamento === eq.id && r.status === 'em_andamento'
    )
    return !registroHoje
  }).length

  const registrosEmAndamento = (registrosEquipamento || []).filter(r => 
    r.status === 'em_andamento'
  ).length

  const atividadesPendentes = (registrosMaoObra || []).filter(r => !r.validado).length

  // Renderizar loading
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
        {/* Erro */}
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

        {/* Resumo do Dia */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                <Truck className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Equipamentos</span>
              </div>
              <div className="text-2xl font-bold">{equipamentosPendentes}</div>
              <p className="text-xs text-muted-foreground">Pendentes</p>
            </CardContent>
          </Card>

          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Atividades</span>
              </div>
              <div className="text-2xl font-bold">{atividadesPendentes}</div>
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
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Equipamentos</h2>
              <Button variant="ghost" size="sm" onClick={loadData}>
                Atualizar
              </Button>
            </div>

            {/* Equipamentos sem registro hoje (Pendentes) */}
            {(equipamentos || [])
              .filter(eq => !(registrosEquipamento || []).find(r => r.equipamento === eq.id))
              .map(equipamento => (
                <Card key={equipamento.id} className="border-l-4 border-l-warning">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                            Aguardando Início
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg">{equipamento.nome}</h3>
                        <p className="text-sm text-muted-foreground">
                          {equipamento.fabricante} {equipamento.modelo} • Placa: {equipamento.placa}
                        </p>
                      </div>
                      <Clock className="h-5 w-5 text-warning" />
                    </div>

                    <div className="space-y-2 mb-4">
                      {equipamento.motorista_nome && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Motorista:</span>
                          <span className="font-medium">{equipamento.motorista_nome}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Horímetro atual:</span>
                        <span className="font-medium">{equipamento.horimetro_atual}h</span>
                      </div>
                    </div>

                    <Link href={`/apontador/registro-equipamento?equipamento=${equipamento.id}`} className="block">
                      <Button className="w-full" size="lg">
                        <Camera className="h-4 w-4 mr-2" />
                        Iniciar Jornada
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}

            {/* Equipamentos com registro em andamento */}
            {(registrosEquipamento || [])
              .filter(r => r.status === 'em_andamento')
              .map(registro => {
                const equipamento = (equipamentos || []).find(eq => eq.id === registro.equipamento)
                if (!equipamento) return null

                return (
                  <Card key={registro.id} className="border-l-4 border-l-success">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                              Em Operação
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg">{equipamento.nome}</h3>
                          <p className="text-sm text-muted-foreground">
                            {equipamento.fabricante} {equipamento.modelo}
                          </p>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      </div>

                      <div className="space-y-2 mb-4">
                        {registro.motorista_nome && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Motorista:</span>
                            <span className="font-medium">{registro.motorista_nome}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Iniciado às:</span>
                          <span className="font-medium">{registro.hora_inicio}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Horímetro inicial:</span>
                          <span className="font-medium">{registro.horimetro_inicial}h</span>
                        </div>
                        {registro.atividade_principal && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Atividade:</span>
                            <span className="font-medium">{registro.atividade_principal}</span>
                          </div>
                        )}
                      </div>

                      <Link href={`/apontador/registro-equipamento?registro=${registro.id}`} className="block">
                        <Button className="w-full bg-transparent" size="lg" variant="outline">
                          <Camera className="h-4 w-4 mr-2" />
                          Finalizar Jornada
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}

            {/* Mensagem se não houver equipamentos */}
            {equipamentos.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Truck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Nenhum equipamento disponível</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Lista de Mão de Obra */}
        {selectedTab === "mao-obra" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Atividades de Mão de Obra</h2>
              <Button variant="ghost" size="sm" onClick={loadData}>
                Atualizar
              </Button>
            </div>

            {/* Atividades Pendentes de Validação */}
            {registrosMaoObra
              .filter(r => !r.validado)
              .map(registro => (
                <Card key={registro.id} className="border-l-4 border-l-warning">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                            Pendente Validação
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg">Registro de Mão de Obra</h3>
                        {registro.obra_nome && (
                          <p className="text-sm text-muted-foreground">Obra: {registro.obra_nome}</p>
                        )}
                      </div>
                      <Clock className="h-5 w-5 text-warning" />
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Data:</span>
                        <span className="font-medium">
                          {new Date(registro.data).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Equipe:</span>
                        <span className="font-medium">{registro.total_funcionarios} funcionários</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Período:</span>
                        <span className="font-medium">{registro.hora_inicio} - {registro.hora_fim}</span>
                      </div>
                      {registro.local && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Local:</span>
                          <span className="font-medium">{registro.local}</span>
                        </div>
                      )}
                    </div>

                    <Link href={`/apontador/registro-mao-obra?registro=${registro.id}`} className="block">
                      <Button className="w-full" size="lg">
                        Validar e Quantificar
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}

            {/* Atividades Já Validadas */}
            {registrosMaoObra
              .filter(r => r.validado)
              .map(registro => (
                <Card key={registro.id} className="border-l-4 border-l-success">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                            Validado
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg">Registro de Mão de Obra</h3>
                        {registro.obra_nome && (
                          <p className="text-sm text-muted-foreground">Obra: {registro.obra_nome}</p>
                        )}
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Data:</span>
                        <span className="font-medium">
                          {new Date(registro.data).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Equipe:</span>
                        <span className="font-medium">{registro.total_funcionarios} funcionários</span>
                      </div>
                      {registro.local && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Local:</span>
                          <span className="font-medium">{registro.local}</span>
                        </div>
                      )}
                      {registro.validado_em && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Validado em:</span>
                          <span className="font-medium">
                            {new Date(registro.validado_em).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

            {/* Mensagem se não houver registros */}
            {registrosMaoObra.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Nenhum registro de mão de obra</p>
                  <Link href="/apontador/registro-mao-obra" className="block mt-4">
                    <Button>Criar Novo Registro</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Botão Flutuante para Ações Adicionais */}
        <div className="fixed bottom-6 right-6">
          <Link href="/apontador/registro-equipamento">
            <Button size="lg" className="rounded-full h-14 w-14 shadow-lg">
              <Camera className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

// Exportar componente protegido
export default function ApontadorTarefas() {
  return (
    <ProtectedRoute allowedTypes={['apontador', 'admin']}>
      <ApontadorTarefasContent />
    </ProtectedRoute>
  )
}
