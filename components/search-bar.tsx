"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, Loader, MapPin } from 'lucide-react';

interface Suggestion {
    display_name: string;
    lat: string;
    lon: string;
    type: string;
}

interface SearchBarProps {
    onSearch: (term: string) => void;
    onSuggestionSelect: (suggestion: Suggestion) => void;
}

export function SearchBar({ onSearch, onSuggestionSelect }: SearchBarProps) {
    const [term, setTerm] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (term.trim().length < 3) {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(term)}`);
                const data = await response.json();
                setSuggestions(data.slice(0, 5));
            } catch (error) {
                console.error("Erro ao buscar sugestões:", error);
                setSuggestions([]);
            }
            setIsLoading(false);
        };

        const debounceTimer = setTimeout(() => {
            fetchSuggestions();
        }, 400);

        return () => clearTimeout(debounceTimer);
    }, [term]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setSuggestions([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(term);
        setSuggestions([]);
        setActiveIndex(-1);
    };

    const handleSuggestionClick = (suggestion: Suggestion) => {
        setTerm(suggestion.display_name.split(',')[0]);
        onSuggestionSelect(suggestion);
        setSuggestions([]);
        setActiveIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && suggestions[activeIndex]) {
                handleSuggestionClick(suggestions[activeIndex]);
            } else {
                handleFormSubmit(e);
            }
        } else if (e.key === 'Escape') {
            setSuggestions([]);
        }
    };

    return (
        <div className="relative w-full transition-opacity duration-300 opacity-80 hover:opacity-100 focus-within:opacity-100" ref={searchRef}>
            <form
                onSubmit={handleFormSubmit}
                className="flex w-full items-center rounded-sm bg-background shadow-lg border border-border transition-all duration-300 focus-within:ring-2 focus-within:ring-ring focus-within:shadow-xl"
            >
                <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Navegue para um local ou pesquise imóveis..."
                    className="h-12 w-full flex-grow appearance-none bg-transparent px-6 text-foreground placeholder-muted-foreground focus:outline-none"
                    autoComplete="off"
                />
                <div className="flex h-12 w-12 items-center justify-center">
                    {isLoading ? (
                        <Loader className="animate-spin text-muted-foreground" size={20} />
                    ) : (
                        <button
                            type="submit"
                            className="flex h-full w-full items-center justify-center rounded-sm bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
                            aria-label="Buscar"
                        >
                            <Search size={20} />
                        </button>
                    )}
                </div>
            </form>

            {suggestions.length > 0 && (
                <ul className="absolute z-20 mt-1 w-full rounded-md bg-background shadow-lg border border-border max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={suggestion.display_name}
                            onClick={() => handleSuggestionClick(suggestion)}
                            onMouseOver={() => setActiveIndex(index)}
                            className={`flex items-center cursor-pointer px-4 py-2 text-sm text-foreground hover:bg-accent ${index === activeIndex ? 'bg-accent' : ''}`}
                        >
                            <MapPin size={16} className="mr-3 text-muted-foreground" />
                            <span>{suggestion.display_name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}