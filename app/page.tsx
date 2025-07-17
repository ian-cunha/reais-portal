"use client";

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { SearchBar } from '../components/search-bar';
import { ThemeToggle } from '../components/theme-toggle';
import { LoadingIndicator } from '../components/loading-indicator';

const MapWithNoSSR = dynamic(() => import('../components/map'), {
    ssr: false,
    loading: () => <LoadingIndicator />,
});

export default function HomePage() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            <header className="absolute top-0 left-0 right-0 z-10 p-4">
                <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto">
                    <div className="flex-grow">
                        <SearchBar onSearch={setSearchTerm} />
                    </div>
                    <div className="flex-shrink-0">
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            <main>
                <Suspense fallback={<LoadingIndicator />}>
                    <MapWithNoSSR searchTerm={searchTerm} />
                </Suspense>
            </main>
        </div>
    );
}