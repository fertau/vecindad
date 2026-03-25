import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { User, Listing, Validation, Invite, TrustLevel, TRUST_SCORE_WEIGHTS } from '@/types'

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
  const docSnap = await getDoc(doc(db, 'listings', id))
  if (!docSnap.exists()) return null
  return { id: docSnap.id, ...docSnap.data() } as Listing
}

export async function getActiveListings(): Promise<Listing[]> {
  const q = query(
    collection(db, 'listings'),
    where('status', '==', 'active'),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Listing)
}

export async function createListing(listing: Omit<Listing, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'listings'), listing)
  return docRef.id
}

export async function updateListing(id: string, data: Partial<Listing>): Promise<void> {
  await updateDoc(doc(db, 'listings', id), { ...data, updatedAt: serverTimestamp() })
}

// ─── Admin: Users ────────────────────────────────────────────────────────────

export async function getPendingUsers(): Promise<User[]> {
  const q = query(
    collection(db, 'users'),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => d.data() as User)
}

export async function getAllUsers(): Promise<User[]> {
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => d.data() as User)
}

export async function approveUser(uid: string): Promise<void> {
  const user = await getUser(uid)
  if (!user) throw new Error('User not found')

  const verifications = [...user.verifications]
  const dniIdx = verifications.findIndex((v) => v.method === 'dni')
  if (dniIdx === -1) {
    verifications.push({
      method: 'dni',
      status: 'verified',
      verifiedAt: Timestamp.now(),
      createdAt: Timestamp.now(),
    })
  } else {
    verifications[dniIdx] = {
      ...verifications[dniIdx],
      status: 'verified',
      verifiedAt: Timestamp.now(),
    }
  }

  const { score, level } = computeTrustScore(verifications, user.validationCount)

  await updateUser(uid, {
    status: 'active',
    verifications,
    trustScore: score,
    trustLevel: level,
  })
}

export async function suspendUser(uid: string): Promise<void> {
  await updateUser(uid, { status: 'suspended' })
}

export async function recomputeUserTrust(uid: string): Promise<void> {
  const user = await getUser(uid)
  if (!user) throw new Error('User not found')
  const { score, level } = computeTrustScore(user.verifications, user.validationCount)
  await updateUser(uid, { trustScore: score, trustLevel: level })
}

// ─── Trust Score ─────────────────────────────────────────────────────────────

export function computeTrustScore(
  verifications: User['verifications'],
  validationCount: number
): { score: number; level: TrustLevel } {
  let score = 0

  for (const v of verifications) {
    if (v.status === 'verified') {
      score += TRUST_SCORE_WEIGHTS[v.method] ?? 0
    }
  }

  // Peer vouching: max 3 count towards score
  const peerCount = Math.min(validationCount, 3)
  score += peerCount * TRUST_SCORE_WEIGHTS.peer_vouching
  score = Math.min(score, 100)

  let level: TrustLevel = 'unverified'
  if (score >= 70) level = 'trusted'
  else if (score >= 40) level = 'verified'
  else if (score > 0) level = 'basic'

  return { score, level }
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
