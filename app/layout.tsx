import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Tarih Muhabiri - Tarih Dersi Birincil Belge & Gazete Atölyesi',
  description: 'Tarih dersleri için birincil belgelere dayalı röportaj, 1919 dönemi gazete sayfası ve çift sesli podcast üreten eğitim aracı.',
  openGraph: {
    title: 'Tarih Muhabiri - Tarih Dersi Birincil Belge & Gazete Atölyesi',
    description: 'Tarih dersleri için birincil belgelere dayalı röportaj, 1919 dönemi gazete sayfası ve çift sesli podcast üreten eğitim aracı.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tarih Muhabiri - Tarih Dersi Birincil Belge & Gazete Atölyesi',
    description: 'Tarih dersleri için birincil belgelere dayalı röportaj, 1919 dönemi gazete sayfası ve çift sesli podcast üreten eğitim aracı.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="tr">
      <body suppressHydrationWarning className="min-h-screen bg-[#fcfaf7] text-[#2c2620] antialiased">
        {children}
      </body>
    </html>
  );
}
