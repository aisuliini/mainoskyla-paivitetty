type Props = {
  size?: 'sm' | 'md' | 'lg'
}

export default function Spinner({ size = 'md' }: Props) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  }

  return (
    <div
      className={`
        ${sizes[size]}
        border-2 border-white border-t-transparent
        rounded-full animate-spin
      `}
    />
  )
}