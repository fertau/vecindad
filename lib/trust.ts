import {
  User,
  TrustLevel,
  VerificationMethod,
  TRUST_SCORE_WEIGHTS,
} from '@/types'

export function computeTrustScore(
  verifications: User['verifications'],
  validationCount: number
): number {
  const verifiedMethods = verifications
    .filter(v => v.status === 'verified')
    .map(v => v.method)

  const baseScore = verifiedMethods.reduce((sum, method) => {
    return sum + (TRUST_SCORE_WEIGHTS[method] ?? 0)
  }, 0)

  // peer_vouching: 15 pts por aval, máximo 3 avales computados (45 pts)
  const vouchingScore =
    Math.min(validationCount, 3) * TRUST_SCORE_WEIGHTS['peer_vouching']

  return Math.min(baseScore + vouchingScore, 100)
}

export function computeTrustLevel(score: number): TrustLevel {
  if (score === 0)  return 'unverified'
  if (score < 40)   return 'basic'
  if (score < 70)   return 'verified'
  return 'trusted'
}

export function getVerifiedMethods(
  verifications: User['verifications']
): VerificationMethod[] {
  return verifications
    .filter(v => v.status === 'verified')
    .map(v => v.method)
}

// Capacidades por trust level
export function canPublish(user: User): boolean {
  return user.status === 'active' && user.trustLevel !== 'unverified'
}

export function canVouch(user: User): boolean {
  return (
    user.status === 'active' &&
    (user.trustLevel === 'verified' || user.trustLevel === 'trusted')
  )
}

export function canInvite(user: User): boolean {
  return user.status === 'active' && user.trustLevel !== 'unverified'
}

// Recomputa y devuelve los campos actualizados para un update de Firestore
export function recomputeTrustFields(
  verifications: User['verifications'],
  validationCount: number
): { trustScore: number; trustLevel: TrustLevel } {
  const trustScore = computeTrustScore(verifications, validationCount)
  const trustLevel = computeTrustLevel(trustScore)
  return { trustScore, trustLevel }
}
