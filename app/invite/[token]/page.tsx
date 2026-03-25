'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { getInvite, acceptInvite } from '@/lib/firestore'
import { trackEvent } from '@/lib/analytics'
import { Invite } from '@/types'

type InviteState = 'loading' | 'valid' | 'expired' | 'used' | 'not_found'

export default function InviteLandingPage() {
  const params = useParams()
  const token = params.token as string
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [invite, setInvite] = useState<Invite | null>(null)
  const [state, setState] = useState<InviteState>('loading')
  const [accepting, setAccepting] = useState(false)
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const inv = await getInvite(token)
        if (!inv) {
          setState('not_found')
          return
        }
        setInvite(inv)
        if (inv.status === 'accepted') {
          setState('used')
        } else if (inv.expiresAt.toMillis() < Date.now()) {
          setState('expired')
        } else {
          setState('valid')
        }
      } catch (err) {
        console.error('Error loading invite:', err)
        setState('not_found')
      }
    }
    load()
  }, [token])

  async function handleAccept() {
    if (!user || !invite) return
    setAccepting(true)
    try {
      await acceptInvite(token, user.uid)
      trackEvent('invite_accepted', {
        token,
        inviterUid: invite.inviterUid,
        acceptedByUid: user.uid,
      })
      setAccepted(true)
    } catch (err) {
      console.error('Error accepting invite:', err)
    } finally {
      setAccepting(false)
    }
  }

  if (state === 'loading') {
    return (
      <main className="flex items-center justify-center min-h-[80vh]">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  // Invalid states
  if (state === 'not_found' || state === 'expired' || state === 'used') {
    const config = {
      not_found: { icon: 'link_off', title: 'Link no valido', desc: 'Esta invitacion no existe.' },
      expired: { icon: 'timer_off', title: 'Invitacion expirada', desc: 'Esta invitacion ya vencio. Pedile a tu vecino que genere una nueva.' },
      used: { icon: 'check_circle', title: 'Invitacion ya usada', desc: 'Esta invitacion ya fue utilizada por otro vecino.' },
    }[state]

    return (
      <main className="flex items-center justify-center min-h-[80vh] px-6">
        <div className="max-w-sm text-center space-y-6">
          <div className="w-20 h-20 bg-surface-container-highest rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-on-surface-variant text-4xl">
              {config.icon}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">
            {config.title}
          </h1>
          <p className="text-on-surface-variant">{config.desc}</p>
          <Link
            href="/"
            className="inline-block bg-signature-gradient text-white px-8 py-3 rounded-full font-bold hover:shadow-xl transition-all active:scale-95"
          >
            Ir al inicio
          </Link>
        </div>
      </main>
    )
  }

  // Valid invite — accepted state
  if (accepted) {
    return (
      <main className="flex items-center justify-center min-h-[80vh] px-6">
        <div className="max-w-sm text-center space-y-6">
          <div className="w-20 h-20 bg-secondary-container rounded-full flex items-center justify-center mx-auto">
            <span
              className="material-symbols-outlined text-secondary text-4xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              celebration
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">
            Bienvenido a Vecindad!
          </h1>
          <p className="text-on-surface-variant">
            Ya estas vinculado con {invite?.inviterName}. Explora el marketplace de tu barrio.
          </p>
          <Link
            href="/feed"
            className="inline-block bg-signature-gradient text-white px-8 py-3 rounded-full font-bold hover:shadow-xl transition-all active:scale-95"
          >
            Explorar publicaciones
          </Link>
        </div>
      </main>
    )
  }

  // Valid invite — show landing
  return (
    <main className="flex items-center justify-center min-h-[80vh] px-6">
      <div className="max-w-sm text-center space-y-8">
        <div className="w-20 h-20 bg-secondary-container rounded-full flex items-center justify-center mx-auto">
          <span
            className="material-symbols-outlined text-secondary text-4xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            group_add
          </span>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight mb-2">
            Te invitaron a Vecindad
          </h1>
          <p className="text-on-surface-variant">
            <span className="font-bold text-on-surface">{invite?.inviterName}</span> te invito al marketplace exclusivo de Nordelta.
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl text-left space-y-4">
          <Benefit icon="verified_user" text="Comprá y vendé solo con vecinos verificados" />
          <Benefit icon="location_on" text="Todo a la vuelta de la esquina, sin envios" />
          <Benefit icon="handshake" text="Confianza basada en conexiones reales" />
        </div>

        {/* Actions */}
        {authLoading ? (
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        ) : user ? (
          <button
            onClick={handleAccept}
            disabled={accepting}
            className="w-full bg-signature-gradient text-white py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:shadow-xl transition-all active:scale-95 disabled:opacity-50"
          >
            {accepting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="material-symbols-outlined">check</span>
                Aceptar invitacion
              </>
            )}
          </button>
        ) : (
          <Link
            href={`/auth?invite=${token}`}
            className="block w-full bg-signature-gradient text-white py-4 rounded-full font-bold text-lg text-center hover:shadow-xl transition-all active:scale-95"
          >
            Registrate para aceptar
          </Link>
        )}

        <p className="text-xs text-on-surface-variant/50">
          Solo para residentes de Nordelta
        </p>
      </div>
    </main>
  )
}

function Benefit({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="material-symbols-outlined text-secondary text-xl"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {icon}
      </span>
      <p className="text-sm text-on-surface">{text}</p>
    </div>
  )
}
