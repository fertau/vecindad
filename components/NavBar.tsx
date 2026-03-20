'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function NavBar() {
  const { user, loading, needsRegistration } = useAuth()

  const showProfileLink = !loading && user && !needsRegistration

  return (
    <nav className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
      <Link href="/" className="text-lg font-bold text-gray-900">
        Vecindad
      </Link>
      {showProfileLink && (
        <Link
          href="/profile"
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Mi perfil
        </Link>
      )}
      {!loading && !user && !needsRegistration && (
        <Link
          href="/auth"
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          Ingresar
        </Link>
      )}
    </nav>
  )
}
