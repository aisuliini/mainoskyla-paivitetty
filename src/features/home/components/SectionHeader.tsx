type Props = {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

export default function SectionHeader({
  title,
  description,
  actions,
  className = '',
}: Props) {
  return (
    <div className={`flex items-center justify-between px-1 ${className}`}>
      <div className="text-left">
        <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[#1E3A41]">
          {title}
        </h2>

        {description ? (
          <p className="text-xs sm:text-sm text-charcoal/60 mt-1">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? <div className="hidden sm:flex items-center gap-2">{actions}</div> : null}
    </div>
  )
}