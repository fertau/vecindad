import { Timestamp } from 'firebase/firestore'

// ─── NEIGHBORHOODS ────────────────────────────────────────────────────────────

export type Neighborhood =
  | 'bahia_grande'
  | 'bahia_chica'
  | 'el_golf'
  | 'el_hurling'
  | 'los_lagos_del_golf'
  | 'la_isla'
  | 'los_castores'
  | 'las_castoras'
  | 'portezuelo'
  | 'las_caletas'
  | 'las_glorietas'
  | 'la_alameda'
  | 'barrancas_del_lago'
  | 'los_sauces'
  | 'cabos_del_lago'
  | 'los_alisos'
  | 'el_puerto'
  | 'el_yacht'
  | 'los_lagos'
  | 'lago_escondido'
  | 'el_palmar'
  | 'el_portal'
  | 'puerto_escondido'
  | 'sendero'
  | 'tipas'
  | 'islas_del_golf'
  | 'virazon'
  | 'los_pinos'
  | 'islas_del_canal'
  | 'los_castanos'
  | 'las_piedras'
  | 'los_puentes'
  | 'oceana'

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

export type CategoryId =
  | 'furniture'
  | 'appliances'
  | 'clothing'
  | 'sports'
  | 'toys'
  | 'garden'
  | 'services'
  | 'vehicles'
  | 'tech'
  | 'other'

// ─── VERIFICATION SYSTEM ──────────────────────────────────────────────────────
// Extensible by design: add new VerificationMethod values without refactoring

export type VerificationMethod =
  | 'neighborhood_declaration'   // barrio + lote autodeclarado
  | 'dni'                        // DNI verificado por admin
  | 'service_bill'               // servicio a nombre del usuario (V2)
  | 'resident_card'              // carnet de residente emitido por el barrio (V2)
  | 'oauth_google'               // Google OAuth conectado
  | 'oauth_facebook'             // Facebook OAuth conectado
  | 'oauth_instagram'            // Instagram OAuth conectado (V2)
  | 'peer_vouching'              // aval explícito de vecino verificado

export type VerificationStatus = 'pending' | 'verified' | 'rejected'

export type Verification = {
  method: VerificationMethod
  status: VerificationStatus
  payload?: Record<string, unknown>  // datos específicos por método
                                     // DNI: { lastFourDigits: string }
                                     // OAuth: { provider: string }
  verifiedBy?: string                // uid del admin o del vecino que aprobó
  verifiedAt?: Timestamp
  rejectionReason?: string
  createdAt: Timestamp
}

// ─── TRUST LEVEL ──────────────────────────────────────────────────────────────

export type TrustLevel =
  | 'unverified'    // sin verificaciones (solo registro)
  | 'basic'         // barrio + lote declarado, pendiente admin
  | 'verified'      // DNI confirmado por admin (score >= 40)
  | 'trusted'       // verificado + avalado por vecinos (score >= 70)

// Score weights por método. Sumar al agregar nuevos métodos.
export const TRUST_SCORE_WEIGHTS: Record<VerificationMethod, number> = {
  neighborhood_declaration: 10,
  dni:                       30,
  service_bill:              20,
  resident_card:             20,
  oauth_google:              10,
  oauth_facebook:            10,
  oauth_instagram:            5,
  peer_vouching:             15,   // por aval, máximo 3 (45 pts)
}

// TrustLevel thresholds
// unverified:  score === 0
// basic:       score 1–39
// verified:    score 40–69
// trusted:     score >= 70

// ─── SOCIAL GRAPH ─────────────────────────────────────────────────────────────

export type SocialProvider = 'google' | 'facebook' | 'instagram' | 'linkedin'

// Almacenada en /users/{uid}/private/identities — NUNCA expuesta públicamente
export type SocialIdentity = {
  provider: SocialProvider
  providerId: string         // ID en esa red, solo para cruce interno
  connectedAt: Timestamp
}

export type EdgeSource =
  | 'peer_vouching'              // A avala a B explícitamente
  | 'direct_invite_open'         // A invitó a B con token de un solo uso
  | 'direct_invite_targeted'     // A invitó a B con email/teléfono confirmado
  | 'oauth_mutual_facebook'      // amigos en FB detectados (ambos conectaron)
  | 'oauth_mutual_google'        // contactos en común vía Google (ambos conectaron)
  | 'admin_confirmed'            // admin verificó la relación directamente

