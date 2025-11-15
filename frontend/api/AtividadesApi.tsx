import { Atividades } from "@/lib/types/AtividadesTypes";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL as CORE_API_BASE } from "@/lib/api"; // já inclui /api

// Base correta apontando para /api
const API_BASE_URL = CORE_API_BASE;

export function useAtividadesApi() {
  const { tokens } = useAuth();
  const accessToken = tokens?.access || "";

  return {
    async getAtividades() {

      const response = await fetch(`${API_BASE_URL}/atividades`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching atividades: ${response.statusText}`);
      }

      return response.json();
    },

    async createAtividade(atividade: Partial<Atividades>) {
      const response = await fetch(`${API_BASE_URL}/atividades`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(atividade),
      });

      if (!response.ok) {
        throw new Error(`Error creating atividade: ${response.statusText}`);
      }

      return response.json();
    },

    async updateAtividade(id: number, atividade: Partial<Atividades>) {
      const response = await fetch(`${API_BASE_URL}/atividades/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(atividade),
      });
    
      if (!response.ok) {
        throw new Error(`Error updating atividade: ${response.statusText}`);
      }
    
      return response.json();
    },

    async deleteAtividade(id: number) {
      const response = await fetch(`${API_BASE_URL}/atividades/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      if (response.status === 204) return { success: true };
      if (!response.ok) {
        throw new Error(`Error deleting atividade: ${response.statusText}`);
      }
      const text = await response.text();
      if (!text) return { success: true };
      try { return JSON.parse(text); } catch { return { success: true }; }
    },

    async createCategoriaAtividade(nome: string, descricao?: string) {
      const response = await fetch(`${API_BASE_URL}/categorias-atividades`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ nome, descricao }),
      });

      if (!response.ok) {
        throw new Error(`Error creating categoria atividade: ${response.statusText}`);
      }

      return response.json();
    },

    async getCategoriasAtividades() {
      const response = await fetch(`${API_BASE_URL}/categorias-atividades`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching categorias atividades: ${response.statusText}`);
      }

      return response.json();
    },

    async deleteCategoriaAtividade(id: number) {
      const response = await fetch(`${API_BASE_URL}/categorias-atividades/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      if (response.status === 204) return { success: true };
      if (!response.ok) {
        throw new Error(`Error deleting categoria atividade: ${response.statusText}`);
      }
      const text = await response.text();
      if (!text) return { success: true };
      try { return JSON.parse(text); } catch { return { success: true }; }
    },


  };
}