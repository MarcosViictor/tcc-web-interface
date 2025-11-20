// Funções de API específicas para o Apontador

import { fetchWithAuth } from './api'

// ==================== TIPOS ====================

export interface Obra {
  id: number
  codigo: string
  nome: string
  local: string
  km_inicial: string
  km_final: string
  data_inicio: string
  data_prevista_fim: string
  status: 'planejamento' | 'em_andamento' | 'paralisada' | 'concluida'
  responsavel: number
}

export interface Equipamento {
  id: number
  nome: string
  tipo: 'caminhao' | 'escavadeira' | 'trator' | 'patrol' | 'rolo_compactador' | 'outros'
  modelo: string
  placa: string
  fabricante: string
  ano: number
  horimetro_atual: string
  status: 'ativo' | 'manutencao' | 'inativo'
  obra?: number
  motorista?: number
  motorista_nome?: string
}

export interface RegistroEquipamento {
  id: number
  equipamento: number
  equipamento_nome?: string
  equipamento_placa?: string
  motorista: number
  motorista_nome?: string
  data: string
  horimetro_inicial: string
  horimetro_final?: string
  hora_inicio: string
  hora_fim?: string
  atividade_principal: string
  local: string
  observacoes?: string
  foto_painel?: string
  validado_por?: number
  validado_em?: string
  status: 'em_andamento' | 'finalizado' | 'validado'
}

export interface RegistroMaoObra {
  id: number
  apontador: number
  apontador_nome?: string
  obra: number
  obra_nome?: string
  data: string
  total_funcionarios: number
  hora_inicio: string
  hora_fim: string
  local: string
  observacoes?: string
  funcionarios_matriculas?: string
  validado: boolean
  validado_por?: number
  validado_em?: string
}

export interface Atividade {
  id: number
  nome: string
  unidade_medida: string
  categoria: number
  categoria_nome?: string
  valor_unitario: string
  descricao?: string
}

// ==================== EQUIPAMENTOS ====================

