export interface Imovel {
    idImv: number;
    idEmpreendimento: number | null;
    isEmpreendimento: boolean;
    codigoImovel: string;
    nomeImovel: string;
    nomeEmpresa: string;
    preco: any;
    latitude: number;
    longitude: number;
    urlFotoDestaque: string;
    urlFicha: string;
    tipo: string;
    subTipo: string;
    unidadesDisponiveis: number;
    unidadesTotal: number;
    quartos: number;
    areaUtil: number;
    areaTotal: number;
    vgv: number;
    estagio: string;
}