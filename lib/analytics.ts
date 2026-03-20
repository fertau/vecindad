import posthog from 'posthog-js'
import { AnalyticsEvent } from '@/types'

let initialized = false

export function initAnalytics(): void {
  if (initialized || typeof window === 'undefined') return
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: 'https://app.posthog.com',
    capture_pageview: true,
    capture_pageleave: true,
    persistence: 'localStorage',
    autocapture: false,        // solo eventos explícitos
  })

  initialized = true
}

export function identifyUser(uid: string, properties?: Record<string, unknown>): void {
  posthog.identify(uid, properties)
}

export function trackEvent(
  event: AnalyticsEvent,
  properties?: Record<string, unknown>
): void {
  posthog.capture(event, properties)
}

export function resetAnalytics(): void {
  posthog.reset()
}
