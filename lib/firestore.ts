import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { User, Listing, Validation, Invite } from '@/types'

// ─── Users ──────────────────────────────────────────────────────────────────

export async function getUser(uid: string): Promise<User | null> {
  const docSnap = await getDoc(doc(db, 'users', uid))
  if (!docSnap.exists()) return null
  return docSnap.data() as User
}

export async function createUser(user: User): Promise<void> {
  await setDoc(doc(db, 'users', user.uid), user)
}

export async function updateUser(uid: string, data: Partial<User>): Promise<void> {
  await updateDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() })
}

// ─── Listings ───────────────────────────────────────────────────────────────

export async function getListing(id: string): Promise<Listing | null> {
  throw new Error('Not implemented')
}

export async function getActiveListings(): Promise<Listing[]> {
  throw new Error('Not implemented')
}

export async function createListing(listing: Listing): Promise<string> {
  throw new Error('Not implemented')
}

export async function updateListing(id: string, data: Partial<Listing>): Promise<void> {
  throw new Error('Not implemented')
}

// ─── Validations ────────────────────────────────────────────────────────────

export async function getValidationsForUser(uid: string): Promise<Validation[]> {
  throw new Error('Not implemented')
}

export async function createValidation(validation: Validation): Promise<void> {
  throw new Error('Not implemented')
}

// ─── Invites ────────────────────────────────────────────────────────────────

export async function getInvite(token: string): Promise<Invite | null> {
  throw new Error('Not implemented')
}

export async function getInvitesByUser(uid: string): Promise<Invite[]> {
  throw new Error('Not implemented')
}
