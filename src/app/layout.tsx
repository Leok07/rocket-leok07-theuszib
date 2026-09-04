import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rocket League Tracker & Telemetria 2v2',
  description: 'Tracker e analise avancada de partidas 2v2 de Rocket League com Ballchasing.com API',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-[#090a0f] text-white antialiased min-h-screen selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
