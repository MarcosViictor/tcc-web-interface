export interface Atividades {
    id?: number,
    codigo: string,
    descricao: string,
    unidade: string,
    preco_unitario: number,
    obra: number,
    atividade: number,
    data: string,
    status: AtividadesStatus,
    observacoes?: string
}

type AtividadesStatus = `planejada`| `em_andamento`| `concluida`| `cancelada`