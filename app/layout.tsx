import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "../components/theme-provider"; // Importar o ThemeProvider
import "../styles/globals.css"; // A linha mais importante!

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Reais Portal",
    description: "Encontre o imóvel dos seus sonhos",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}