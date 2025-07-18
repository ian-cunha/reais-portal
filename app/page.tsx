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

export default function HomePage() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
            <Navbar />

            <main className="relative flex-grow">
                <Suspense fallback={<LoadingIndicator />}>
                    <MapWithNoSSR searchTerm={searchTerm} />
                </Suspense>

                {/* Conteúdo flutuante sobre o mapa */}
                <div className="absolute top-0 left-0 right-0 z-10 p-4 pointer-events-none">
                    <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-2 pointer-events-auto">
                        <div className="w-full flex items-center gap-4">
                            <div className="flex-grow">
                                <SearchBar onSearch={setSearchTerm} />
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