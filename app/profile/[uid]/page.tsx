'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import {
  getUser,
  getValidationsForUser,
  hasAlreadyVouched,
  vouchForUser,
} from '@/lib/firestore'
import { trackEvent } from '@/lib/analytics'
import { NEIGHBORHOOD_LABELS } from '@/constants/neighborhoods'
import { User, Validation, TrustLevel } from '@/types'

const TRUST_CONFIG: Record<TrustLevel, { label: string; bg: string; text: string; bar: string }> = {
  unverified: { label: 'Sin verificar', bg: 'bg-surface-container-highest', text: 'text-on-surface-variant', bar: 'bg-outline' },
  basic:      { label: 'Basico',        bg: 'bg-tertiary-fixed',           text: 'text-on-tertiary-fixed',  bar: 'bg-on-tertiary-container' },
  verified:   { label: 'Verificado',    bg: 'bg-primary-fixed',            text: 'text-primary',            bar: 'bg-primary' },
  trusted:    { label: 'De Confianza',  bg: 'bg-secondary-container',      text: 'text-on-secondary-container', bar: 'bg-secondary' },
}

export default function PublicProfilePage() {
  const params = useParams()
  const uid = params.uid as string
  const { user: viewer } = useAuth()

  const [profile, setProfile] = useState<User | null>(null)
  const [validations, setValidations] = useState<Validation[]>([])
  const [alreadyVouched, setAlreadyVouched] = useState(false)
  const [loading, setLoading] = useState(true)
  const [vouchLoading, setVouchLoading] = useState(false)
  const [vouchNote, setVouchNote] = useState('')
  const [showVouchForm, setShowVouchForm] = useState(false)
  const [vouchSuccess, setVouchSuccess] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [userData, vals] = await Promise.all([
          getUser(uid),
          getValidationsForUser(uid),
        ])
        setProfile(userData)
        setValidations(vals)

        if (viewer && userData) {
          const vouched = await hasAlreadyVouched(viewer.uid, uid)
          setAlreadyVouched(vouched)
        }
      } catch (err) {
        console.error('Error loading profile:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [uid, viewer])

  async function handleVouch() {
    if (!viewer || !profile) return
    setVouchLoading(true)
    try {
      await vouchForUser(viewer, uid, vouchNote || undefined)
      trackEvent('validation_sent', {
        fromUid: viewer.uid,
        toUid: uid,
        fromTrustLevel: viewer.trustLevel,
      })
      setAlreadyVouched(true)
      setVouchSuccess(true)
      setShowVouchForm(false)
      // Refresh profile and validations
      const [updatedUser, vals] = await Promise.all([
        getUser(uid),
        getValidationsForUser(uid),
      ])
      setProfile(updatedUser)
      setValidations(vals)
    } catch (err) {
      console.error('Error vouching:', err)
    } finally {
      setVouchLoading(false)
    }
  }

  // Can vouch: viewer is logged in, verified or trusted, not viewing own profile, hasn't vouched already
  const canVouch =
    viewer &&
    profile &&
    viewer.uid !== uid &&
    (viewer.trustLevel === 'verified' || viewer.trustLevel === 'trusted') &&
    !alreadyVouched &&
    !vouchSuccess

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  if (!profile) {
    return (
      <main className="min-h-screen px-6 py-10">
        <div className="max-w-lg mx-auto text-center py-24 space-y-4">
          <span className="material-symbols-outlined text-[80px] text-outline-variant/30">
            person_off
          </span>
          <p className="text-on-surface-variant text-lg font-medium">
            Este perfil no existe.
          </p>
        </div>
      </main>
    )
  }

  const trust = TRUST_CONFIG[profile.trustLevel]

  return (
    <main className="min-h-screen pb-32 md:pb-8">
      {/* Header */}
      <div className="bg-surface-container-low px-6 py-8">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-on-primary">
              {profile.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-primary tracking-tight">
                {profile.name}
              </h1>
              {(profile.trustLevel === 'verified' || profile.trustLevel === 'trusted') && (
                <span
                  className="material-symbols-outlined text-secondary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified_user
                </span>
              )}
            </div>
            <p className="text-sm text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              {NEIGHBORHOOD_LABELS[profile.neighborhood]}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Trust Card */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-primary text-lg">Nivel de confianza</h2>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${trust.bg} ${trust.text}`}>
                {trust.label}
              </span>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2.5">
                <span className="text-on-surface-variant">Trust score</span>
                <span className="font-bold text-primary">{profile.trustScore} / 100</span>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${trust.bar}`}
                  style={{ width: `${profile.trustScore}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Avales recibidos</span>
              <span className="font-bold text-primary">{profile.validationCount}</span>
            </div>
          </div>

          {/* Vouch Button / Success / Already Vouched */}
          {vouchSuccess && (
            <div className="bg-secondary-container p-6 rounded-2xl flex items-center gap-4">
              <span
                className="material-symbols-outlined text-secondary text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              <div>
                <p className="font-bold text-on-secondary-container">Aval enviado</p>
                <p className="text-sm text-on-secondary-container/80">
                  Tu aval ayuda a {profile.name} a construir confianza en la comunidad.
                </p>
              </div>
            </div>
          )}

          {alreadyVouched && !vouchSuccess && (
            <div className="bg-surface-container-lowest p-6 rounded-2xl flex items-center gap-4">
              <span
                className="material-symbols-outlined text-secondary text-2xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                handshake
              </span>
              <p className="text-sm text-on-surface-variant">
                Ya avalaste a {profile.name}
              </p>
            </div>
          )}

          {canVouch && !showVouchForm && (
            <button
              onClick={() => setShowVouchForm(true)}
              className="w-full bg-signature-gradient text-white py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:shadow-xl transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">handshake</span>
              Avalar a {profile.name}
            </button>
          )}

          {canVouch && showVouchForm && (
            <div className="bg-surface-container-lowest p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-primary text-lg">Avalar a {profile.name}</h3>
              <p className="text-sm text-on-surface-variant">
                Al avalar confirmas que conoces a esta persona y que es un vecino real de Nordelta.
              </p>
              <textarea
                value={vouchNote}
                onChange={(e) => setVouchNote(e.target.value)}
                placeholder="Nota opcional: &quot;Lo conozco del barrio hace años&quot;"
                maxLength={200}
                rows={3}
                className="w-full rounded-xl px-4 py-3 text-sm resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowVouchForm(false)}
                  className="flex-1 bg-surface-container-highest text-on-surface-variant py-3 rounded-full font-bold active:scale-95 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleVouch}
                  disabled={vouchLoading}
                  className="flex-1 bg-signature-gradient text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                >
                  {vouchLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">check</span>
                      Confirmar aval
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Validations list */}
          {validations.length > 0 && (
            <div className="bg-surface-container-lowest p-6 rounded-2xl">
              <h2 className="font-bold text-primary text-lg mb-4">
                Avales ({validations.length})
              </h2>
              <div className="space-y-4">
                {validations.map((v) => (
                  <div key={v.id} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-on-primary">
                        {v.fromName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-on-surface text-sm">{v.fromName}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant bg-surface-container-highest px-2 py-0.5 rounded-full">
                          {NEIGHBORHOOD_LABELS[v.fromNeighborhood]}
                        </span>
                      </div>
                      {v.note && (
                        <p className="text-xs text-on-surface-variant mt-1 italic">
                          &ldquo;{v.note}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info: who can vouch */}
          {viewer && !canVouch && !alreadyVouched && !vouchSuccess && viewer.uid !== uid && (
            <div className="bg-surface-container-lowest p-6 rounded-2xl flex items-start gap-3">
              <span className="material-symbols-outlined text-on-surface-variant text-xl">info</span>
              <p className="text-sm text-on-surface-variant">
                Para avalar a otros vecinos, tu cuenta debe estar verificada (trust level &quot;Verificado&quot; o superior).
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
