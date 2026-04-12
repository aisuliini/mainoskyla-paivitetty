'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  title: string
  text?: string
  url?: string
  className?: string
}

export default function ShareButtons({ title, text, url, className }: Props) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const shareUrl = useMemo(() => {
    if (url) return url
    if (typeof window === 'undefined') return ''
    return window.location.href
  }, [url])

  const canNativeShare =
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function'

  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedText = encodeURIComponent(text ?? title)

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return
      if (!menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

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

  const nativeShare = async () => {
    if (!canNativeShare) return

    try {
      await navigator.share({
        title,
        text: text ?? title,
        url: shareUrl,
      })
    } catch {
      // käyttäjä perui tai kohde-appi ei vienyt loppuun
    } finally {
      setOpen(false)
    }
  }

  const whatsappHref = `https://wa.me/?text=${encodedText}%20${encodedUrl}`
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`

  return (
    <div ref={menuRef} className={`relative inline-block ${className ?? ''}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Jaa
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-56 rounded-xl border bg-white p-2 shadow-lg z-50">
          <button
            type="button"
            onClick={copyLink}
            className="w-full text-left rounded-lg px-3 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            {copied ? 'Linkki kopioitu ✓' : 'Kopioi linkki'}
          </button>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            Jaa WhatsAppiin
          </a>

          <a
            href={facebookHref}
            target="_blank"
            rel="noreferrer"
            className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            Jaa Facebookiin
          </a>

          {canNativeShare && (
            <button
              type="button"
              onClick={nativeShare}
              className="w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
            >
              Jaa puhelimen valikolla
            </button>
          )}

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