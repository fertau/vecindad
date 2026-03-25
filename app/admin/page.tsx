'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import {
  getPendingUsers,
  getAllUsers,
  approveUser,
  suspendUser,
  recomputeUserTrust,
} from '@/lib/firestore'
import { NEIGHBORHOOD_LABELS } from '@/constants/neighborhoods'
import { User, TrustLevel } from '@/types'

type Tab = 'pending' | 'all'

const TRUST_COLORS: Record<TrustLevel, string> = {
  unverified: 'bg-surface-container-highest text-on-surface-variant',
  basic: 'bg-tertiary-container text-on-tertiary-container',
  verified: 'bg-secondary-container text-on-secondary-container',
  trusted: 'bg-primary-container text-on-primary-container',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-tertiary-container text-on-tertiary-container',
  active: 'bg-secondary-container text-on-secondary-container',
  suspended: 'bg-error-container text-on-error-container',
}

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('pending')
  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/')
    }
  }, [loading, isAdmin, router])

  useEffect(() => {
    if (!isAdmin) return
    loadUsers()
  }, [isAdmin, tab])

  async function loadUsers() {
    setLoadingUsers(true)
    try {
      const data = tab === 'pending' ? await getPendingUsers() : await getAllUsers()
      setUsers(data)
    } catch (err) {
      console.error('Error loading users:', err)
    } finally {
      setLoadingUsers(false)
    }
  }

  async function handleApprove(uid: string) {
    setActionLoading(uid)
    try {
      await approveUser(uid)
      await loadUsers()
    } catch (err) {
      console.error('Error approving user:', err)
    } finally {
      setActionLoading(null)
    }
  }

  async function handleSuspend(uid: string) {
    setActionLoading(uid)
    try {
      await suspendUser(uid)
      await loadUsers()
    } catch (err) {
      console.error('Error suspending user:', err)
    } finally {
      setActionLoading(null)
    }
  }

  async function handleRecomputeTrust(uid: string) {
    setActionLoading(uid)
    try {
      await recomputeUserTrust(uid)
      await loadUsers()
    } catch (err) {
      console.error('Error recomputing trust:', err)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  if (!isAdmin) return null

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 pb-32 md:pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <span
          className="material-symbols-outlined text-primary text-4xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          admin_panel_settings
        </span>
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">
            Panel de Administracion
          </h1>
          <p className="text-on-surface-variant">
            Gestion de vecinos y verificaciones
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setTab('pending')}
          className={`px-6 py-3 rounded-full font-bold text-sm transition-all active:scale-95 ${
            tab === 'pending'
              ? 'bg-primary text-white'
              : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-[18px] align-middle mr-1">pending</span>
          Pendientes
        </button>
        <button
          onClick={() => setTab('all')}
          className={`px-6 py-3 rounded-full font-bold text-sm transition-all active:scale-95 ${
            tab === 'all'
              ? 'bg-primary text-white'
              : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-[18px] align-middle mr-1">group</span>
          Todos los vecinos
        </button>
      </div>

      {/* Loading */}
      {loadingUsers && (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty */}
      {!loadingUsers && users.length === 0 && (
        <div className="text-center py-24 space-y-4">
          <span className="material-symbols-outlined text-[80px] text-outline-variant/30">
            {tab === 'pending' ? 'check_circle' : 'group_off'}
          </span>
          <p className="text-on-surface-variant text-lg font-medium">
            {tab === 'pending'
              ? 'No hay vecinos pendientes de verificacion.'
              : 'No hay vecinos registrados todavia.'}
          </p>
        </div>
      )}

      {/* User list */}
      {!loadingUsers && users.length > 0 && (
        <div className="space-y-4">
          {users.map((u) => (
            <UserCard
              key={u.uid}
              user={u}
              isLoading={actionLoading === u.uid}
              onApprove={() => handleApprove(u.uid)}
              onSuspend={() => handleSuspend(u.uid)}
              onRecomputeTrust={() => handleRecomputeTrust(u.uid)}
              showActions={tab === 'pending'}
            />
          ))}
        </div>
      )}
    </main>
  )
}

function UserCard({
  user,
  isLoading,
  onApprove,
  onSuspend,
  onRecomputeTrust,
  showActions,
}: {
  user: User
  isLoading: boolean
  onApprove: () => void
  onSuspend: () => void
  onRecomputeTrust: () => void
  showActions: boolean
}) {
  const verifiedMethods = user.verifications
    .filter((v) => v.status === 'verified')
    .map((v) => v.method)

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 ghost-border">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Avatar + info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-on-primary">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-on-surface text-lg">{user.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[user.status]}`}>
                {user.status}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${TRUST_COLORS[user.trustLevel]}`}>
                {user.trustLevel} ({user.trustScore}pts)
              </span>
            </div>
            <p className="text-sm text-on-surface-variant">
              {user.email}
            </p>
            <div className="flex items-center gap-4 text-xs text-on-surface-variant mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">location_on</span>
                {NEIGHBORHOOD_LABELS[user.neighborhood]} — {user.lotNumber}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">chat</span>
                {user.whatsapp}
              </span>
              {user.validationCount > 0 && (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">handshake</span>
                  {user.validationCount} aval{user.validationCount !== 1 ? 'es' : ''}
                </span>
              )}
            </div>
            {/* Verifications */}
            {verifiedMethods.length > 0 && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {verifiedMethods.map((m) => (
                  <span
                    key={m}
                    className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-[10px] font-bold"
                  >
                    {m.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-shrink-0">
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {showActions && user.status === 'pending' && (
                <button
                  onClick={onApprove}
                  className="bg-secondary text-white px-5 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 hover:opacity-90 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  Aprobar
                </button>
              )}
              {user.status !== 'suspended' && (
                <button
                  onClick={onSuspend}
                  className="bg-error text-on-error px-5 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 hover:opacity-90 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">block</span>
                  Suspender
                </button>
              )}
              <button
                onClick={onRecomputeTrust}
                className="bg-surface-container-highest text-on-surface-variant px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 hover:bg-surface-container-high transition-all active:scale-95"
                title="Recalcular trust score"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
