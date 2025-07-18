"use client";

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '../components/navbar';
import { SearchBar } from '../components/search-bar';
import { ThemeToggle } from '../components/theme-toggle';
import { Footer } from '../components/footer';
import { LoadingIndicator } from '../components/loading-indicator';

const MapWithNoSSR = dynamic(() => import('../components/map'), {
    ssr: false,
    loading: () => <LoadingIndicator />,
});

export default function HomePage() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
            <Navbar />

            <main className="relative flex-grow">
                <Suspense fallback={<LoadingIndicator />}>
                    <MapWithNoSSR searchTerm={searchTerm} />
                </Suspense>

                {/* Barra de pesquisa flutuante sobre o mapa */}
                <div className="absolute top-0 left-0 right-0 z-10 p-4 pointer-events-none">
                    <div className="mx-auto flex max-w-xl items-center justify-center gap-4 pointer-events-auto">
                        <div className="flex-grow">
                            <SearchBar onSearch={setSearchTerm} />
                        </div>
                        <div className="flex-shrink-0">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}