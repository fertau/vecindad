import { Invite, InviteType } from '@/types'

// Crea un invite de un solo uso con expiración de 48hs
// Devuelve el token (id del documento)
export async function createInvite(
  inviterUid: string,
  inviterName: string,
  type: InviteType,
  target?: { email?: string; phone?: string }
): Promise<string> {
  throw new Error('Not implemented')
}

// Valida un token: existe, está pending, no expiró, email coincide si targeted
export async function validateInviteToken(
  token: string,
  registrantEmail?: string
): Promise<Invite | null> {
  throw new Error('Not implemented')
}

// Marca el invite como aceptado y registra quién lo usó
export async function acceptInvite(
  token: string,
  acceptedByUid: string
): Promise<void> {
  throw new Error('Not implemented')
}

// Revoca un invite pendiente (solo el invitador o admin)
export async function revokeInvite(
  token: string,
  revokedByUid: string
): Promise<void> {
  throw new Error('Not implemented')
}
