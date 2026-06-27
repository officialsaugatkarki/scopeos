import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Inter, Caveat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ToastProvider } from '@/components/toast-provider'
import { CookieBanner } from '@/components/cookie-banner'
import { HelpWidget } from '@/components/help-widget'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });


export const metadata: Metadata = {
  title: 'ScopeOS - Stop Losing Money on Scope Creep',
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
    title: 'ScopeOS - Stop Losing Money on Scope Creep',
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
    <html lang="en" className={`scroll-smooth ${inter.variable} ${caveat.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased relative min-h-screen" suppressHydrationWarning>
        <div className="relative z-0">
          <ToastProvider />
          <CookieBanner />
          <HelpWidget />
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </div>
      </body>
    </html>
  )
}
