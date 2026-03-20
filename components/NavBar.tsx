'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function NavBar() {
  const { user, loading, needsRegistration } = useAuth()

  const showProfileLink = !loading && user && !needsRegistration

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-5 py-3.5 bg-primary shadow-sm">
      <Link href="/" className="flex items-center gap-2">
        {/* Pin icon — logo placeholder */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
            fill="#00875A"
          />
          <circle cx="12" cy="9" r="2.5" fill="white" />
        </svg>
        <span className="text-lg font-extrabold text-white tracking-tight">Vecindad</span>
      </Link>

      <div className="flex items-center gap-4">
        {showProfileLink && (
          <Link
            href="/profile"
            className="text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            Mi perfil
          </Link>
        )}
        {!loading && !user && !needsRegistration && (
          <Link
            href="/auth"
            className="text-sm font-semibold bg-white text-primary px-4 py-1.5 rounded-lg hover:bg-cream transition-colors"
          >
            Ingresar
          </Link>
        )}
      </div>
    </nav>
  )
}
