import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, UserCredential } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { resetAnalytics } from '@/lib/analytics'
import { User } from '@/types'

// ─── Google Auth ────────────────────────────────────────────────────────────

export async function signInWithGoogle(): Promise<UserCredential> {
  const provider = new GoogleAuthProvider()
  return signInWithPopup(auth, provider)
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
  resetAnalytics()
}

// ─── Stubs (sesiones futuras) ───────────────────────────────────────────────

export async function signInWithEmail(email: string, password: string): Promise<void> {
  throw new Error('Not implemented')
}

export async function signUpWithEmail(
  email: string,
  password: string,
  profile: Omit<User, 'uid' | 'createdAt' | 'updatedAt' | 'trustLevel' | 'trustScore' | 'validationCount' | 'verifications' | 'status'>
): Promise<void> {
  throw new Error('Not implemented')
}

export async function linkGoogleAccount(): Promise<void> {
  throw new Error('Not implemented')
}

export async function linkFacebookAccount(): Promise<void> {
  throw new Error('Not implemented')
}
