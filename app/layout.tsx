import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ToastProvider } from '@/components/toast-provider'
import { CookieBanner } from '@/components/cookie-banner'
import { HelpWidget } from '@/components/help-widget'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: 'ScopeGuard AI - Stop Losing Money on Scope Creep',
  description: 'AI-powered scope management tool for dev agencies. Turn client chaos into clear, billable tasks—automatically.',
  icons: {
    icon: [
      {
        url: '/logo.png',
        type: 'image/png',
      },
    ],
    apple: '/logo.png',
  },
  openGraph: {
    title: 'ScopeGuard AI - Stop Losing Money on Scope Creep',
    description: 'AI-powered scope management tool for dev agencies.',
    images: ['/logo.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark bg-background scroll-smooth ${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-[#050A18] text-white/90" suppressHydrationWarning>
        <ToastProvider />
        <CookieBanner />
        <HelpWidget />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
