'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function NavBar() {
  const { user, loading, needsRegistration, isAdmin } = useAuth()
  const pathname = usePathname()

  const isLoggedIn = !loading && user && !needsRegistration
  const isGuest = !loading && !user && !needsRegistration

  return (
    <>
      {/* ─── Top App Bar ─── */}
      <header className="sticky top-0 z-50 bg-surface">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              location_on
            </span>
            <span className="text-2xl font-black text-primary tracking-tight">
              Vecindad
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm uppercase tracking-wider font-semibold transition-colors px-3 py-1 rounded-full ${
                pathname === '/'
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              Home
            </Link>
            <Link
              href="/feed"
              className={`text-sm uppercase tracking-wider font-semibold transition-colors px-3 py-1 rounded-full ${
                pathname === '/feed'
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              Explorar
            </Link>
            {isLoggedIn && (
              <Link
                href="/profile"
                className={`text-sm uppercase tracking-wider font-semibold transition-colors px-3 py-1 rounded-full ${
                  pathname === '/profile'
                    ? 'text-primary'
                    : 'text-on-surface-variant hover:bg-surface-container-highest'
                }`}
              >
                Mi Perfil
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                className={`text-sm uppercase tracking-wider font-semibold transition-colors px-3 py-1 rounded-full ${
                  pathname === '/admin'
                    ? 'text-primary'
                    : 'text-on-surface-variant hover:bg-surface-container-highest'
                }`}
              >
                Admin
              </Link>
            )}
            {isGuest && (
              <Link
                href="/auth"
                className="bg-signature-gradient text-white px-6 py-2 rounded-full font-bold active:scale-95 duration-150"
              >
                Ingresar
              </Link>
            )}
            {isLoggedIn && (
              <Link
                href="/publish"
                className="bg-signature-gradient text-white px-6 py-2 rounded-full font-bold active:scale-95 duration-150"
              >
                Publicar
              </Link>
            )}
          </nav>

          {/* Mobile: search icon */}
          <div className="flex items-center gap-4 md:hidden">
            <span className="material-symbols-outlined text-primary">search</span>
          </div>
        </div>
      </header>

      {/* ─── Bottom Nav Bar (Mobile Only) ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface-bright/80 backdrop-blur-xl border-t border-outline-variant/15 shadow-[0_-4px_24px_rgba(28,28,23,0.06)] px-4 pb-6 pt-3 flex justify-around items-center rounded-t-[2rem]">
        <BottomTab href="/" icon="home" label="Home" active={pathname === '/'} />
        <BottomTab href="/feed" icon="grid_view" label="Explorar" active={pathname === '/feed'} />
        {isLoggedIn ? (
          <>
            <BottomTab href="/publish" icon="notifications" label="Alertas" active={pathname === '/publish'} />
            <BottomTab href="/profile" icon="person" label="Perfil" active={pathname === '/profile'} />
          </>
        ) : (
          <BottomTab href="/auth" icon="person" label="Ingresar" active={pathname === '/auth'} />
        )}
      </nav>
    </>
  )
}

function BottomTab({
  href,
  icon,
  label,
  active,
}: {
  href: string
  icon: string
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center px-5 py-2 transition-transform duration-200 ${
        active
          ? 'bg-primary text-white rounded-full translate-y-[-2px]'
          : 'text-on-surface-variant hover:text-primary'
      }`}
    >
      <span
        className="material-symbols-outlined"
        style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
      >
        {icon}
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-wider">
        {label}
      </span>
    </Link>
  )
}
