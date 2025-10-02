import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next App',
  description: 'Aplicación creada con Next.js, TailwindCSS y shadcn/ui',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full bg-background text-foreground">
      <body className={`${inter.className} min-h-full`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
