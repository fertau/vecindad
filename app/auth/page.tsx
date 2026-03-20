'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Timestamp } from 'firebase/firestore'
import { useAuth } from '@/hooks/useAuth'
import { signInWithGoogle } from '@/lib/auth'
import { createUser } from '@/lib/firestore'
import { recomputeTrustFields } from '@/lib/trust'
import { trackEvent, identifyUser } from '@/lib/analytics'
import { NEIGHBORHOOD_LABELS, NEIGHBORHOODS_SORTED } from '@/constants/neighborhoods'
import { User, Neighborhood, Verification } from '@/types'

export default function AuthPage() {
  const router = useRouter()
  const { user, firebaseUser, loading, needsRegistration, refreshUser } = useAuth()

  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [neighborhood, setNeighborhood] = useState<Neighborhood | ''>('')
  const [lotNumber, setLotNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Pre-fill name from Google profile
  useEffect(() => {
    if (firebaseUser?.displayName && !name) {
      setName(firebaseUser.displayName)
    }
  }, [firebaseUser?.displayName, name])

  // Redirect if already registered
  useEffect(() => {
    if (!loading && user && !needsRegistration) {
      router.replace('/')
    }
  }, [loading, user, needsRegistration, router])

  async function handleGoogleSignIn() {
    setError('')
    try {
      await signInWithGoogle()
    } catch (err: unknown) {
      const firebaseError = err as { code?: string }
      if (firebaseError.code === 'auth/popup-closed-by-user') return
      setError('Error al iniciar sesion. Intenta de nuevo.')
      console.error('Sign-in error:', err)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!firebaseUser || !neighborhood) return

    const whatsappClean = whatsapp.replace(/\D/g, '')
    if (whatsappClean.length < 10) {
      setError('El WhatsApp debe tener al menos 10 digitos.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const now = Timestamp.now()

      const verifications: Verification[] = [
        {
          method: 'neighborhood_declaration',
          status: 'pending',
          createdAt: now,
        },
        {
          method: 'oauth_google',
          status: 'verified',
          verifiedAt: now,
          createdAt: now,
        },
      ]

      const { trustScore, trustLevel } = recomputeTrustFields(verifications, 0)

      const newUser: User = {
        uid: firebaseUser.uid,
        name: name.trim(),
        email: firebaseUser.email ?? '',
        whatsapp: whatsappClean,
        neighborhood: neighborhood as Neighborhood,
        lotNumber: lotNumber.trim(),
        status: 'pending',
        trustLevel,
        trustScore,
        validationCount: 0,
        verifications,
        connectedProviders: ['google'],
        createdAt: now,
        updatedAt: now,
      }

      await createUser(newUser)

      trackEvent('user_registered', { neighborhood, trustScore })
      trackEvent('oauth_connected', { provider: 'google' })
      identifyUser(firebaseUser.uid, {
        name: newUser.name,
        neighborhood,
        trustLevel,
      })

      await refreshUser()
      router.push('/')
    } catch (err) {
      console.error('Registration error:', err)
      setError('Error al registrar. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Not logged in → show Google button
  if (!firebaseUser) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[80vh] px-5">
        <div className="w-full max-w-sm text-center">
          {/* Logo */}
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

          <h1 className="text-3xl font-extrabold text-primary mb-2">Vecindad</h1>
          <p className="text-primary/50 font-medium mb-10">
            El marketplace de tu barrio
          </p>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white border border-cream-dark rounded-xl px-4 py-3.5 text-primary font-semibold hover:shadow-md transition-all shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Ingresar con Google
          </button>

          {error && (
            <p className="mt-4 text-danger text-sm font-medium">{error}</p>
          )}

          <p className="mt-8 text-xs text-primary/30">
            Solo para vecinos de Nordelta
          </p>
        </div>
      </main>
    )
  }

  // Logged in but needs registration → show form
  if (needsRegistration) {
    return (
      <main className="min-h-screen px-5 py-8">
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-2xl font-extrabold text-primary mb-1">Completa tu perfil</h1>
          <p className="text-primary/50 mb-8">
            Para usar Vecindad necesitamos saber de que barrio sos.
          </p>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-primary mb-1.5">
                Nombre
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-cream-dark bg-white px-4 py-3 text-primary placeholder:text-primary/30"
              />
            </div>

            <div>
              <label htmlFor="whatsapp" className="block text-sm font-semibold text-primary mb-1.5">
                WhatsApp
              </label>
              <input
                id="whatsapp"
                type="tel"
                required
                placeholder="1155667788"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                className="w-full rounded-xl border border-cream-dark bg-white px-4 py-3 text-primary placeholder:text-primary/30"
              />
              <p className="mt-1.5 text-xs text-primary/30">Solo numeros, sin +54 ni guiones</p>
            </div>

            <div>
              <label htmlFor="neighborhood" className="block text-sm font-semibold text-primary mb-1.5">
                Barrio
              </label>
              <select
                id="neighborhood"
                required
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value as Neighborhood)}
                className="w-full rounded-xl border border-cream-dark bg-white px-4 py-3 text-primary"
              >
                <option value="">Selecciona tu barrio</option>
                {NEIGHBORHOODS_SORTED.map((key) => (
                  <option key={key} value={key}>
                    {NEIGHBORHOOD_LABELS[key]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="lotNumber" className="block text-sm font-semibold text-primary mb-1.5">
                Lote / Casa
              </label>
              <input
                id="lotNumber"
                type="text"
                required
                placeholder="Lote 42, Casa 7B, etc."
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                className="w-full rounded-xl border border-cream-dark bg-white px-4 py-3 text-primary placeholder:text-primary/30"
              />
            </div>

            {error && <p className="text-danger text-sm font-medium">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white font-semibold rounded-xl px-4 py-3.5 hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 mt-2"
            >
              {submitting ? 'Registrando...' : 'Completar registro'}
            </button>
          </form>
        </div>
      </main>
    )
  }

  // Logged in with user → redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
