'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from '@/lib/auth'
import { canInvite } from '@/lib/trust'
import { NEIGHBORHOOD_LABELS } from '@/constants/neighborhoods'
import { TrustLevel, VerificationMethod } from '@/types'

const TRUST_LEVEL_CONFIG: Record<TrustLevel, { label: string; bg: string; text: string; bar: string }> = {
  unverified: { label: 'Sin verificar', bg: 'bg-surface-container-highest', text: 'text-on-surface-variant', bar: 'bg-outline' },
  basic:      { label: 'Basico',        bg: 'bg-tertiary-fixed',           text: 'text-on-tertiary-fixed',  bar: 'bg-on-tertiary-container' },
  verified:   { label: 'Verificado',    bg: 'bg-primary-fixed',            text: 'text-primary',            bar: 'bg-primary' },
  trusted:    { label: 'De Confianza',  bg: 'bg-secondary-container',      text: 'text-on-secondary-container', bar: 'bg-secondary' },
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
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const trustConfig = TRUST_LEVEL_CONFIG[user.trustLevel]

  async function handleSignOut() {
    await signOut()
    router.replace('/auth')
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="bg-surface-container-low px-6 py-8">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-on-primary">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-primary tracking-tight">{user.name}</h1>
            <p className="text-sm text-on-surface-variant">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Info Card */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl space-y-4">
            <InfoRow icon="location_on" label="Barrio" value={NEIGHBORHOOD_LABELS[user.neighborhood]} />
            <InfoRow icon="home" label="Lote / Casa" value={user.lotNumber} />
            <InfoRow icon="chat" label="WhatsApp" value={user.whatsapp} />
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-on-surface-variant text-xl w-6">badge</span>
              <span className="text-sm text-on-surface-variant flex-1">Estado</span>
              <span className={`text-sm font-bold ${
                user.status === 'active' ? 'text-secondary' :
                user.status === 'pending' ? 'text-on-tertiary-container' : 'text-error'
              }`}>
                {user.status === 'active' ? 'Activo' : user.status === 'pending' ? 'Pendiente' : 'Suspendido'}
              </span>
            </div>
          </div>

          {/* Trust Card */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-primary text-lg">Nivel de confianza</h2>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${trustConfig.bg} ${trustConfig.text}`}>
                {trustConfig.label}
              </span>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2.5">
                <span className="text-on-surface-variant">Trust score</span>
                <span className="font-bold text-primary">{user.trustScore} / 100</span>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${trustConfig.bar}`}
                  style={{ width: `${user.trustScore}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Avales recibidos</span>
              <span className="font-bold text-primary">{user.validationCount}</span>
            </div>
          </div>

          {/* Verifications Card */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl">
            <h2 className="font-bold text-primary text-lg mb-4">Verificaciones</h2>
            <div className="space-y-3">
              {user.verifications.map((v, i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <span className="text-sm text-on-surface">{VERIFICATION_LABELS[v.method]}</span>
                  <VerificationBadge status={v.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Invite button */}
          {canInvite(user) && (
            <Link
              href="/invite"
              className="w-full bg-signature-gradient text-white py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:shadow-xl transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">person_add</span>
              Invitar vecinos
            </Link>
          )}

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="w-full text-error font-bold bg-error-container/30 rounded-full px-4 py-4 hover:bg-error-container/50 transition-colors active:scale-95"
          >
            Cerrar sesion
          </button>
        </div>
      </div>
    </main>
  )
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="material-symbols-outlined text-on-surface-variant text-xl w-6">{icon}</span>
      <span className="text-sm text-on-surface-variant flex-1">{label}</span>
      <span className="font-semibold text-on-surface text-sm">{value}</span>
    </div>
  )
}

function VerificationBadge({ status }: { status: string }) {
  if (status === 'verified') {
    return (
      <span className="flex items-center gap-1.5 text-xs font-bold text-on-secondary-container bg-secondary-container px-3 py-1 rounded-full">
        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        Verificado
      </span>
    )
  }
  if (status === 'pending') {
    return (
      <span className="flex items-center gap-1.5 text-xs font-bold text-on-tertiary-fixed-variant bg-tertiary-fixed px-3 py-1 rounded-full">
        <span className="material-symbols-outlined text-sm">schedule</span>
        Pendiente
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1.5 text-xs font-bold text-error bg-error-container px-3 py-1 rounded-full">
      <span className="material-symbols-outlined text-sm">cancel</span>
      Rechazado
    </span>
  )
}
