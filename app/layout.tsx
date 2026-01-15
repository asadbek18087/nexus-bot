import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import CopilotWidget from '@/components/copilot-widget'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nexus - AI Super App 🚀',
  description: 'Sun\'iy intellekt yordamida bilim olish va ko\'ngilochar platforma. Testlar, prezentatsiyalar, kinolar va kitoblar bir joyda!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-white`}>
        {children}
        <CopilotWidget />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0f172a',
              color: '#fff',
              border: '1px solid rgba(148, 163, 184, 0.35)',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
