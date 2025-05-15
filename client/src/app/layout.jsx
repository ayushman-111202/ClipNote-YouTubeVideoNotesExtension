import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import ClientProvider from '@/components/ClientProvider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'ClipNote',
  description: 'Take timestamped notes while watching YouTube videos',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-gray-100 dark:bg-gray-900`}>
        <ClientProvider>
          <main className="min-h-screen">
            {children}
          </main>
          <Toaster position="top-center" />
        </ClientProvider>
      </body>
    </html>
  )
}
