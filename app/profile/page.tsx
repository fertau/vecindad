'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from '@/lib/auth'
import { NEIGHBORHOOD_LABELS } from '@/constants/neighborhoods'
import { TrustLevel, VerificationMethod } from '@/types'

const TRUST_LEVEL_CONFIG: Record<TrustLevel, { label: string; color: string }> = {
  unverified: { label: 'Sin verificar', color: 'bg-gray-100 text-gray-600' },
  basic:      { label: 'Básico',        color: 'bg-yellow-100 text-yellow-700' },
  verified:   { label: 'Verificado',    color: 'bg-blue-100 text-blue-700' },
  trusted:    { label: 'Confiable',     color: 'bg-green-100 text-green-700' },
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

const STATUS_ICONS: Record<string, string> = {
  pending:  '🕐',
  verified: '✅',
  rejected: '❌',
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
        <p className="text-gray-500">Cargando...</p>
      </div>
    )
  }

  const trustConfig = TRUST_LEVEL_CONFIG[user.trustLevel]

  async function handleSignOut() {
    await signOut()
    router.replace('/auth')
  }

  return (
    <main className="min-h-screen px-4 py-6">
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>

        {/* Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Barrio</span>
            <span className="font-medium">{NEIGHBORHOOD_LABELS[user.neighborhood]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Lote / Casa</span>
            <span className="font-medium">{user.lotNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">WhatsApp</span>
            <span className="font-medium">{user.whatsapp}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Estado</span>
            <span className={`text-sm font-medium ${user.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
              {user.status === 'active' ? 'Activo' : user.status === 'pending' ? 'Pendiente' : 'Suspendido'}
            </span>
          </div>
        </div>

        {/* Trust */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Nivel de confianza</h2>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${trustConfig.color}`}>
              {trustConfig.label}
            </span>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Trust score</span>
              <span className="font-medium">{user.trustScore} / 100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${user.trustScore}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Avales recibidos</span>
            <span className="font-medium">{user.validationCount}</span>
          </div>
        </div>

        {/* Verifications */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
          <h2 className="font-semibold mb-2">Verificaciones</h2>
          {user.verifications.map((v, i) => (
            <div key={i} className="flex items-center justify-between text-sm py-1">
              <span>{VERIFICATION_LABELS[v.method]}</span>
              <span>{STATUS_ICONS[v.status]} {v.status === 'pending' ? 'Pendiente' : v.status === 'verified' ? 'Verificado' : 'Rechazado'}</span>
            </div>
          ))}
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full text-red-600 font-medium border border-red-200 rounded-lg px-4 py-3 hover:bg-red-50 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </main>
  )
}
