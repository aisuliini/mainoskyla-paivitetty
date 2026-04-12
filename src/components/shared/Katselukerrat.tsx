'use client'

import { Eye } from 'lucide-react'

type Props = {
  count: number
  small?: boolean
}

export default function Katselukerrat({ count, small }: Props) {
  return (
    <div className={`flex items-center gap-1 text-gray-500 ${small ? 'text-xs' : 'text-sm'}`}>
      <Eye size={small ? 14 : 18} strokeWidth={1.5} />
      {count} katselukertaa
    </div>
  )
}
