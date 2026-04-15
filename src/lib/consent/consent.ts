export type CookieConsent = {
  necessary: true
  analytics: boolean
  marketing: boolean
  version: number
  updatedAt: string
}

export const CONSENT_KEY = 'mainoskyla-cookie-consent'
export const CONSENT_VERSION = 1

export function getDefaultConsent(): CookieConsent {
  return {
    necessary: true,
    analytics: false,
    marketing: false,
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  }
}

export function getAcceptAllConsent(): CookieConsent {
  return {
    necessary: true,
    analytics: true,
    marketing: true,
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  }
}

export function getNecessaryOnlyConsent(): CookieConsent {
  return {
    necessary: true,
    analytics: false,
    marketing: false,
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  }
}

export function readConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null

  const raw = window.localStorage.getItem(CONSENT_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as Partial<CookieConsent>

    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      parsed.necessary !== true ||
      typeof parsed.analytics !== 'boolean' ||
      typeof parsed.marketing !== 'boolean' ||
      typeof parsed.version !== 'number' ||
      typeof parsed.updatedAt !== 'string'
    ) {
      return null
    }

    return {
      necessary: true,
      analytics: parsed.analytics,
      marketing: parsed.marketing,
      version: parsed.version,
      updatedAt: parsed.updatedAt,
    }
  } catch {
    return null
  }
}

export function writeConsent(consent: CookieConsent) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(CONSENT_KEY, JSON.stringify(consent))
  window.dispatchEvent(new Event('cookie-consent-updated'))
}

export function clearConsent() {
  if (typeof window === 'undefined') return

  window.localStorage.removeItem(CONSENT_KEY)
  window.dispatchEvent(new Event('cookie-consent-updated'))
}

export function hasSavedConsent(): boolean {
  return readConsent() !== null
}

export function hasAnalyticsConsent(): boolean {
  return readConsent()?.analytics === true
}

export function hasMarketingConsent(): boolean {
  return readConsent()?.marketing === true
}