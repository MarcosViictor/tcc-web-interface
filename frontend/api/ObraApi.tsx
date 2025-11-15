import { API_BASE_URL } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Obra } from "@/lib/types/ObraTypes"

export function useObraApi() {
  const { tokens } = useAuth();
  const accessToken = tokens?.access || "";

  return {
    async getObras() {
      const response = await fetch(`${API_BASE_URL}/obras`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

     

      if (!response.ok) {
        throw new Error(`Error fetching obras: ${response.statusText}`);
      }

      return response.json();
    },

    async createObra(obra: Omit<Obra, "id" | "status">) {
      const response = await fetch(`${API_BASE_URL}/obras`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(obra),
      });

      if (!response.ok) {
        throw new Error(`Error creating obra: ${response.statusText}`);
      }

      return response.json();
    },

    async updateObra(id: number, obra: Partial<Obra>) {
      const response = await fetch(`${API_BASE_URL}/obras/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(obra),
      });

      if (!response.ok) {
        throw new Error(`Error updating obra: ${response.statusText}`);
      }

      return response.json();
    },

    async deleteObra(id: number) {
      const response = await fetch(`${API_BASE_URL}/obras/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`Error deleting obra: ${response.statusText}`);
      }

      return true;
    }
  };
}
