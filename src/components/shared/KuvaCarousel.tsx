'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
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
    const list = (kuvat ?? [])
      .filter((url): url is string => typeof url === 'string' && url.trim() !== '')
      .slice(0, max)

    if (list.length > 0) return list
    return kuvaUrl && kuvaUrl.trim() !== '' ? [kuvaUrl] : []
  }, [kuvat, kuvaUrl, max])

  const urlsKey = useMemo(() => urls.join('|'), [urls])

  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({})

  const startX = useRef<number | null>(null)
  const deltaX = useRef<number>(0)
  const resumeTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current)
    }
  }, [])

  useEffect(() => {
    setI(0)
  }, [urlsKey])

  useEffect(() => {
    if (urls.length <= 1) return
    if (paused) return

    const t = window.setInterval(() => {
      setI((p) => (p + 1) % urls.length)
    }, autoMs)

    return () => window.clearInterval(t)
  }, [urlsKey, urls.length, autoMs, paused])

  if (urls.length === 0) return null

  const currentUrl = urls[i]
  const useUnoptimized = !!failedUrls[currentUrl]

  const prev = () => setI((p) => (p - 1 + urls.length) % urls.length)
  const next = () => setI((p) => (p + 1) % urls.length)

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    setPaused(true)
    startX.current = e.clientX
    deltaX.current = 0
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return
    deltaX.current = e.clientX - startX.current
  }

  const onPointerUp = () => {
    const dx = deltaX.current
    startX.current = null
    deltaX.current = 0

    if (Math.abs(dx) > 40) {
      if (dx > 0) prev()
      else next()
    }

    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = window.setTimeout(() => setPaused(false), 1200)
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
      <div className="w-full">
        <Image
          key={`${currentUrl}-${useUnoptimized ? 'raw' : 'optimized'}`}
          src={currentUrl}
          alt={alt}
          width={1600}
          height={900}
          className="block h-auto w-full object-cover"
          sizes="(max-width: 768px) 100vw, 900px"
          priority={i === 0}
          unoptimized={useUnoptimized}
          onError={() => {
            setFailedUrls((prev) => {
              if (prev[currentUrl]) return prev
              return { ...prev, [currentUrl]: true }
            })
          }}
        />
      </div>

      {urls.length > 1 && (
        <>
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

          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {urls.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setI(idx)}
                aria-label={`Näytä kuva ${idx + 1}`}
                className={`h-2.5 w-2.5 rounded-full ${idx === i ? 'bg-white' : 'bg-white/55'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}