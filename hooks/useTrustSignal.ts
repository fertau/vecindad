import { PublicTrustSignal } from '@/types'

// Hook que calcula la señal pública de confianza de un usuario
// para ser mostrada a otro usuario (el viewer).
// Incluye mutualConnectionCount calculado en runtime.

export function useTrustSignal(
  _targetUid: string,
  _viewerUid: string
): { signal: PublicTrustSignal | null; loading: boolean } {
  throw new Error('Not implemented')
}
