import { Home } from 'lucide-react';

export function LoadingIndicator() {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-background">
            <div className="relative flex items-center justify-center w-24 h-24">
                {/* Ícone central */}
                <Home className="w-12 h-12 text-primary opacity-90" />

                {/* Anel a girar */}
                <div
                    className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-primary border-r-primary border-b-primary/20 border-l-primary/20 animate-spin-around"
                    aria-hidden="true"
                />
            </div>
            <p className="mt-4 text-lg font-medium text-muted-foreground animate-pulse">
                RE.AI.s Portal
            </p>
        </div>
    );
}