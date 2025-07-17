export interface Imovel {
    codigoImovel: string;
    nomeImovel: string;
    construtora: string;
    preco: number;
    localizacao: string; // "lat,lng"
    urlFotoDestaque: string;
    tipo: 'imovel' | 'empreendimento';
    urlFicha: string;
    unidadesTotal: number;
    unidadesDisponiveis: number;
    quartos: number;
    area: number;
    vgv: string;
    categoria: string;
    estagio: string;
}