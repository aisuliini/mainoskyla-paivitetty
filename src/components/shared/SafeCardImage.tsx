'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'

type Props = {
  src?: string | null
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  sizes?: string
  priority?: boolean
}

export default function SafeCardImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = '',
  sizes,
  priority = false,
}: Props) {
  const safeSrc = useMemo(() => {
    const value = src?.trim()
    return value && value.length > 0 ? value : '/placeholder.png'
  }, [src])

  const [imgSrc, setImgSrc] = useState(safeSrc)

  useEffect(() => {
    setImgSrc(safeSrc)
  }, [safeSrc])

  const handleError = () => {
    if (imgSrc !== '/placeholder.png') {
      setImgSrc('/placeholder.png')
    }
  }

  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className={className}
        sizes={sizes || '100vw'}
        priority={priority}
        onError={handleError}
      />
    )
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width || 400}
      height={height || 300}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={handleError}
    />
  )
}