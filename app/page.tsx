"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { SearchBar } from '../components/search-bar';
import { ThemeToggle } from '../components/theme-toggle';

const MapWithNoSSR = dynamic(() => import('../components/map'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-screen w-screen bg-muted">
            <p className="text-muted-foreground">A carregar o mapa...</p>
        </div>
    ),
});

export default function HomePage() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="relative h-screen w-screen">
            {/* Container para a barra de pesquisa e o botão de tema */}
            <div className="absolute top-0 left-0 right-0 z-10 p-4">
                <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto">
                    <div className="flex-grow">
                        <SearchBar onSearch={setSearchTerm} />
                    </div>
                    <div className="flex-shrink-0">
                        <ThemeToggle />
                    </div>
                </div>
            </div>

            <main>
                <MapWithNoSSR searchTerm={searchTerm} />
            </main>
        </div>
    );
}