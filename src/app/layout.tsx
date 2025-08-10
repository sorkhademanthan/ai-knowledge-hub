// src/app/layout.tsx
import './globals.css'; // This line is crucial
import { Inter } from 'next/font/google'; // Example font import

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Knowledge Hub',
  description: 'AI-Powered Real-Time Knowledge Hub',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}