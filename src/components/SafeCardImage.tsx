'use client'

import { useState } from 'react'
import Image from 'next/image'

type Props = {
  src?: string | null
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  sizes?: string
}

export default function SafeCardImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = '',
  sizes,
}: Props) {
  const finalSrc = src && src.trim() !== '' ? src : '/placeholder.jpg'
  const [failed, setFailed] = useState(false)

  if (fill) {
    return (
      <Image
        key={`${finalSrc}-${failed ? 'raw' : 'optimized'}`}
        src={finalSrc}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        unoptimized={failed}
        onError={() => setFailed(true)}
      />
    )
  }

  return (
    <Image
      key={`${finalSrc}-${failed ? 'raw' : 'optimized'}`}
      src={finalSrc}
      alt={alt}
      width={width || 400}
      height={height || 300}
      className={className}
      sizes={sizes}
      unoptimized={failed}
      onError={() => setFailed(true)}
    />
  )
}