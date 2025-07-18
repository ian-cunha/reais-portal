"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, OverlayView, MarkerClustererF } from '@react-google-maps/api';
import { useTheme } from 'next-themes';
import useSWR from 'swr';
import { Imovel } from '../types/api';
import { X, Plus, Minus } from 'lucide-react';
import { LoadingIndicator } from './loading-indicator';

// --- Hook para verificar o tamanho da tela ---
const useIsDesktop = () => {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const updateSize = () => {
            setIsDesktop(window.innerWidth >= 640);
        };

        updateSize();

        window.addEventListener('resize', updateSize);

        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return isDesktop;
};


const fetcher = (url: string) => fetch(url).then((res) => res.json());

const empreendimentoIcon = () => `
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#fa581a" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" />
    <path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" />
    <path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" />
  </svg>
`;

const imovelIcon = () => `
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#FFA500" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" />
    <path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" />
    <path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" />
  </svg>
`;

const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '88vh'
};

const center = {
    lat: -5.8,
    lng: -39.0
};

const lightMapStyles: google.maps.MapTypeStyle[] = [
    { featureType: "poi.business", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] }
];

const darkMapStyles: google.maps.MapTypeStyle[] = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
];

interface MapProps {
    searchTerm: string;
}

const Map = ({ searchTerm }: MapProps) => {
    const { theme } = useTheme();
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_Maps_API_KEY || "AIzaSyCI1EDQZhIQXj165PIfJisA3FIvjLpql4Y",
        libraries: ['marker'],
    });

    const [selectedImovel, setSelectedImovel] = useState<Imovel | null>(null);
    const { data: imoveis } = useSWR<Imovel[]>(`/api/imoveis?termo=${searchTerm}`, fetcher);

    // Hook que decide qual layout usar
    const isDesktop = useIsDesktop();

    const mapOptions = {
        disableDefaultUI: true,
        zoomControl: false,
        styles: theme === 'dark' ? darkMapStyles : lightMapStyles,
        // --- ALTERAÇÃO AQUI ---
        // 'greedy': permite arrastar com 1 dedo no mobile
        // 'cooperative': comportamento padrão (2 dedos para mover) no desktop
        gestureHandling: isDesktop ? 'cooperative' : 'greedy',
    };


    const getIcon = (tipo: 'imovel' | 'empreendimento') => {
        const svg = tipo === 'empreendimento' ? empreendimentoIcon() : imovelIcon();
        return {
            url: 'data:image/svg+xml;base64,' + btoa(svg),
            scaledSize: new window.google.maps.Size(36, 36)
        };
    };

    const onLoad = useCallback((mapInstance: google.maps.Map) => setMap(mapInstance), []);
    const onUnmount = useCallback(() => setMap(null), []);

    const handleZoomIn = () => map?.setZoom(map.getZoom()! + 1);
    const handleZoomOut = () => map?.setZoom(map.getZoom()! - 1);
    const handleClosePopup = () => setSelectedImovel(null);

    // Componente do Card de Informações, para evitar duplicação
    const ImovelCard = ({ imovel, onClose }: { imovel: Imovel, onClose: () => void }) => (
        <>
            <button
                onClick={onClose}
                className="absolute top-2 right-2 p-1 rounded-sm bg-background/50 text-foreground/70 hover:bg-background hover:text-foreground transition-all z-10"
                aria-label="Fechar popup"
            >
                <X size={16} />
            </button>
            {imovel.urlFotoDestaque && (
                <img src={imovel.urlFotoDestaque} alt={imovel.nomeImovel} className="w-full h-32 object-cover rounded-t-lg flex-shrink-0" />
            )}
            <div className="p-4 overflow-y-auto">
                <div className="mb-3">
                    <h3 className="font-bold text-lg leading-tight">{imovel.nomeImovel.toUpperCase()}</h3>
                    <p className="text-sm text-muted-foreground">{imovel.construtora}</p>
                </div>
                <p className="text-sm my-1">
                    Total de <b className="text-foreground">{imovel.unidadesTotal}</b> unidades,
                    <b className={imovel.unidadesDisponiveis > 0 ? 'text-green-500' : 'text-red-500'}> {imovel.unidadesDisponiveis > 0 ? imovel.unidadesDisponiveis : 'nenhuma'}</b> disponível,
                    <b className="text-foreground"> {imovel.unidadesTotal - imovel.unidadesDisponiveis}</b> vendidas
                </p>
                <div className="border-t my-3"></div>
                <div className="text-sm space-y-1">
                    <p><b>Quartos:</b> {imovel.quartos}</p>
                    <p><b>Área (m²):</b> {imovel.area.toFixed(1).replace('.', ',')}</p>
                    <p><b>Valor (R$):</b> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(imovel.preco)}</p>
                    <p><b>VGV Total (R$):</b> {imovel.vgv}</p>
                    <p><b>Categoria:</b> {imovel.categoria}</p>
                    <p><b>Estágio:</b> {imovel.estagio}</p>
                </div>
                <div className="mt-4">
                    <a
                        href={imovel.urlFicha}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center px-4 py-2 bg-primary text-primary-foreground font-bold rounded-sm hover:bg-primary/90 transition-colors no-underline"
                    >
                        Ficha do Empreendimento
                    </a>
                </div>
            </div>
        </>
    );

    if (loadError) return <div>Erro ao carregar o mapa. Tente mais tarde.</div>;
    if (!isLoaded) return <LoadingIndicator />;

    return (
        <div className="relative">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={6}
                options={mapOptions}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={handleClosePopup}
            >
                <MarkerClustererF>
                    {(clusterer) => (
                        <>
                            {imoveis?.map((imovel) => {
                                const [lat, lng] = imovel.localizacao.split(',').map(Number);
                                if (isNaN(lat) || isNaN(lng)) return null;

                                return (
                                    <MarkerF
                                        key={imovel.codigoImovel}
                                        position={{ lat, lng }}
                                        onClick={(e) => {
                                            e.domEvent.stopPropagation();
                                            setSelectedImovel(imovel)
                                        }}
                                        icon={getIcon(imovel.tipo)}
                                        clusterer={clusterer}
                                    />
                                );
                            })}
                        </>
                    )}
                </MarkerClustererF>

                {selectedImovel && (
                    isDesktop ? (
                        // --- VERSÃO DESKTOP ---
                        <OverlayView
                            position={{
                                lat: parseFloat(selectedImovel.localizacao.split(',')[0]),
                                lng: parseFloat(selectedImovel.localizacao.split(',')[1])
                            }}
                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        >
                            <div style={{ transform: 'translate(-50%, calc(-100% - 12px))' }}>
                                <div className="relative font-sans bg-background text-foreground rounded-lg shadow-2xl w-72 border border-border flex flex-col max-h-[90vh]">
                                    <ImovelCard imovel={selectedImovel} onClose={handleClosePopup} />
                                </div>
                            </div>
                        </OverlayView>
                    ) : (
                        // --- VERSÃO MOBILE ---
                        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={handleClosePopup}>
                            <div className="relative font-sans bg-background text-foreground rounded-lg shadow-2xl w-full max-w-sm border border-border flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                                <ImovelCard imovel={selectedImovel} onClose={handleClosePopup} />
                            </div>
                        </div>
                    )
                )}

            </GoogleMap>

            <div className="absolute bottom-6 right-6 flex flex-col space-y-2">
                <button
                    onClick={handleZoomIn}
                    className="w-10 h-10 flex items-center justify-center bg-background text-foreground rounded-sm shadow-lg border border-border hover:bg-accent"
                    aria-label="Aumentar zoom"
                >
                    <Plus size={20} />
                </button>
                <button
                    onClick={handleZoomOut}
                    className="w-10 h-10 flex items-center justify-center bg-background text-foreground rounded-sm shadow-lg border border-border hover:bg-accent"
                    aria-label="Diminuir zoom"
                >
                    <Minus size={20} />
                </button>
            </div>
        </div>
    );
};

export default React.memo(Map);