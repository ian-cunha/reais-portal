"use client";

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '../components/navbar';
import { SearchBar } from '../components/search-bar';
import { Footer } from '../components/footer';
import { LoadingIndicator } from '../components/loading-indicator';
import { FilterButtons } from '../components/filter-buttons';

const MapWithNoSSR = dynamic(() => import('../components/map'), {
    ssr: false,
    loading: () => <LoadingIndicator />,
});

type Coordinates = {
    lat: number;
    lng: number;
};

interface Suggestion {
    display_name: string;
    lat: string;
    lon: string;
    type: string;
}

export default function HomePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [mapCenter, setMapCenter] = useState<Coordinates>({ lat: -5.8, lng: -39.0 });
    const [mapZoom, setMapZoom] = useState(6);

    // Função que FILTRA os imóveis
    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    // Função que MOVE o mapa com zoom dinâmico
    const panToLocation = (suggestion: Suggestion) => {
        let zoomLevel = 13;

        if (suggestion.type === 'state' || suggestion.type === 'administrative') {
            zoomLevel = 8;
        } else if (suggestion.type === 'city' || suggestion.type === 'town' || suggestion.type === 'village') {
            zoomLevel = 13;
        } else if (suggestion.type === 'suburb' || suggestion.type === 'neighbourhood') {
            zoomLevel = 15;
        }

        setMapCenter({
            lat: parseFloat(suggestion.lat),
            lng: parseFloat(suggestion.lon),
        });
        setMapZoom(zoomLevel);
    };

    return (
        <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
            <Navbar />

            <main className="relative flex-grow">
                <Suspense fallback={<LoadingIndicator />}>
                    <MapWithNoSSR searchTerm={searchTerm} center={mapCenter} zoom={mapZoom} />
                </Suspense>

                <div className="absolute top-0 left-0 right-0 z-10 p-4 pointer-events-none">
                    <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-2 pointer-events-auto">
                        <div className="w-full flex items-center gap-4">
                            <div className="flex-grow">
                                <SearchBar
                                    onSearch={handleSearch}
                                    onSuggestionSelect={panToLocation}
                                />
                            </div>
                        </div>
                        <FilterButtons />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}