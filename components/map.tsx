"use client";

import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, OverlayView, MarkerClustererF } from '@react-google-maps/api';
import { useTheme } from 'next-themes';
import useSWR from 'swr';
import { Imovel } from '../types/api';
import { X, Plus, Minus } from 'lucide-react';
import { LoadingIndicator } from './loading-indicator';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const houseIconSvg = (color: string) => `
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
`;

const buildingIconSvg = (color: string) => `
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" />
    <path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" />
    <path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" />
  </svg>
`;

const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100vh'
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
        googleMapsApiKey: process.env.NEXT_PUBLIC_Maps_API_KEY || "",
        libraries: ['marker'],
    });

    const [selectedImovel, setSelectedImovel] = useState<Imovel | null>(null);

    const { data: imoveis } = useSWR<Imovel[]>(
        `/api/imoveis?termo=${searchTerm}`,
        fetcher
    );

    const mapOptions = {
        disableDefaultUI: true,
        // O zoomControl agora é falso porque vamos criar os nossos próprios botões
        zoomControl: false,
        styles: theme === 'dark' ? darkMapStyles : lightMapStyles,
    };

    const iconColor = theme === 'dark' ? '#FFA500' : '#fa581a';

    const getIcon = (tipo: 'casa' | 'empreendimento') => {
        const svg = tipo === 'casa' ? houseIconSvg(iconColor) : buildingIconSvg(iconColor);
        return {
            url: 'data:image/svg+xml;base64,' + btoa(svg),
            scaledSize: new window.google.maps.Size(36, 36)
        };
    };

    const onLoad = useCallback(function callback(mapInstance: google.maps.Map) {
        setMap(mapInstance);
    }, []);

    const onUnmount = useCallback(function callback() {
        setMap(null);
    }, []);

    // --- Funções para controlar o zoom ---
    const handleZoomIn = () => {
        if (map) {
            map.setZoom(map.getZoom()! + 1);
        }
    };

    const handleZoomOut = () => {
        if (map) {
            map.setZoom(map.getZoom()! - 1);
        }
    };

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
                                        onClick={() => setSelectedImovel(imovel)}
                                        icon={getIcon(imovel.tipo)}
                                        clusterer={clusterer}
                                    />
                                );
                            })}
                        </>
                    )}
                </MarkerClustererF>

                {selectedImovel && (
                    <OverlayView
                        position={{
                            lat: parseFloat(selectedImovel.localizacao.split(',')[0]),
                            lng: parseFloat(selectedImovel.localizacao.split(',')[1])
                        }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                        <div style={{ transform: 'translate(-50%, -110%)' }}>
                            <div className="relative font-sans bg-background text-foreground rounded-sm shadow-2xl w-72 overflow-hidden border border-border">
                                <button
                                    onClick={() => setSelectedImovel(null)}
                                    className="absolute top-2 right-2 p-1 rounded-sm bg-background/50 text-foreground/70 hover:bg-background hover:text-foreground transition-all"
                                    aria-label="Fechar popup"
                                >
                                    <X size={16} />
                                </button>
                                {selectedImovel.urlFotoDestaque && (
                                    <img src={selectedImovel.urlFotoDestaque} alt={selectedImovel.nomeImovel} className="w-full h-32 object-cover" />
                                )}
                                <div className="p-4">
                                    <div className="mb-3">
                                        <h3 className="font-bold text-lg leading-tight">{selectedImovel.nomeImovel.toUpperCase()}</h3>
                                        <p className="text-sm text-muted-foreground">{selectedImovel.construtora}</p>
                                    </div>
                                    <p className="text-sm my-1">
                                        Total de <b className="text-foreground">{selectedImovel.unidadesTotal}</b> unidades,
                                        <b className={selectedImovel.unidadesDisponiveis > 0 ? 'text-green-500' : 'text-red-500'}> {selectedImovel.unidadesDisponiveis > 0 ? selectedImovel.unidadesDisponiveis : 'nenhuma'}</b> disponível,
                                        <b className="text-foreground"> {selectedImovel.unidadesTotal - selectedImovel.unidadesDisponiveis}</b> vendidas
                                    </p>
                                    <div className="border-t my-3"></div>
                                    <div className="text-sm space-y-1">
                                        <p><b>Quartos:</b> {selectedImovel.quartos}</p>
                                        <p><b>Área (m²):</b> {selectedImovel.area.toFixed(1).replace('.', ',')}</p>
                                        <p><b>Valor (R$):</b> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedImovel.preco)}</p>
                                        <p><b>VGV Total (R$):</b> {selectedImovel.vgv}</p>
                                        <p><b>Categoria:</b> {selectedImovel.categoria}</p>
                                        <p><b>Estágio:</b> {selectedImovel.estagio}</p>
                                    </div>
                                    <div className="mt-4">
                                        <a
                                            href={selectedImovel.urlFicha}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full text-center px-4 py-2 bg-primary text-primary-foreground font-bold rounded-sm hover:bg-primary/90 transition-colors no-underline"
                                        >
                                            Ficha do Empreendimento
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </OverlayView>
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