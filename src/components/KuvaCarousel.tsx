'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'

export default function KuvaCarousel({
  kuvaUrl,
  kuvat,
  alt = 'Ilmoituksen kuva',
  autoMs = 5000,
  max = 4,
}: {
  kuvaUrl?: string | null
  kuvat?: string[] | null
  alt?: string
  autoMs?: number
  max?: number
}) {
  const urls = useMemo(() => {
    const list = (kuvat ?? []).filter(Boolean).slice(0, max)
    if (list.length > 0) return list
    return kuvaUrl ? [kuvaUrl] : []
  }, [kuvat, kuvaUrl, max])

  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)

  // swipe
  const startX = useRef<number | null>(null)
  const deltaX = useRef<number>(0)

  useEffect(() => {
    if (urls.length <= 1) return
    if (paused) return

    const t = setInterval(() => {
      setI((p) => (p + 1) % urls.length)
    }, autoMs)

    return () => clearInterval(t)
  }, [urls.length, autoMs, paused])

  useEffect(() => {
    // jos urls muuttuu, varmista että index pysyy validina
    setI((p) => Math.min(p, Math.max(0, urls.length - 1)))
  }, [urls.length])

  if (urls.length === 0) return null

  const prev = () => setI((p) => (p - 1 + urls.length) % urls.length)
  const next = () => setI((p) => (p + 1) % urls.length)

  const onPointerDown = (e: React.PointerEvent) => {
    setPaused(true)
    startX.current = e.clientX
    deltaX.current = 0
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (startX.current === null) return
    deltaX.current = e.clientX - startX.current
  }

  const onPointerUp = () => {
    const dx = deltaX.current
    startX.current = null
    deltaX.current = 0

    // swipe threshold
    if (Math.abs(dx) > 40) {
      if (dx > 0) prev()
      else next()
    }

    // jatka autoplay pienen viiveen jälkeen
    setTimeout(() => setPaused(false), 1200)
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-gray-100"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={urls[i]}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 900px"
          priority
        />
      </div>

      {urls.length > 1 && (
        <>
          {/* nuolet */}
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 px-3 py-2 text-xl shadow"
            aria-label="Edellinen kuva"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 px-3 py-2 text-xl shadow"
            aria-label="Seuraava kuva"
          >
            ›
          </button>

          {/* pallot */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {urls.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setI(idx)}
                aria-label={`Näytä kuva ${idx + 1}`}
                className={`h-2.5 w-2.5 rounded-full ${
                  idx === i ? 'bg-white' : 'bg-white/55'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
