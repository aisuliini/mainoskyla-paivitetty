type Props = {
  title?: string
  description?: string
  onRetry?: () => void
}

export default function ErrorState({
  title = 'Jokin meni pieleen',
  description,
  onRetry,
}: Props) {
  return (
    <div className="text-center py-10">
      <p className="text-lg font-semibold text-red-600">{title}</p>

      {description && (
        <p className="text-sm text-gray-500 mt-2">{description}</p>
      )}

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-[#4F6763] text-white rounded-lg"
        >
          Yritä uudelleen
        </button>
      )}
    </div>
  )
}