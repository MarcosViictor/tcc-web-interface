import { API_BASE_URL } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export interface UsuarioApi {
  id: number
  email: string
  matricula: string
  nome: string
  cpf: string
  endereco?: string
  cidade?: string
  estado?: string
  telefone: string
  tipo_usuario: string
  funcao: string
  cargo: string
  is_active: boolean
  is_staff: boolean
  created_at: string
  updated_at: string
  password?: string
  password_confirm?: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export function useUsuariosApi() {
  const { tokens } = useAuth();
  const accessToken = tokens?.access || "";

  return {
    async getUsuarios(tipo?: string): Promise<PaginatedResponse<UsuarioApi>> {
      const url = new URL(`${API_BASE_URL}/usuarios`);
      if (tipo) {
        url.searchParams.append("tipo", tipo);
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching usuarios: ${response.statusText}`);
      }

      return response.json() as Promise<PaginatedResponse<UsuarioApi>>;
    },

    async createUsuario(data: Partial<UsuarioApi>): Promise<UsuarioApi> {
      const url = new URL(`${API_BASE_URL}/usuarios`);

      const payload = {
        nome: data.nome ?? "",
        email: data.email ?? "",
        matricula: data.matricula ?? "",
        cpf: data.cpf ?? "",
        telefone: data.telefone ?? "",
        tipo_usuario: data.tipo_usuario ?? "apontador",
        funcao: data.funcao ?? "",
        cargo: data.cargo ?? "",
        ...(data.password ? { password: data.password } : {}),
        ...(data.password_confirm ? { password_confirm: data.password_confirm } : {}),
      };

      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error creating usuario: ${response.status} ${text}`);
      }

      return response.json() as Promise<UsuarioApi>;
    },

    async updateUsuario(id: number, data: Partial<UsuarioApi>): Promise<UsuarioApi> {
      const url = new URL(`${API_BASE_URL}/usuarios/${id}`);

      const payload = {
        ...(data.nome !== undefined ? { nome: data.nome } : {}),
        ...(data.telefone !== undefined ? { telefone: data.telefone } : {}),
        ...(data.cargo !== undefined ? { cargo: data.cargo } : {}),
        ...(data.funcao !== undefined ? { funcao: data.funcao } : {}),
        ...(data.tipo_usuario !== undefined ? { tipo_usuario: data.tipo_usuario } : {}),
        ...(data.email !== undefined ? { email: data.email } : {}),
        ...(data.matricula !== undefined ? { matricula: data.matricula } : {}),
        ...(data.cpf !== undefined ? { cpf: data.cpf } : {}),
        ...(data.endereco !== undefined ? { endereco: data.endereco } : {}),
        ...(data.cidade !== undefined ? { cidade: data.cidade } : {}),
        ...(data.estado !== undefined ? { estado: data.estado } : {}),
        ...(data.password ? { password: data.password } : {}),
        ...(data.password_confirm ? { password_confirm: data.password_confirm } : {}),
      };

      const response = await fetch(url.toString(), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error updating usuario: ${response.status} ${text}`);
      }

      return response.json() as Promise<UsuarioApi>;
    },

    async deleteUsuario(id: number): Promise<void> {
      const url = new URL(`${API_BASE_URL}/usuarios/${id}`);

      const response = await fetch(url.toString(), {
        method: "DELETE",
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error deleting usuario: ${response.status} ${text}`);
      }

      // Alguns deletes retornam 204 sem corpo
      return;
    },
  };

  
}