"use client";

import { useState } from 'react';
import { Menu, X, Building } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import packageJson from '../package.json';

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

    return (
        <>
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
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsAboutModalOpen(true);
                                            setIsMenuOpen(false);
                                        }}
                                        className="block px-4 py-2 text-sm text-foreground hover:bg-accent"
                                    >
                                        Sobre nós
                                    </a>
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

            {/* Modal "Sobre nós" */}
            {isAboutModalOpen && (
                <div
                    className="fixed inset-0 z-30 flex items-center justify-center bg-black/60"
                    onClick={() => setIsAboutModalOpen(false)}
                >
                    <div
                        className="bg-background rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Sobre nós</h2>
                            <button
                                onClick={() => setIsAboutModalOpen(false)}
                                className="p-1 rounded-md hover:bg-accent"
                                aria-label="Fechar modal"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-4 text-muted-foreground">
                            <p>
                                A Real Estate AI Planner LTDA é uma empresa de tecnologia focada em revolucionar o mercado imobiliário através de soluções inovadoras de inteligência artificial.
                            </p>
                            <p>
                                Nosso portal, o RE.AI.s LISTING, conecta compradores e vendedores de imóveis de forma inteligente, utilizando algoritmos avançados para otimizar a busca e a recomendação de propriedades.
                            </p>
                            <p className="text-sm pt-4 border-t border-border mt-4">
                                Versão do Listing: {packageJson.version}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}