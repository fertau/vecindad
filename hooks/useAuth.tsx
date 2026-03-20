'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getUser } from '@/lib/firestore'
import { identifyUser } from '@/lib/analytics'
import { User } from '@/types'

export type AuthState = {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  isAdmin: boolean
  needsRegistration: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [needsRegistration, setNeedsRegistration] = useState(false)

  const isAdmin = user?.uid === process.env.NEXT_PUBLIC_ADMIN_UID

  const refreshUser = useCallback(async () => {
    if (!firebaseUser) return
    const userData = await getUser(firebaseUser.uid)
    if (userData) {
      setUser(userData)
      setNeedsRegistration(false)
      identifyUser(userData.uid, {
        name: userData.name,
        neighborhood: userData.neighborhood,
        trustLevel: userData.trustLevel,
      })
    }
  }, [firebaseUser])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser)

      if (!fbUser) {
        setUser(null)
        setNeedsRegistration(false)
        setLoading(false)
        return
      }

      try {
        const userData = await getUser(fbUser.uid)
        if (userData) {
          setUser(userData)
          setNeedsRegistration(false)
          identifyUser(userData.uid, {
            name: userData.name,
            neighborhood: userData.neighborhood,
            trustLevel: userData.trustLevel,
          })
        } else {
          setUser(null)
          setNeedsRegistration(true)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        setUser(null)
        setNeedsRegistration(true)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, firebaseUser, loading, isAdmin, needsRegistration, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
