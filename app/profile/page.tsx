'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from '@/lib/auth'
import { NEIGHBORHOOD_LABELS } from '@/constants/neighborhoods'
import { TrustLevel, VerificationMethod } from '@/types'

const TRUST_LEVEL_CONFIG: Record<TrustLevel, { label: string; bg: string; text: string; bar: string }> = {
  unverified: { label: 'Sin verificar', bg: 'bg-gray-100',       text: 'text-gray-500',       bar: 'bg-gray-400' },
  basic:      { label: 'Basico',        bg: 'bg-amber-50',       text: 'text-amber-700',      bar: 'bg-amber-400' },
  verified:   { label: 'Verificado',    bg: 'bg-primary/10',     text: 'text-primary',        bar: 'bg-primary' },
  trusted:    { label: 'De Confianza',  bg: 'bg-accent/40',      text: 'text-secondary-dark', bar: 'bg-secondary' },
}

const VERIFICATION_LABELS: Record<VerificationMethod, string> = {
  neighborhood_declaration: 'Barrio declarado',
  dni:                      'DNI verificado',
  service_bill:             'Boleta de servicio',
  resident_card:            'Carnet de residente',
  oauth_google:             'Google conectado',
  oauth_facebook:           'Facebook conectado',
  oauth_instagram:          'Instagram conectado',
  peer_vouching:            'Aval de vecino',
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth')
    }
  }, [loading, user, router])

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const trustConfig = TRUST_LEVEL_CONFIG[user.trustLevel]

  async function handleSignOut() {
    await signOut()
    router.replace('/auth')
  }

  return (
    <main className="min-h-screen px-5 py-6">
      <div className="w-full max-w-md mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-primary">{user.name}</h1>
            <p className="text-sm text-primary/40">{user.email}</p>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-xl border border-cream-dark p-5 space-y-3.5 shadow-sm">
          <InfoRow label="Barrio" value={NEIGHBORHOOD_LABELS[user.neighborhood]} />
          <InfoRow label="Lote / Casa" value={user.lotNumber} />
          <InfoRow label="WhatsApp" value={user.whatsapp} />
          <div className="flex justify-between items-center">
            <span className="text-sm text-primary/40">Estado</span>
            <span className={`text-sm font-semibold ${
              user.status === 'active' ? 'text-secondary' :
              user.status === 'pending' ? 'text-amber-600' : 'text-danger'
            }`}>
              {user.status === 'active' ? 'Activo' : user.status === 'pending' ? 'Pendiente' : 'Suspendido'}
            </span>
          </div>
        </div>

        {/* Trust Card */}
        <div className="bg-white rounded-xl border border-cream-dark p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-primary">Nivel de confianza</h2>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${trustConfig.bg} ${trustConfig.text}`}>
              {trustConfig.label}
            </span>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-primary/40">Trust score</span>
              <span className="font-bold text-primary">{user.trustScore} / 100</span>
            </div>
            <div className="w-full bg-cream-dark rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${trustConfig.bar}`}
                style={{ width: `${user.trustScore}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-primary/40">Avales recibidos</span>
            <span className="font-bold text-primary">{user.validationCount}</span>
          </div>
        </div>

        {/* Verifications Card */}
        <div className="bg-white rounded-xl border border-cream-dark p-5 shadow-sm">
          <h2 className="font-bold text-primary mb-3">Verificaciones</h2>
          <div className="space-y-2.5">
            {user.verifications.map((v, i) => (
              <div key={i} className="flex items-center justify-between text-sm py-1">
                <span className="text-primary/70">{VERIFICATION_LABELS[v.method]}</span>
                <VerificationBadge status={v.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full text-danger font-semibold border border-danger/20 rounded-xl px-4 py-3 hover:bg-danger-light transition-colors"
        >
          Cerrar sesion
        </button>
      </div>
    </main>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-primary/40">{label}</span>
      <span className="font-semibold text-primary text-sm">{value}</span>
    </div>
  )
}

function VerificationBadge({ status }: { status: string }) {
  if (status === 'verified') {
    return (
      <span className="flex items-center gap-1.5 text-xs font-semibold text-secondary bg-accent/40 px-2.5 py-0.5 rounded-full">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Verificado
      </span>
    )
  }
  if (status === 'pending') {
    return (
      <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        Pendiente
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1.5 text-xs font-semibold text-danger bg-danger-light px-2.5 py-0.5 rounded-full">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
      Rechazado
    </span>
  )
}
