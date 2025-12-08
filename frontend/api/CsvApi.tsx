import { API_BASE_URL } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"

export type ExportTipo =
	| "equipamentos"
	| "mao-obra"
	| "atividades"
	| "funcionarios"
	| "contratos"
	| "consolidado"

export interface ExportFilters {
	inicio?: string
	fim?: string
	obra?: string
	equipamento?: string
	funcionario?: string
	atividade?: string
	status?: string
}

export function useCsvApi() {
	const { tokens } = useAuth()
	const accessToken = tokens?.access || ""

	return {
		async exportar(tipo: ExportTipo, filtros?: ExportFilters): Promise<Blob> {
			const params = new URLSearchParams()
			if (filtros?.inicio) params.append("inicio", filtros.inicio)
			if (filtros?.fim) params.append("fim", filtros.fim)
			if (filtros?.obra) params.append("obra", filtros.obra)
			if (filtros?.equipamento) params.append("equipamento", filtros.equipamento)
			if (filtros?.funcionario) params.append("funcionario", filtros.funcionario)
			if (filtros?.atividade) params.append("atividade", filtros.atividade)
			if (filtros?.status) params.append("status", filtros.status)

			const url = `${API_BASE_URL}/exportar-csv/${tipo}${params.toString() ? `?${params.toString()}` : ""}`

			const response = await fetch(url, {
				method: "GET",
				headers: {
					...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
				},
			})
			if (!response.ok) {
				const text = await response.text()
				throw new Error(text || `Erro ao exportar (${response.status})`)
			}
			const blob = await response.blob()
			return blob
		},
	}
}

export default useCsvApi

