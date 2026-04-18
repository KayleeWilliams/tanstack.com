import type { AnalyticsProvider } from '../types'

export const googleAnalyticsProvider: AnalyticsProvider = {
  trackEvent(event, properties) {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
      return
    }

    window.gtag('event', event, properties)
  },
}
