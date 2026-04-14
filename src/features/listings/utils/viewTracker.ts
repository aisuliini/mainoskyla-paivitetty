const VIEW_TTL_MS = 30 * 60 * 1000

function getKey(id: string) {
  return `mainoskyla:view:${id}`
}

export function hasRecentView(id: string) {
  if (typeof window === 'undefined') return false

  const raw = localStorage.getItem(getKey(id))
  if (!raw) return false

  const ts = Number(raw)
  return Date.now() - ts < VIEW_TTL_MS
}

export function markView(id: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(getKey(id), String(Date.now()))
}

export async function registerView(id: string) {
  if (!id || typeof window === 'undefined') return false

  if (hasRecentView(id)) return false

  try {
    const res = await fetch('/api/ilmoitus/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
      keepalive: true,
    })

    if (!res.ok) return false

    markView(id)
    return true
  } catch {
    return false
  }
}