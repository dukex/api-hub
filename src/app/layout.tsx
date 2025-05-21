import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import MainLayout from '@/components/layout/MainLayout';

const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: 'API Hub',
  description: 'A centralized platform for your company\'s APIs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className={`antialiased font-sans`}>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
