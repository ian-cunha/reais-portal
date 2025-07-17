import type {
    ApiResponse,
    Imovel,
    FiltroImovel,
} from '../types/api'

const API_BASE_URL_HTTPS = "https://app.reaisystems.com.br/sites/v1"
// TOKEN CORRIGIDO: Este é o token que foi usado com sucesso anteriormente.
const API_TOKEN = "YMurVHvbtAxPRZRLejSwpCHlN8nkmk2fLOx9rBRO"

class ApiError extends Error {
    constructor(
        message: string,
        public status?: number,
    ) {
        super(message)
        this.name = "ApiError"
    }
}

async function apiRequest<T>(url: string): Promise<T> {
    try {
        console.log("🔄 API Request:", url);

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            next: { revalidate: 300 }, // Cache de 5 minutos
        });

        if (!response.ok) {
            throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
        }

        const data = await response.json();
        if (data.mensagem !== "sucesso") {
            // Se a API retornar um erro específico (como token inválido), mostre-o.
            throw new ApiError(data.mensagem || "Erro na resposta da API");
        }

        return data;
    } catch (error) {
        console.error("❌ API Error:", { url, error: error instanceof Error ? error.message : "Erro desconhecido" });
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError("Erro de conexão com a API");
    }
}

export async function listarImoveis(filtro: FiltroImovel): Promise<Imovel[]> {
    const filtroJson = encodeURIComponent(JSON.stringify(filtro));
    const data = await apiRequest<ApiResponse<Imovel[]>>(
        `${API_BASE_URL_HTTPS}/imovel/listarImoveisFiltro?filtro=${filtroJson}`,
    );
    // Assegura que o retorno seja sempre um array, mesmo que a API falhe
    return (data.imoveis as Imovel[]) || [];
}

export function criarFiltroImovel(params: Partial<FiltroImovel> = {}): FiltroImovel {
    const filtroBase: FiltroImovel = {
        token: API_TOKEN,
        quantidadeImoveis: 12,
        paginado: false,
        temFoto: "s",
    };

    return { ...filtroBase, ...params };
}