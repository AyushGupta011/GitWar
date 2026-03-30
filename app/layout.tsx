import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'GitWars — Battle of the Repos',
  description: 'Put any two GitHub repositories in an epic city battle. Stars, commits, and code quality determine which city rises.',
  openGraph: {
    title: 'GitWars — Battle of the Repos',
    description: 'Put any two GitHub repos in battle. Watch cities rise and fall.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} bg-war-dark text-white antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
