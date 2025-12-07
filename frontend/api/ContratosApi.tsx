import { useContext, useMemo } from 'react'
import { fetchWithAuth } from '../lib/api'
import { AuthContext } from '../contexts/AuthContext'

export interface Contrato {
	id: number
	fornecedor: string
	cnpj: string
	tipo: 'materiais' | 'mao_obra' | 'equipamentos' | 'servicos' | 'consultoria' | 'locacao' | 'manutencao' | 'outros'
	numero_contrato: string
	valor_mensal: number
	data_inicio: string
	data_fim: string
	obra: number
	ativo: boolean
	created_at?: string
	updated_at?: string
}

export interface CreateContratoRequest {
	fornecedor: string
	cnpj: string
	tipo: 'materiais' | 'mao_obra' | 'equipamentos' | 'servicos' | 'consultoria' | 'locacao' | 'manutencao' | 'outros'
	numero_contrato: string
	valor_mensal: number
	data_inicio: string
	data_fim: string
	obra: number
	ativo: boolean
}

export interface UpdateContratoRequest {
	fornecedor?: string
	cnpj?: string
	tipo?: 'materiais' | 'mao_obra' | 'equipamentos' | 'servicos' | 'consultoria' | 'locacao' | 'manutencao' | 'outros'
	numero_contrato?: string
	valor_mensal?: number
	data_inicio?: string
	data_fim?: string
	obra?: number
	ativo?: boolean
}

export interface PatchContratoAtivoRequest {
	ativo: boolean
}

function normalizeList<T>(payload: any): T[] {
	if (!payload) return []
	if (Array.isArray(payload)) return payload as T[]
	if (payload?.results && Array.isArray(payload.results)) return payload.results as T[]
	if (payload?.data && Array.isArray(payload.data)) return payload.data as T[]
	return []
}

export function useContratosApi() {
	const ctx = useContext(AuthContext) as any
	const accessToken = ctx?.tokens?.access ?? ''

	const api = useMemo(() => ({
		async listar(): Promise<Contrato[]> {
			const res = await fetchWithAuth('/contratos', accessToken, {
				method: 'GET',
			})
			return normalizeList<Contrato>(res)
		},

		async criar(data: CreateContratoRequest): Promise<Contrato> {
			const res = await fetchWithAuth('/contratos', accessToken, {
				method: 'POST',
				body: JSON.stringify(data),
			})
			return res as Contrato
		},

		async atualizar(contratoId: number, data: UpdateContratoRequest): Promise<Contrato> {
			const res = await fetchWithAuth(`/contratos/${contratoId}`, accessToken, {
				method: 'PUT',
				body: JSON.stringify(data),
			})
			return res as Contrato
		},

		async patchAtivo(contratoId: number, ativo: boolean): Promise<Contrato> {
			const res = await fetchWithAuth(`/contratos/${contratoId}`, accessToken, {
				method: 'PATCH',
				body: JSON.stringify({ ativo } as PatchContratoAtivoRequest),
			})
			return res as Contrato
		},

		async deletar(contratoId: number): Promise<void> {
			await fetchWithAuth(`/contratos/${contratoId}`, accessToken, {
				method: 'DELETE',
			})
			return
		},
	}), [accessToken])

	return api
}

export default useContratosApi

