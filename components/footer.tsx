import { Instagram, Linkedin } from 'lucide-react';
import packageJson from '../package.json';

export function Footer() {
    return (
        <footer className="w-full bg-background p-4 shadow-inner">
            <div className="mx-auto flex max-w-7xl items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                    <span>© {new Date().getFullYear()} Real Estate AI Planner LTDA</span>
                    <span>-</span>
                    <span>v{packageJson.version}</span>
                </div>
                <div className="flex items-center gap-4">
                    <a href="https://www.instagram.com/realestateaiplanner/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-primary">
                        <Instagram size={16} />
                    </a>
                    <a href="https://www.linkedin.com/company/real-estate-ai-planner" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-primary">
                        <Linkedin size={16} />
                    </a>
                </div>
            </div>
        </footer>
    );
}