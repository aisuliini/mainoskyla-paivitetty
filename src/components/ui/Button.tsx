'use client'

import { ButtonHTMLAttributes } from 'react'
import Spinner from './Spinner'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
}

export default function Button({
  children,
  className = '',
  loading = false,
  disabled,
  ...props
}: Props) {
  return (
    <button
      className={`
        px-4 py-2 rounded-lg
        bg-[#4F6763] text-white
        hover:bg-[#6A837F]
        transition
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
}