export const equipamentosAPI = {
  async listar(token: string, filtros?: { obra?: number; tipo?: string; status?: string }) {
    let url = '/equipamentos/'
    
    if (filtros) {
      const params = new URLSearchParams()
      if (filtros.obra) params.append('obra', filtros.obra.toString())
      if (filtros.tipo) params.append('tipo', filtros.tipo)
      if (filtros.status) params.append('status', filtros.status)
      
      const queryString = params.toString()
      if (queryString) url += `?${queryString}`
    }
    
    console.log('🔌 [equipamentosAPI] URL:', url)
    const result = await fetchWithAuth(url, token)
    console.log('🔌 [equipamentosAPI] Result:', result)
    return result
  },

  async obter(token: string, id: number) {
    return fetchWithAuth(`/equipamentos/${id}/`, token)
  },

  async criar(token: string, data: any) {
    return fetchWithAuth('/equipamentos/', token, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async atualizar(token: string, id: number, data: any) {
    return fetchWithAuth(`/equipamentos/${id}/`, token, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
}

// ==================== REGISTROS DE EQUIPAMENTO ====================

export const registrosEquipamentoAPI = {
  // Listar registros
  async listar(token: string, params?: {
    equipamento?: number
    motorista?: number
    data_inicio?: string
    data_fim?: string
    status?: string
  }): Promise<RegistroEquipamento[]> {
    const queryParams = new URLSearchParams()
    if (params?.equipamento) queryParams.append('equipamento', params.equipamento.toString())
    if (params?.motorista) queryParams.append('motorista', params.motorista.toString())
    if (params?.data_inicio) queryParams.append('data_inicio', params.data_inicio)
    if (params?.data_fim) queryParams.append('data_fim', params.data_fim)
    if (params?.status) queryParams.append('status', params.status)
    
    const endpoint = `/registros-equipamentos/${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    return fetchWithAuth(endpoint, token)
  },

  // Obter registro específico
  async obter(token: string, id: number): Promise<RegistroEquipamento> {
    return fetchWithAuth(`/registros-equipamentos/${id}/`, token)
  },

  // Criar registro (iniciar jornada)
  async criar(token: string, data: Partial<RegistroEquipamento>): Promise<RegistroEquipamento> {
    return fetchWithAuth('/registros-equipamentos/', token, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Atualizar registro (finalizar jornada)
  async atualizar(token: string, id: number, data: Partial<RegistroEquipamento>): Promise<RegistroEquipamento> {
    return fetchWithAuth(`/registros-equipamentos/${id}/`, token, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Validar registro
  async validar(token: string, id: number): Promise<RegistroEquipamento> {
    return fetchWithAuth(`/registros-equipamentos/${id}/validar/`, token, {
      method: 'POST',
    })
  },

  // Registros pendentes (hoje, sem hora_fim)
  async pendentes(token: string): Promise<RegistroEquipamento[]> {
    const hoje = new Date().toISOString().split('T')[0]
    return this.listar(token, {
      data_inicio: hoje,
      data_fim: hoje,
      status: 'em_andamento'
    })
  },
}

// ==================== REGISTROS DE MÃO DE OBRA ====================

export const registrosMaoObraAPI = {
  // Listar registros
  async listar(token: string, params?: {
    obra?: number
    apontador?: number
    data_inicio?: string
    data_fim?: string
    validado?: boolean
  }): Promise<RegistroMaoObra[]> {
    const queryParams = new URLSearchParams()
    if (params?.obra) queryParams.append('obra', params.obra.toString())
    if (params?.apontador) queryParams.append('apontador', params.apontador.toString())
    if (params?.data_inicio) queryParams.append('data_inicio', params.data_inicio)
    if (params?.data_fim) queryParams.append('data_fim', params.data_fim)
    if (params?.validado !== undefined) queryParams.append('validado', params.validado.toString())
    
    const endpoint = `/registros-mao-obra/${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    return fetchWithAuth(endpoint, token)
  },

  // Obter registro específico
  async obter(token: string, id: number): Promise<RegistroMaoObra> {
    return fetchWithAuth(`/registros-mao-obra/${id}/`, token)
  },

  // Criar registro
  async criar(token: string, data: Partial<RegistroMaoObra>): Promise<RegistroMaoObra> {
    return fetchWithAuth('/registros-mao-obra/', token, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Atualizar registro
  async atualizar(token: string, id: number, data: Partial<RegistroMaoObra>): Promise<RegistroMaoObra> {
    return fetchWithAuth(`/registros-mao-obra/${id}/`, token, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Validar registro
  async validar(token: string, id: number): Promise<RegistroMaoObra> {
    return fetchWithAuth(`/registros-mao-obra/${id}/validar/`, token, {
      method: 'POST',
    })
  },

  // Registros pendentes de validação
  async pendentesValidacao(token: string): Promise<RegistroMaoObra[]> {
    return this.listar(token, {
      validado: false
    })
  },
}

// ==================== ATIVIDADES ====================

export const atividadesAPI = {
  // Listar atividades
  async listar(token: string, params?: {
    categoria?: number
    search?: string
  }): Promise<Atividade[]> {
    const queryParams = new URLSearchParams()
    if (params?.categoria) queryParams.append('categoria', params.categoria.toString())
    if (params?.search) queryParams.append('search', params.search)
    
    const endpoint = `/atividades/${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    return fetchWithAuth(endpoint, token)
  },

  // Obter atividade específica
  async obter(token: string, id: number): Promise<Atividade> {
    return fetchWithAuth(`/atividades/${id}/`, token)
  },
}

// ==================== OBRAS ====================

export const obrasAPI = {
  // Listar obras
  async listar(token: string, params?: {
    status?: string
  }): Promise<Obra[]> {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append('status', params.status)
    
    const endpoint = `/obras/${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    return fetchWithAuth(endpoint, token)
  },

  // Obter obra específica
  async obter(token: string, id: number): Promise<Obra> {
    return fetchWithAuth(`/obras/${id}/`, token)
  },
}
