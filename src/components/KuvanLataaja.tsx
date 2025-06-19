'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Props = {
  onUrl: (url: string) => void
}

export default function KuvanLataaja({ onUrl }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    const fileName = `${Date.now()}_${file.name}`

    const { error } = await supabase.storage
      .from('ilmoitukset')
      .upload(fileName, file)

    if (error) {
      alert('Virhe kuvan latauksessa: ' + error.message)
    } else {
      const { publicUrl } = supabase
        .storage
        .from('ilmoitukset')
        .getPublicUrl(fileName).data

      onUrl(publicUrl)
    }

    setUploading(false)
  }

  return (
    <div className="mb-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-2"
      />
      {file && (
        <div className="mb-4">
          <img
            src={URL.createObjectURL(file)}
            alt="Esikatselu"
            className="h-32 w-auto rounded shadow"
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {uploading ? 'Ladataan...' : 'Lataa kuva'}
      </button>
    </div>
  )
}
