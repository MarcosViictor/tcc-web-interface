import { API_BASE_URL } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"

export interface CriterioMedicao {
	id: number
	nome: string
	tipo: string
	percentual?: number
	condicao?: string
	aplicacao?: string
	obra: number
	ativo: boolean
	created_at?: string
	updated_at?: string
}

export interface CreateCriterioMedicaoRequest {
	nome: string
	tipo: string
	percentual?: number
	condicao?: string
	aplicacao?: string
	obra: number
	ativo: boolean
}

export interface UpdateCriterioMedicaoRequest {
	nome?: string
	tipo?: string
	percentual?: number
	condicao?: string
	aplicacao?: string
	obra?: number
	ativo?: boolean
}

function normalizeList<T>(payload: any): T[] {
	if (!payload) return []
	if (Array.isArray(payload)) return payload as T[]
	if (payload?.results && Array.isArray(payload.results)) return payload.results as T[]
	if (payload?.data && Array.isArray(payload.data)) return payload.data as T[]
	return []
}

export function useCriteriosMedicaoApi() {
	const { tokens } = useAuth()
	const accessToken = tokens?.access || ""

	return {
		async listar(): Promise<CriterioMedicao[]> {
			const response = await fetch(`${API_BASE_URL}/criterios-medicao`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
				},
			})
			if (!response.ok) {
				const text = await response.text()
				throw new Error(text || `Erro ao listar critérios (${response.status})`)
			}
			const data = await response.json()
			return normalizeList<CriterioMedicao>(data)
		},

		async criar(payload: CreateCriterioMedicaoRequest): Promise<CriterioMedicao> {
			const response = await fetch(`${API_BASE_URL}/criterios-medicao`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
				},
				body: JSON.stringify(payload),
			})
			if (!response.ok) {
				const text = await response.text()
				throw new Error(text || `Erro ao criar critério (${response.status})`)
			}
			return response.json()
		},

		async atualizar(id: number, payload: UpdateCriterioMedicaoRequest): Promise<CriterioMedicao> {
			const response = await fetch(`${API_BASE_URL}/criterios-medicao/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
				},
				body: JSON.stringify(payload),
			})
			if (!response.ok) {
				const text = await response.text()
				throw new Error(text || `Erro ao atualizar critério (${response.status})`)
			}
			return response.json()
		},

		async deletar(id: number): Promise<void> {
			const response = await fetch(`${API_BASE_URL}/criterios-medicao/${id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
				},
			})
			if (!response.ok) {
				const text = await response.text()
				throw new Error(text || `Erro ao remover critério (${response.status})`)
			}
			return
		},
	}
}

export default useCriteriosMedicaoApi

