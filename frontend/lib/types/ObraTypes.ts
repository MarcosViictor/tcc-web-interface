export interface Obra {
    id?: number,
    codigo: string,
    nome: string,
    local: string,
    km_inicial?: number,
    km_final?: number,
    data_inicio: string,
    data_prevista_fim: string,
    responsavel?: string,
    numero_contrato?: string,
    status: ObraStatus,
    descricao?: string,
}

type ObraStatus = "em_andamento" | "concluida" | "suspensa";