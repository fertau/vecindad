import { SocialProvider, EdgeSource } from '@/types'

// Devuelve los UIDs de todos los usuarios con quienes existe un edge
export async function getDirectConnections(uid: string): Promise<string[]> {
  throw new Error('Not implemented')
}

// Devuelve el COUNT de conexiones en común entre viewer y target
// NUNCA devuelve los UIDs — privacidad estructural
export async function getMutualConnectionCount(
  viewerUid: string,
  targetUid: string
): Promise<number> {
  throw new Error('Not implemented')
}

// Crea edge bidireccional (dos documentos en batch)
export async function createVouchEdge(
  fromUid: string,
  toUid: string
): Promise<void> {
  throw new Error('Not implemented')
}

// Crea edge direccionado (invitador → invitado) — no bidireccional
export async function createInviteEdge(
  inviterUid: string,
  inviteeUid: string,
  source: Extract<EdgeSource, 'direct_invite_open' | 'direct_invite_targeted'>
): Promise<void> {
  throw new Error('Not implemented')
}

// Guarda el providerId en /users/{uid}/private/identities
// Dispara cruce con otros usuarios que conectaron el mismo provider
export async function linkSocialIdentity(
  uid: string,
  provider: SocialProvider,
  providerId: string
): Promise<void> {
  throw new Error('Not implemented')
}

// Busca otros usuarios que tienen el mismo providerId
// Solo llamada desde Cloud Function o contexto admin
export async function findMutualOAuthConnections(
  provider: SocialProvider,
  providerId: string,
  excludeUid: string
): Promise<string[]> {
  throw new Error('Not implemented')
}
