"use client";

import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { useTheme } from 'next-themes';
import useSWR from 'swr';
import { Imovel } from '../types/api';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100vh'
};

const center = {
    lat: -8.047562,
    lng: -34.877022
};

// Estilos para o mapa claro
const lightMapStyles: google.maps.MapTypeStyle[] = [
    { featureType: "poi.business", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] }
];

// Estilos para o mapa escuro
const darkMapStyles: google.maps.MapTypeStyle[] = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi.business", stylers: [{ "visibility": "off" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
    { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
    { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
    { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
];

interface MapProps {
    searchTerm: string;
}

const Map = ({ searchTerm }: MapProps) => {
    const { theme } = useTheme();
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_Maps_API_KEY || ""
    });

    const [selectedImovel, setSelectedImovel] = useState<Imovel | null>(null);

    const { data: imoveis, error: swrError } = useSWR<Imovel[]>(
        `/api/imoveis?termo=${searchTerm}`,
        fetcher
    );

    const mapOptions = {
        disableDefaultUI: true,
        zoomControl: true,
        styles: theme === 'dark' ? darkMapStyles : lightMapStyles,
    };

    if (loadError) return <div>Erro ao carregar o mapa. Verifique a sua chave de API.</div>;
    if (!isLoaded) return <div>A carregar API do mapa...</div>;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            options={mapOptions}
        >
            {imoveis?.map((imovel) => {
                const [lat, lng] = imovel.localizacao.split(',').map(Number);
                if (isNaN(lat) || isNaN(lng)) return null;

                return (
                    <MarkerF
                        key={imovel.codigoImovel}
                        position={{ lat, lng }}
                        onClick={() => setSelectedImovel(imovel)}
                        icon={{
                            url: 'data:image/svg+xml;base64,' + btoa(`
                                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="${theme === 'dark' ? '#A5B4FC' : '#1D4ED8'}" stroke="${theme === 'dark' ? '#1E293B' : 'white'}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                    <polyline points="9 22 9 12 15 12 15 22"/>
                                </svg>
                            `),
                            scaledSize: new window.google.maps.Size(36, 36)
                        }}
                    />
                );
            })}

            {selectedImovel && (
                <InfoWindowF
                    position={{
                        lat: parseFloat(selectedImovel.localizacao.split(',')[0]),
                        lng: parseFloat(selectedImovel.localizacao.split(',')[1])
                    }}
                    onCloseClick={() => setSelectedImovel(null)}
                    options={{ pixelOffset: new window.google.maps.Size(0, -38) }}
                >
                    <div className="bg-background text-foreground p-1 font-sans">
                        {selectedImovel.urlFotoDestaque && (
                            <img src={selectedImovel.urlFotoDestaque} alt={selectedImovel.nomeImovel} className="w-full h-32 object-cover rounded-t-md" />
                        )}
                        <div className="p-3">
                            <h3 className="font-bold text-base mb-1">{selectedImovel.nomeImovel}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{selectedImovel.endereco}, {selectedImovel.nomeBairro}</p>
                            <p className="text-lg font-bold text-primary">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedImovel.preco)}
                            </p>
                        </div>
                    </div>
                </InfoWindowF>
            )}
        </GoogleMap>
    );
};

export default React.memo(Map);