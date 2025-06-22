'use client'

import { useState } from 'react'
import Cropper from 'react-easy-crop'
import getCroppedImg from '../utils/cropImage'
import type { Area } from 'react-easy-crop'

type Props = {
  onImageCropped: (croppedFile: Blob) => void
}

const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    {...props}
  />
)

export default function KuvanLataaja({ onImageCropped }: Props) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        setImageSrc(reader.result as string)
      }
    }
  }

  const onCropComplete = (_: Area, cropped: Area) => {
    setCroppedAreaPixels(cropped)
  }

  const handleDone = async () => {
    if (!imageSrc || !croppedAreaPixels) return
    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
    if (croppedBlob) {
      const file = new File([croppedBlob], 'cropped.jpg', { type: 'image/jpeg' })
      onImageCropped(file)
      setImageSrc(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {!imageSrc ? (
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
        />
      ) : (
        <>
          <div className="relative w-full h-64 bg-black">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <Button onClick={handleDone}>Rajaa ja käytä kuva</Button>
        </>
      )}
    </div>
  )
}
