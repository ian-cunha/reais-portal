import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { buscarImoveisEstaticos } from '../../../lib/api';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    // O termo da busca pode estar vazio para mostrar todos os imóveis
    const termo = searchParams.get('termo') || '';

    try {
        const imoveis = await buscarImoveisEstaticos(termo);
        return NextResponse.json(imoveis);
    } catch (error) {
        console.error('Erro na rota /api/imoveis:', error);
        return new NextResponse(
            JSON.stringify({ message: 'Erro ao buscar imóveis' }),
            { status: 500 }
        );
    }
}