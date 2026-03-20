'use client'

import { useEffect } from 'react'
import { initAnalytics } from '@/lib/analytics'
import { AuthProvider } from '@/hooks/useAuth'
import NavBar from '@/components/NavBar'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    initAnalytics()
  }, [])

  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Vecindad" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-gray-50 min-h-screen">
        <AuthProvider>
          <NavBar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
