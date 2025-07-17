export interface ApiResponse<T> {
    mensagem: string;
    [key: string]: T | string;
}

export interface Imovel {
    codigoImovel: string;
    nomeImovel: string;
    preco: number;
    endereco: string;
    localizacao: string;
    nomeBairro: string;
    nomeCidade: string;
    siglaEstado: string;
    urlFotoDestaque: string;
}

export interface FiltroImovel {
    token: string;
    quantidadeImoveis: number;
    paginado: boolean;
    temFoto: "s" | "n";
    termo?: string;
}