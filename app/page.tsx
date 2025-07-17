"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { SearchBar } from '../components/search-bar';

// Dynamically import the Map component with ssr disabled
const MapWithNoSSR = dynamic(() => import('../components/map'), {
    ssr: false,
    loading: () => <p>Carregando mapa...</p>,
});

export default function HomePage() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="relative h-screen w-screen">
            <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-transparent">
                <SearchBar onSearch={setSearchTerm} />
            </div>
            <MapWithNoSSR searchTerm={searchTerm} />
        </div>
    );
}