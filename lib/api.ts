import type { Imovel } from '../types/api';

// Lista de imóveis e empreendimentos estáticos em diferentes estados
const imoveisEstaticos: Imovel[] = [
    // --- Imóveis em Pernambuco ---
    {
        codigoImovel: "RECIFE_CASA_01",
        nomeImovel: "Casa Ampla em Casa Forte",
        construtora: "Particular",
        localizacao: "-8.033620, -34.912957", // Recife
        preco: 2500000,
        urlFotoDestaque: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        tipo: 'imovel',
        urlFicha: 'https://app.reaisystems.com.br/imovel/fichaPublica/RECIFE_CASA_01',
        unidadesTotal: 1,
        unidadesDisponiveis: 1,
        quartos: 4,
        area: 320,
        vgv: "2,5 milhões",
        categoria: "Residencial",
        estagio: "Pronto para Morar",
    },
    {
        codigoImovel: "RECIFE_EMP_01",
        nomeImovel: "Bons Ventos",
        construtora: "A&B Engenharia",
        localizacao: "-8.040180, -34.908350", // Recife
        preco: 177550,
        urlFotoDestaque: "https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        tipo: 'empreendimento',
        urlFicha: 'https://app.reaisystems.com.br/imovel/fichaPublica/RECIFE_EMP_01',
        unidadesTotal: 48,
        unidadesDisponiveis: 0,
        quartos: 3,
        area: 57,
        vgv: "8,52 milhões",
        categoria: "Residencial",
        estagio: "Em Construção",
    },
    // --- Imóveis no Ceará ---
    {
        codigoImovel: "FORTALEZA_CASA_01",
        nomeImovel: "Casa de Praia em Meireles",
        construtora: "Particular",
        localizacao: "-3.723049, -38.487843", // Fortaleza, CE
        preco: 3100000,
        urlFotoDestaque: "https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        tipo: 'imovel',
        urlFicha: 'https://app.reaisystems.com.br/imovel/fichaPublica/FORTALEZA_CASA_01',
        unidadesTotal: 1,
        unidadesDisponiveis: 1,
        quartos: 5,
        area: 450,
        vgv: "3,1 milhões",
        categoria: "Residencial",
        estagio: "Pronto",
    },
    {
        codigoImovel: "FORTALEZA_EMP_01",
        nomeImovel: "Torres do Cocó",
        construtora: "Construtora Ceará",
        localizacao: "-3.748366, -38.488344", // Fortaleza, CE
        preco: 980000,
        urlFotoDestaque: "https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        tipo: 'empreendimento',
        urlFicha: 'https://app.reaisystems.com.br/imovel/fichaPublica/FORTALEZA_EMP_01',
        unidadesTotal: 120,
        unidadesDisponiveis: 30,
        quartos: 3,
        area: 110,
        vgv: "117 milhões",
        categoria: "Residencial",
        estagio: "Lançamento",
    },
    {
        codigoImovel: "JUAZEIRO_EMP_01",
        nomeImovel: "Residencial Padre Cícero",
        construtora: "Cariri Empreendimentos",
        localizacao: "-7.213234, -39.317531", // Juazeiro do Norte, CE
        preco: 350000,
        urlFotoDestaque: "https://images.pexels.com/photos/221024/pexels-photo-221024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        tipo: 'empreendimento',
        urlFicha: 'https://app.reaisystems.com.br/imovel/fichaPublica/JUAZEIRO_EMP_01',
        unidadesTotal: 80,
        unidadesDisponiveis: 45,
        quartos: 2,
        area: 65,
        vgv: "28 milhões",
        categoria: "Residencial",
        estagio: "Na Planta",
    },
    // --- Imóveis na Paraíba ---
    {
        codigoImovel: "JOAOPESSOA_CASA_01",
        nomeImovel: "Apartamento em Tambaú",
        construtora: "Particular",
        localizacao: "-7.116538, -34.825226", // João Pessoa, PB
        preco: 890000,
        urlFotoDestaque: "https://images.pexels.com/photos/277667/pexels-photo-277667.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        tipo: 'imovel',
        urlFicha: 'https://app.reaisystems.com.br/imovel/fichaPublica/JOAOPESSOA_CASA_01',
        unidadesTotal: 1,
        unidadesDisponiveis: 1,
        quartos: 3,
        area: 130,
        vgv: "890 mil",
        categoria: "Residencial",
        estagio: "Pronto",
    },
    {
        codigoImovel: "CAMPINAGRANDE_EMP_01",
        nomeImovel: "Mirante da Borborema",
        construtora: "Engenharia PB",
        localizacao: "-7.222730, -35.881478", // Campina Grande, PB
        preco: 550000,
        urlFotoDestaque: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        tipo: 'empreendimento',
        urlFicha: 'https://app.reaisystems.com.br/imovel/fichaPublica/CAMPINAGRANDE_EMP_01',
        unidadesTotal: 90,
        unidadesDisponiveis: 80,
        quartos: 3,
        area: 88,
        vgv: "49,5 milhões",
        categoria: "Residencial",
        estagio: "Em Construção",
    },
];

export async function buscarImoveisEstaticos(termo: string): Promise<Imovel[]> {
    const termoBusca = termo.toLowerCase().trim();
    if (!termoBusca) {
        return imoveisEstaticos;
    }
    return imoveisEstaticos.filter(imovel =>
        imovel.nomeImovel.toLowerCase().includes(termoBusca) ||
        imovel.construtora.toLowerCase().includes(termoBusca) ||
        imovel.codigoImovel.toLowerCase().includes(termoBusca)
    );
}