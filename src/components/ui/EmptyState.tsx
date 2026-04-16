type Props = {
  title: string
  description?: string
}

export default function EmptyState({ title, description }: Props) {
  return (
    <div className="text-center py-10">
      <p className="text-lg font-semibold text-[#1E3A41]">{title}</p>
      {description && (
        <p className="text-sm text-gray-500 mt-2">{description}</p>
      )}
    </div>
  )
}