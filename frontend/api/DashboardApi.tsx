import { API_BASE_URL } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"

export type DashboardStats = Record<string, number>

function normalizeStats(payload: any): DashboardStats {
	if (!payload || typeof payload !== "object") return {}
	return payload as DashboardStats
}

export function useDashboardApi() {
	const { tokens } = useAuth()
	const accessToken = tokens?.access || ""

	return {
		async getStats(): Promise<DashboardStats> {
			const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
				},
			})
			if (!response.ok) {
				const text = await response.text()
				throw new Error(text || `Erro ao obter estatísticas (${response.status})`)
			}
			const data = await response.json()
			return normalizeStats(data)
		},
	}
}

export default useDashboardApi

