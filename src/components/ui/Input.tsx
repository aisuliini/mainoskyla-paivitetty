import { InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export default function Input({
  label,
  error,
  className = '',
  ...props
}: Props) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 text-sm font-medium text-[#1E3A41]">
          {label}
        </label>
      )}

      <input
        className={`
          w-full px-3 py-2 rounded-lg border
          border-gray-300
          focus:outline-none focus:ring-2 focus:ring-[#4F6763]
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
}