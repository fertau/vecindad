'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { createInvite, getInvitesByUser } from '@/lib/firestore'
import { canInvite } from '@/lib/trust'
import { trackEvent } from '@/lib/analytics'
import { Invite } from '@/types'

export default function InvitePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [invites, setInvites] = useState<Invite[]>([])
  const [loadingInvites, setLoadingInvites] = useState(true)
  const [creating, setCreating] = useState(false)
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) router.replace('/auth')
  }, [loading, user, router])

  useEffect(() => {
    if (!user) return
    loadInvites()
  }, [user])

  async function loadInvites() {
    if (!user) return
    setLoadingInvites(true)
    try {
      const data = await getInvitesByUser(user.uid)
      setInvites(data)
    } catch (err) {
      console.error('Error loading invites:', err)
    } finally {
      setLoadingInvites(false)
    }
  }

  async function handleCreate() {
    if (!user) return
    setCreating(true)
    try {
      const token = await createInvite(user)
      trackEvent('invite_created', { inviterUid: user.uid })
      await loadInvites()
      await copyLink(token)
    } catch (err) {
      console.error('Error creating invite:', err)
    } finally {
      setCreating(false)
    }
  }

  async function copyLink(token: string) {
    const url = `${window.location.origin}/invite/${token}`
    try {
      await navigator.clipboard.writeText(url)
      setCopiedToken(token)
      setTimeout(() => setCopiedToken(null), 3000)
    } catch {
      // Fallback: prompt user
      prompt('Copia este link:', url)
    }
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const allowed = canInvite(user)

  return (
    <main className="max-w-lg mx-auto px-4 md:px-6 py-8 pb-32 md:pb-8">
      <div className="flex items-center gap-3 mb-8">
        <span
          className="material-symbols-outlined text-primary text-4xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          person_add
        </span>
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">
            Invitar vecinos
          </h1>
          <p className="text-on-surface-variant">
            Genera links de invitacion unicos
          </p>
        </div>
      </div>

      {!allowed && (
        <div className="bg-surface-container-lowest p-6 rounded-2xl flex items-start gap-3 mb-6">
          <span className="material-symbols-outlined text-on-surface-variant text-xl">info</span>
          <p className="text-sm text-on-surface-variant">
            Tu cuenta debe estar activa y verificada para poder invitar vecinos.
          </p>
        </div>
      )}

      {allowed && (
        <>
          {/* How it works */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl mb-6 space-y-4">
            <h2 className="font-bold text-primary">Como funciona</h2>
            <div className="space-y-3">
              <Step number={1} text="Genera un link de invitacion unico" />
              <Step number={2} text="Comparti el link con tu vecino" />
              <Step number={3} text="Tu vecino se registra y queda vinculado a vos" />
            </div>
            <p className="text-xs text-on-surface-variant">
              Cada link es de un solo uso y expira en 48 horas.
            </p>
          </div>

          {/* Create button */}
          <button
            onClick={handleCreate}
            disabled={creating}
            className="w-full bg-signature-gradient text-white py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 mb-8"
          >
            {creating ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="material-symbols-outlined">add_link</span>
                Generar link de invitacion
              </>
            )}
          </button>
        </>
      )}

      {/* Invites list */}
      {!loadingInvites && invites.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-bold text-primary text-lg">
            Tus invitaciones ({invites.length})
          </h2>
          {invites.map((inv) => (
            <InviteCard
              key={inv.id}
              invite={inv}
              isCopied={copiedToken === inv.id}
              onCopy={() => copyLink(inv.id)}
            />
          ))}
        </div>
      )}

      {loadingInvites && (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </main>
  )
}

function Step({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-bold text-on-primary">{number}</span>
      </div>
      <p className="text-sm text-on-surface">{text}</p>
    </div>
  )
}

function InviteCard({
  invite,
  isCopied,
  onCopy,
}: {
  invite: Invite
  isCopied: boolean
  onCopy: () => void
}) {
  const isExpired = invite.expiresAt.toMillis() < Date.now()
  const isUsable = invite.status === 'pending' && !isExpired

  const statusLabel = invite.status === 'accepted'
    ? 'Aceptada'
    : isExpired
      ? 'Expirada'
      : 'Pendiente'

  const statusColor = invite.status === 'accepted'
    ? 'bg-secondary-container text-on-secondary-container'
    : isExpired
      ? 'bg-surface-container-highest text-on-surface-variant'
      : 'bg-tertiary-container text-on-tertiary-container'

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-4 ghost-border">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColor}`}>
          {statusLabel}
        </span>
        <span className="text-[11px] text-on-surface-variant">
          {invite.createdAt?.toDate?.()
            ? invite.createdAt.toDate().toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
            : ''}
        </span>
      </div>
      <p className="text-xs text-on-surface-variant font-mono truncate mb-3">
        /invite/{invite.id.slice(0, 8)}...
      </p>
      {isUsable && (
        <button
          onClick={onCopy}
          className={`w-full py-2 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
            isCopied
              ? 'bg-secondary-container text-on-secondary-container'
              : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">
            {isCopied ? 'check' : 'content_copy'}
          </span>
          {isCopied ? 'Copiado!' : 'Copiar link'}
        </button>
      )}
    </div>
  )
}
