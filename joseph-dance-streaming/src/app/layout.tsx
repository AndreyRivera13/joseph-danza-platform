import './globals.css';
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Providers from './providers';

export const metadata = {
  title: 'Joseph Danza',
  description: 'Plataforma de video de danzas - Joseph Danza'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <Navbar />
          <main className="container py-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}