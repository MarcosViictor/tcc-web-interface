import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL as CORE_API_BASE } from "@/lib/api"; // já inclui /api

// Base correta apontando para /api
const API_BASE_URL = CORE_API_BASE;

export interface RegistroMaoObraRequest {
  apontador: number;
  obra: number;
  data: string; // YYYY-MM-DD
  funcionarios_presentes: number[];
  total_funcionarios: number;
  hora_inicio: string; // HH:MM
  hora_fim: string; // HH:MM
  local: string;
  observacoes?: string;
  fotos: string[]; // URLs ou paths, dependendo do backend
}

export function useMaoDeObraApi() {
  const { tokens } = useAuth();
  const accessToken = tokens?.access || "";

  return {
    // GET /registros-mao-obra
    async listar(params?: {
      obra?: number;
      apontador?: number;
      data_inicio?: string; // YYYY-MM-DD
      data_fim?: string; // YYYY-MM-DD
      validado?: boolean;
    }) {
      const url = new URL(`${API_BASE_URL}/registros-mao-obra`, window.location.origin);

      if (params) {
        if (params.obra) url.searchParams.append("obra", String(params.obra));
        if (params.apontador) url.searchParams.append("apontador", String(params.apontador));
        if (params.data_inicio) url.searchParams.append("data_inicio", params.data_inicio);
        if (params.data_fim) url.searchParams.append("data_fim", params.data_fim);
        if (params.validado !== undefined) url.searchParams.append("validado", String(params.validado));
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching registros de mão de obra: ${response.statusText}`);
      }

      return response.json();
    },

    // POST /registros-mao-obra
    async criar(data: RegistroMaoObraRequest) {
      const response = await fetch(`${API_BASE_URL}/registros-mao-obra`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(data),
      });

      if (response.status === 204) {
        return null;
      }

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error creating registro de mão de obra: ${text || response.statusText}`);
      }

      return response.json();
    },
  };
}
