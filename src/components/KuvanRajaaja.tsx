'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { supabase } from '@/lib/supabaseClient'
import getCroppedImg from '../utils/cropImage'
import { Area } from 'react-easy-crop'

type Props = {
  file: File
  onDone: (url: string) => void
}

export default function KuvanRajaaja({ file, onDone }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>()

  const onCropComplete = useCallback((_croppedArea: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleCropAndUpload = async () => {
    if (!croppedAreaPixels) return
    const croppedBlob = await getCroppedImg(URL.createObjectURL(file), croppedAreaPixels)

    const fileName = `${Date.now()}_${file.name}`
    const { error } = await supabase.storage
      .from('kuvat')
      .upload(fileName, croppedBlob)

    if (error) {
      alert('Virhe latauksessa: ' + error.message)
    } else {
      const { data } = supabase.storage.from('kuvat').getPublicUrl(fileName)
      onDone(data.publicUrl)
    }
  }

  return (
    <div className="w-full h-[300px] relative bg-black">
      <Cropper
        image={URL.createObjectURL(file)}
        crop={crop}
        zoom={zoom}
        aspect={4 / 3}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
      />
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
        <button
          onClick={handleCropAndUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Rajaa ja lataa
        </button>
      </div>
    </div>
  )
}
