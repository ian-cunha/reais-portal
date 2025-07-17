import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { listarImoveis, criarFiltroImovel } from '../../../lib/api';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const termo = searchParams.get('termo') || '';

    try {
        const filtro = criarFiltroImovel({
            termo,
            quantidadeImoveis: 200, // Aumente para pegar mais imóveis para o mapa
            paginado: false,
        });

        const imoveis = await listarImoveis(filtro);

        // Filtra imóveis que não têm coordenadas válidas
        const imoveisComLocalizacao = imoveis.filter(imovel => {
            if (!imovel.localizacao) return false;
            const [lat, lng] = imovel.localizacao.split(',').map(Number);
            return !isNaN(lat) && !isNaN(lng);
        });

        return NextResponse.json(imoveisComLocalizacao);
    } catch (error) {
        console.error('Erro na API de imóveis:', error);
        return new NextResponse(
            JSON.stringify({ message: 'Erro ao buscar imóveis' }),
            { status: 500 }
        );
    }
}