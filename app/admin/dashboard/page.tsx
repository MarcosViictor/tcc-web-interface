import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users, Truck, AlertTriangle, CheckCircle2, Clock, FileText, Upload, Download } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Painel Administrativo</h1>
              <p className="text-sm text-muted-foreground">Obra: Rodovia BR-116 - Trecho Cariri</p>
            </div>
            <Link href="/">
              <Button variant="outline">Sair</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Equipamentos Ativos</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-success">+2</span> desde ontem
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Mão de Obra</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <span className="text-muted-foreground">Funcionários presentes hoje</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Disponibilidade Mecânica</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87.5%</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-success">+3.2%</span> vs. mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Alertas Pendentes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">7</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <span className="text-warning">3 críticos</span> requerem atenção
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Navegação */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="cadastros">Cadastros</TabsTrigger>
            <TabsTrigger value="conciliacao">Conciliação</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
            <TabsTrigger value="medicao">Medição</TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Produtividade de Equipamentos */}
              <Card>
                <CardHeader>
                  <CardTitle>Produtividade de Equipamentos</CardTitle>
                  <CardDescription>Últimas 24 horas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Escavadeira 104.F570", hours: 8.5, efficiency: 94 },
                      { name: "Caminhão Basculante 205.G320", hours: 7.2, efficiency: 80 },
                      { name: "Motoniveladora 301.H450", hours: 9.0, efficiency: 100 },
                      { name: "Pá Carregadeira 402.J890", hours: 6.8, efficiency: 75 },
                    ].map((equip, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{equip.name}</span>
                          <span className="text-muted-foreground">{equip.hours}h</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${equip.efficiency}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tempo de Paralisações */}
              <Card>
                <CardHeader>
                  <CardTitle>Principais Motivos de Parada</CardTitle>
                  <CardDescription>Últimos 7 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { reason: "Manutenção Preventiva", hours: 24, color: "bg-chart-2" },
                      { reason: "Quebra Mecânica", hours: 18, color: "bg-destructive" },
                      { reason: "Falta de Combustível", hours: 12, color: "bg-warning" },
                      { reason: "Condições Climáticas", hours: 8, color: "bg-chart-4" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className={`h-3 w-3 rounded-full ${item.color}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="font-medium">{item.reason}</span>
                            <span className="text-muted-foreground">{item.hours}h</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ações Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent">
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">Gerar RDO</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent">
                    <Upload className="h-6 w-6" />
                    <span className="text-sm">Importar Dados</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent">
                    <Download className="h-6 w-6" />
                    <span className="text-sm">Exportar Planilha</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent">
                    <Clock className="h-6 w-6" />
                    <span className="text-sm">Histórico</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cadastros */}
          <TabsContent value="cadastros" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Obras</CardTitle>
                  <CardDescription>Gerenciar cadastro de obras</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Acessar</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Equipamentos</CardTitle>
                  <CardDescription>Gerenciar frota de equipamentos</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Acessar</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Funcionários</CardTitle>
                  <CardDescription>Importar e gerenciar equipes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Acessar</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Contratos</CardTitle>
                  <CardDescription>Fornecedores e terceirizados</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Acessar</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Critérios de Medição</CardTitle>
                  <CardDescription>Configurar descontos e regras</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Acessar</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Atividades</CardTitle>
                  <CardDescription>Cadastro de serviços</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Acessar</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Conciliação */}
          <TabsContent value="conciliacao" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Painel de Conciliação</CardTitle>
                <CardDescription>Validação cruzada entre Parte Diária e Controle de Quebras</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Status de Conciliação */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border-2 border-success bg-success/5">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                        <span className="font-semibold">Conciliado</span>
                      </div>
                      <div className="text-2xl font-bold">18</div>
                      <p className="text-sm text-muted-foreground">Registros validados</p>
                    </div>

                    <div className="p-4 rounded-lg border-2 border-warning bg-warning/5">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-warning" />
                        <span className="font-semibold">Alerta</span>
                      </div>
                      <div className="text-2xl font-bold">5</div>
                      <p className="text-sm text-muted-foreground">Requer verificação</p>
                    </div>

                    <div className="p-4 rounded-lg border-2 border-destructive bg-destructive/5">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <span className="font-semibold">Conflito</span>
                      </div>
                      <div className="text-2xl font-bold">2</div>
                      <p className="text-sm text-muted-foreground">Divergências críticas</p>
                    </div>
                  </div>

                  {/* Lista de Divergências */}
                  <div className="space-y-2">
                    <h3 className="font-semibold mb-3">Divergências Pendentes</h3>

                    <div className="p-4 rounded-lg border-2 border-warning bg-card">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-warning" />
                          <span className="font-medium">Escavadeira 104.F570</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Hoje, 14:30</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Motorista reportou quebra, mas não há registro da manutenção
                      </p>
                      <Button size="sm" variant="outline">
                        Investigar
                      </Button>
                    </div>

                    <div className="p-4 rounded-lg border-2 border-destructive bg-card">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-destructive" />
                          <span className="font-medium">Caminhão 205.G320</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Hoje, 11:15</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Motorista reportou produção durante período de quebra registrada
                      </p>
                      <Button size="sm" variant="outline">
                        Investigar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Relatórios */}
          <TabsContent value="relatorios" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Geração de Relatórios</CardTitle>
                <CardDescription>RDO e relatórios gerenciais</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-lg border-2 hover:border-primary transition-colors">
                    <FileText className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">Relatório Diário de Obra (RDO)</h3>
                    <p className="text-sm text-muted-foreground mb-4">Compilação automática dos dados do dia</p>
                    <Button className="w-full">Gerar RDO</Button>
                  </div>

                  <div className="p-6 rounded-lg border-2 hover:border-primary transition-colors">
                    <Download className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">Exportar Dados</h3>
                    <p className="text-sm text-muted-foreground mb-4">Exportar planilhas para análise externa</p>
                    <Button className="w-full bg-transparent" variant="outline">
                      Exportar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medição */}
          <TabsContent value="medicao" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Medição de Terceirizados</CardTitle>
                <CardDescription>Boletins mensais de medição</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">Fornecedor</label>
                      <select className="w-full p-2 rounded-md border bg-background">
                        <option>Locadora ABC Ltda</option>
                        <option>Transportes XYZ S.A.</option>
                        <option>Máquinas & Equipamentos</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">Período</label>
                      <select className="w-full p-2 rounded-md border bg-background">
                        <option>Janeiro 2025</option>
                        <option>Dezembro 2024</option>
                        <option>Novembro 2024</option>
                      </select>
                    </div>
                  </div>
                  <Button className="w-full" size="lg">
                    Gerar Boletim de Medição
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
