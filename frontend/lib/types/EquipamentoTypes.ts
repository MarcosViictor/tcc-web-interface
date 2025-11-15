export interface Equipamento {
    id?: number,
    nome: string,
    tipo: string,
    modelo: string,
    placa: string,
    fabricante: string,
    ano: number,
    horimetro_atual?: number,
    status: EquipamentoStatus,
    obra: number
}

type EquipamentoStatus = "ativo" | "inativo" | "manutencao";