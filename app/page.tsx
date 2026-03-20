'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function HomePage() {
  const { user, loading } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="px-5 pt-12 pb-16 text-center">
        <div className="max-w-lg mx-auto">
          {/* Pin icon large */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                  fill="#00875A"
                />
                <circle cx="12" cy="9" r="2.5" fill="white" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary leading-tight mb-3">
            El marketplace de tu barrio.
          </h1>
          <p className="text-lg text-primary/60 font-medium mb-2">
            Solo vecinos verificados.
          </p>
          <p className="text-sm text-primary/40 mb-8">
            Comprá y vendé con confianza entre tus vecinos de Nordelta.
          </p>

          {!loading && !user && (
            <Link
              href="/auth"
              className="inline-block bg-primary text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-primary-light transition-colors shadow-lg shadow-primary/20"
            >
              Empezar ahora
            </Link>
          )}
          {!loading && user && (
            <Link
              href="/publish"
              className="inline-block bg-secondary text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-secondary-light transition-colors shadow-lg shadow-secondary/20"
            >
              Publicar ahora
            </Link>
          )}
        </div>
      </section>

      {/* Trust Features */}
      <section className="px-5 pb-16">
        <div className="max-w-lg mx-auto">
          <h2 className="text-sm font-bold text-secondary uppercase tracking-wider mb-6 text-center">
            Por que Vecindad
          </h2>

          <div className="space-y-4">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-cream-dark">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-accent/40 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00875A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-primary mb-1">Vecinos verificados</h3>
                  <p className="text-sm text-primary/50">
                    Cada usuario declara su barrio y lote. Un admin verifica su identidad.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-cream-dark">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-accent/40 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00875A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-primary mb-1">Reputacion local</h3>
                  <p className="text-sm text-primary/50">
                    Tus vecinos te avalan. Cuantos mas avales, mayor confianza.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-cream-dark">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-accent/40 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00875A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-primary mb-1">Conexiones mutuas</h3>
                  <p className="text-sm text-primary/50">
                    Ves cuantos vecinos en comun tenes con el vendedor. Nunca quien.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feed Preview Placeholder */}
      <section className="px-5 pb-16">
        <div className="max-w-lg mx-auto">
          <h2 className="text-sm font-bold text-secondary uppercase tracking-wider mb-6 text-center">
            Lo que esta pasando en tu barrio
          </h2>

          <div className="bg-white/60 rounded-xl border-2 border-dashed border-cream-dark p-8 text-center">
            <p className="text-primary/30 font-medium text-sm">
              Proximamente: publicaciones de tus vecinos
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 py-8 text-center border-t border-cream-dark">
        <p className="text-xs text-primary/30">
          Vecindad — El marketplace de tu barrio
        </p>
      </footer>
    </div>
  )
}
