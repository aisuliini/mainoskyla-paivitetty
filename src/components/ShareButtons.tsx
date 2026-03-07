'use client'

import { useMemo, useState } from 'react'

type Props = {
  title: string
  text?: string
  url?: string
  className?: string
}

export default function ShareButtons({ title, text, url, className }: Props) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = useMemo(() => {
    if (url) return url
    if (typeof window === 'undefined') return ''
    return window.location.href
  }, [url])

  const canNativeShare =
    typeof window !== 'undefined' && typeof navigator !== 'undefined' && !!navigator.share

  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedText = encodeURIComponent(text ?? title)

  const onShareClick = async () => {
    // 1) Mobiili: natiivi jakovalikko (paras)
    if (canNativeShare) {
      try {
        await navigator.share({
          title,
          text: text ?? title,
          url: shareUrl,
        })
      } catch {
        // peruutus -> ei mitään
      }
      return
    }

    // 2) Desktop fallback: oma pikavalikko
    setOpen((v) => !v)
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = shareUrl
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
    setOpen(false)
  }

  const whatsappHref = `https://wa.me/?text=${encodedText}%20${encodedUrl}`
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`

  return (
    <div className={`relative inline-block ${className ?? ''}`}>
      {/* YKSI nappi */}
      <button
        type="button"
        onClick={onShareClick}
        className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Jaa
      </button>

      {/* Fallback-menu vain jos EI natiivia sharea */}
      {!canNativeShare && open && (
        <div className="absolute left-0 mt-2 w-56 rounded-xl border bg-white p-2 shadow-lg z-50">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
          >
            WhatsApp
          </a>

          <a
            href={facebookHref}
            target="_blank"
            rel="noreferrer"
            className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
          >
            Facebook
          </a>

          <button
            type="button"
            onClick={copyLink}
            className="w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
          >
            {copied ? 'Linkki kopioitu ✓' : 'Kopioi linkki'}
          </button>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full text-left rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-50"
          >
            Sulje
          </button>
        </div>
      )}
    </div>
  )
}