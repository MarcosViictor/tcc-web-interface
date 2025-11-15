import { Equipamento } from "@/lib/types/EquipamentoTypes";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL as CORE_API_BASE } from "@/lib/api"; // já inclui /api

// Base correta apontando para /api
const API_BASE_URL = CORE_API_BASE;

export function useEquipamentosApi() {
  const { tokens } = useAuth();
  const accessToken = tokens?.access || "";

  return {
    async getEquipamentos() {
      const response = await fetch(`${API_BASE_URL}/equipamentos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching equipamentos: ${response.statusText}`);
      }

      return response.json();
    },

    async createEquipamento(equipamento: Partial<Equipamento>) {
      const response = await fetch(`${API_BASE_URL}/equipamentos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(equipamento),
      });

      if (!response.ok) {
        throw new Error(`Error creating equipamento: ${response.statusText}`);
      }

      return response.json();
    },

    async updateEquipamento(id: number, equipamento: Partial<Equipamento>) {
      const response = await fetch(`${API_BASE_URL}/equipamentos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(equipamento),
      });
    
      if (!response.ok) {
        throw new Error(`Error updating equipamento: ${response.statusText}`);
      }
    
      return response.json();
    },

    async deleteEquipamento(id: number) {
      const response = await fetch(`${API_BASE_URL}/equipamentos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      if (response.status === 204) {
        return { success: true };
      }

      if (!response.ok) {
        throw new Error(`Error deleting equipamento: ${response.statusText}`);
      }


      const text = await response.text();
      if (!text) return { success: true };
      try {
        return JSON.parse(text);
      } catch {
        // Conteúdo inesperado mas operação foi ok
        return { success: true };
      }
    },
  };
}


  