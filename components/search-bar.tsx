"use client";

import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    onSearch: (term: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
    const [term, setTerm] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(term);
    };

    return (
        <div className="w-full">
            <form
                onSubmit={handleSearch}
                className="flex w-full items-center rounded-sm bg-background shadow-lg border border-border transition-all duration-300 focus-within:ring-2 focus-within:ring-ring focus-within:shadow-xl"
            >
                <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Buscar por bairro, cidade ou código..."
                    className="h-12 w-full flex-grow appearance-none bg-transparent px-6 text-foreground placeholder-muted-foreground focus:outline-none"
                />
                <button
                    type="submit"
                    className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
                    aria-label="Buscar"
                >
                    <Search size={20} />
                </button>
            </form>
        </div>
    );
}