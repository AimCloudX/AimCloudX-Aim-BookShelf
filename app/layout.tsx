import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Link from 'next/link'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'BookShelf',
  description: 'BookShelf for Aimnext',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">書籍管理アプリ</h1>

          {/* タブナビゲーション */}
          <nav className="flex gap-4 mb-4">
            <Link href={'/'}>本棚</Link>
            <Link href={'/search'}>書籍検索</Link>
          </nav>
          {children}
        </div>
      </body>
    </html>
  )
}
