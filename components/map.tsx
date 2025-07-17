"use client";

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import useSWR from 'swr';
import { Imovel } from '../types/api';

// --- INÍCIO DA CORREÇÃO ---

// 1. Criar um ícone de casa personalizado
const houseIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#2563EB" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
    `),
    iconSize: [32, 32], // Tamanho do ícone
    iconAnchor: [16, 32], // Ponto do ícone que corresponderá à localização do marcador
    popupAnchor: [0, -32] // Ponto a partir do qual o popup deve abrir em relação ao iconAnchor
});

// 2. Corrigir o ícone padrão para o caso de o ícone da casa falhar
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// --- FIM DA CORREÇÃO ---

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface MapProps {
    searchTerm: string;
}

const Map = ({ searchTerm }: MapProps) => {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<L.FeatureGroup>(new L.FeatureGroup());

    const { data: imoveis, error } = useSWR<Imovel[]>(
        `/api/imoveis?termo=${searchTerm}`,
        fetcher
    );

    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current, {
                center: [-8.047562, -34.877022],
                zoom: 13,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(mapRef.current);

            if (mapRef.current) {
                markersRef.current.addTo(mapRef.current);
            }
        }
    }, []);

    useEffect(() => {
        if (!mapRef.current || !imoveis) return;

        markersRef.current.clearLayers();

        imoveis.forEach((imovel) => {
            const [lat, lng] = imovel.localizacao.split(',').map(Number);
            if (!isNaN(lat) && !isNaN(lng)) {
                // 3. Aplicar o ícone de casa a cada marcador
                const marker = L.marker([lat, lng], { icon: houseIcon });

                const popupContent = `
                    <div style="max-width: 250px;">
                        <h3 style="font-weight: bold; margin-bottom: 4px;">${imovel.nomeImovel}</h3>
                        <p style="font-size: 0.8rem; margin: 0;">${imovel.endereco}, ${imovel.nomeBairro}</p>
                        <p style="font-size: 1.1rem; font-weight: bold; color: #2563EB; margin-top: 8px;">
                            ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(imovel.preco)}
                        </p>
                        ${imovel.urlFotoDestaque ? `<img src="${imovel.urlFotoDestaque}" alt="${imovel.nomeImovel}" style="width: 100%; height: 120px; object-fit: cover; margin-top: 8px; border-radius: 4px;" />` : ''}
                    </div>
                `;

                marker.bindPopup(popupContent);
                markersRef.current.addLayer(marker);
            }
        });

        if (imoveis.length > 0 && markersRef.current.getLayers().length > 0) {
            mapRef.current.fitBounds(markersRef.current.getBounds(), { padding: [50, 50] });
        }

    }, [imoveis]);

    if (error) {
        return <div className="p-4 text-red-500">Falha ao carregar imóveis.</div>;
    }

    // Adicionado um estado de carregamento para melhor feedback ao usuário
    if (!imoveis) {
        return (
            <div style={{ height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Carregando imóveis no mapa...</p>
            </div>
        );
    }

    return (
        <div ref={mapContainerRef} style={{ height: '100vh', width: '100%' }} />
    );
};

export default Map;