export const EDGE_WEIGHTS: Record<EdgeSource, number> = {
  peer_vouching:              1.0,
  direct_invite_targeted:     0.9,
  direct_invite_open:         0.7,
  oauth_mutual_facebook:      0.5,
  oauth_mutual_google:        0.3,
  admin_confirmed:            1.0,
}

// Colección /socialEdges/{edgeId}
// Direccionado: fromUid → toUid
// Bidireccional cuando aplica: se crean dos edges en batch
export type SocialEdge = {
  id: string
  fromUid: string
  toUid: string
  source: EdgeSource
  weight: number
  createdAt: Timestamp
}

// ─── VALIDATIONS (avales explícitos entre vecinos) ────────────────────────────

// Colección /validations/{validationId}
// Direccionado: fromUid avala a toUid
// No se rechaza. El que avala asume responsabilidad.
export type Validation = {
  id: string
  fromUid: string
  fromName: string             // desnormalizado para display
  fromNeighborhood: Neighborhood
  fromTrustLevel: TrustLevel   // el peso del aval depende de quien lo da
  toUid: string
  note?: string                // "Lo conozco del barrio hace años" (opcional)
  createdAt: Timestamp
}

// ─── INVITES ──────────────────────────────────────────────────────────────────

export type InviteType = 'open_single_use' | 'targeted_email' | 'targeted_phone'

// Colección /invites/{token}
// El token es el ID del documento (uuid v4 opaco)
export type Invite = {
  id: string                   // token opaco = uuid v4
  type: InviteType
  inviterUid: string
  inviterName: string          // para mostrar en la pantalla de registro del invitado
  targetEmail?: string         // solo si type === 'targeted_email'
  targetPhone?: string         // solo si type === 'targeted_phone'
  status: 'pending' | 'accepted' | 'expired' | 'revoked'
  createdAt: Timestamp
  expiresAt: Timestamp         // createdAt + 48 horas
  acceptedBy?: string          // uid del que lo usó
  acceptedAt?: Timestamp
}

// ─── USER ─────────────────────────────────────────────────────────────────────

export type UserStatus = 'pending' | 'active' | 'suspended'

export type User = {
  uid: string
  name: string
  email: string
  whatsapp: string             // solo dígitos, sin +54, sin guiones
  neighborhood: Neighborhood
  lotNumber: string            // texto libre: "Lote 42", "Casa 7B", etc.
  referredBy?: string          // uid del invitador, si llegó por link

  // Estado operativo
  status: UserStatus

  // Sistema de confianza (calculado, desnormalizado para performance)
  trustLevel: TrustLevel
  trustScore: number           // 0–100
  validationCount: number      // cuántos vecinos lo avalaron (desnormalizado)

  // Verificaciones (array extensible)
  verifications: Verification[]

  // Identidades sociales: NO se almacenan aquí
  // Se almacenan en /users/{uid}/private/identities
  // Solo se registra qué providers conectó (sin ID externo)
  connectedProviders?: SocialProvider[]

  createdAt: Timestamp
  updatedAt: Timestamp
}

// Lo que se expone al mostrar el perfil de otro usuario
// nunca el grafo, nunca los provider IDs
export type PublicTrustSignal = {
  trustLevel: TrustLevel
  trustScore: number
  validationCount: number
  mutualConnectionCount: number   // conexiones en común con el viewer (calculado en runtime)
  verifiedMethods: VerificationMethod[]  // qué tiene, no el detalle
}

// ─── LISTINGS ─────────────────────────────────────────────────────────────────

export type ListingStatus = 'active' | 'sold' | 'inactive'

export type Listing = {
  id: string
  title: string
  description: string
  price: number
  category: CategoryId
  photos: string[]             // URLs de Firebase Storage, max 5
  status: ListingStatus
  sellerId: string
  sellerName: string           // desnormalizado
  sellerWhatsapp: string       // desnormalizado
  sellerNeighborhood: Neighborhood  // desnormalizado
  sellerTrustLevel: TrustLevel      // desnormalizado para display en feed
  views: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ─── ANALYTICS EVENTS ─────────────────────────────────────────────────────────

export type AnalyticsEvent =
  | 'user_registered'
  | 'user_verified'
  | 'user_validated_by_peer'
  | 'listing_created'
  | 'listing_viewed'
  | 'listing_marked_sold'
  | 'listing_card_clicked'
  | 'whatsapp_clicked'
  | 'invite_created'
  | 'invite_accepted'
  | 'oauth_connected'
  | 'validation_sent'
  | 'feed_viewed'
  | 'feed_filtered'
