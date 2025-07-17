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
        <form
            onSubmit={handleSearch}
            className="flex w-full max-w-lg mx-auto bg-white rounded-full shadow-lg"
        >
            <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Buscar por bairro, cidade, código..."
                className="w-full px-6 py-3 text-gray-700 rounded-l-full focus:outline-none"
            />
            <button
                type="submit"
                className="px-6 py-3 text-white bg-blue-600 rounded-r-full hover:bg-blue-700 focus:outline-none"
            >
                <Search size={20} />
            </button>
        </form>
    );
}