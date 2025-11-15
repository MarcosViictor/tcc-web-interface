import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HardHat, Users, ClipboardCheck, Settings, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HardHat className="h-12 w-12 md:h-16 md:w-16 text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold text-balance">Sistema de Gestão de Obras</h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Otimize a apropriação de dados em obras de terraplenagem com tecnologia e eficiência
          </p>
        </div>

        {/* Perfis de Acesso */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Administrador */}
          <Card className="hover:shadow-lg transition-shadow border-2 hover:border-primary">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Administrador</CardTitle>
              <CardDescription>Acesso completo ao sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/login/admin">
                <Button className="w-full" size="lg">
                  Acessar
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Apontador */}
          <Card className="hover:shadow-lg transition-shadow border-2 hover:border-secondary">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center">
                <ClipboardCheck className="h-8 w-8 text-secondary" />
              </div>
              <CardTitle className="text-xl">Apontador</CardTitle>
              <CardDescription>Validação e registro de campo</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/login/apontador">
                <Button className="w-full bg-secondary hover:bg-secondary/90" size="lg">
                  Acessar
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Encarregado */}
          <Card className="hover:shadow-lg transition-shadow border-2 hover:border-accent">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-xl">Encarregado</CardTitle>
              <CardDescription>Gestão de equipes e atividades</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/login/encarregado">
                <Button className="w-full bg-accent hover:bg-accent/90" size="lg">
                  Acessar
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Motorista/Operador */}
          <Card className="hover:shadow-lg transition-shadow border-2 hover:border-success">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
                <HardHat className="h-8 w-8 text-success" />
              </div>
              <CardTitle className="text-xl">Motorista</CardTitle>
              <CardDescription>Registro de operação de equipamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/login/motorista">
                <Button className="w-full bg-success hover:bg-success/90" size="lg">
                  Acessar
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-16 md:mt-24 max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-balance">Principais Funcionalidades</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-lg bg-card border">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-semibold mb-2">Dashboards em Tempo Real</h3>
              <p className="text-sm text-muted-foreground">Indicadores de desempenho e produtividade atualizados</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-card border">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="font-semibold mb-2">Interface Mobile-First</h3>
              <p className="text-sm text-muted-foreground">Otimizado para uso em campo com smartphones</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-card border">
              <div className="text-4xl mb-3">🔄</div>
              <h3 className="font-semibold mb-2">Conciliação Automática</h3>
              <p className="text-sm text-muted-foreground">Validação cruzada de dados de manutenção</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
