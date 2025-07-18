"use client";

import { useState } from 'react';
import { Menu, X, Building } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="relative z-20 w-full bg-background shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between p-4">

                {/* Botão do Menu para todas as resoluções */}
                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="rounded-md p-2 text-foreground hover:bg-accent"
                        aria-label="Abrir menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Menu Dropdown */}
                    {isMenuOpen && (
                        <div className="absolute left-0 mt-2 w-48 origin-top-left rounded-md bg-background shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                                <a href="#" className="block px-4 py-2 text-sm text-foreground hover:bg-accent">Sobre nós</a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Building className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold tracking-tighter text-foreground">
                        RE.AI.s LISTING
                    </span>
                </div>

                {/* Botão de Lihght e Dark Mode */}
                <div className="flex-shrink-0">
                    <ThemeToggle />
                </div>

            </div>
        </nav>
    );
}