"use client";

import { Building, Tag } from 'lucide-react';

export function FilterButtons() {
    return (
        <div className="flex items-center justify-center gap-2">
            <button className="transition-opacity duration-300 opacity-60 hover:opacity-100 focus-within:opacity-100 flex items-center justify-center h-8 px-2 text-sm font-medium transition-colors rounded-sm bg-background text-foreground hover:bg-accent border border-border shadow-sm">
                <Building className="w-4 h-4 mr-2" />
                Lançamento Imóvel
            </button>
            <button className="transition-opacity duration-300 opacity-60 hover:opacity-100 focus-within:opacity-100 flex items-center justify-center h-8 px-2 text-sm font-medium transition-colors rounded-sm bg-background text-foreground hover:bg-accent border border-border shadow-sm">
                <Tag className="w-4 h-4 mr-2" />
                Comprar Alugar
            </button>
        </div>
    );
}