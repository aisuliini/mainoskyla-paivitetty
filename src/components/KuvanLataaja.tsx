'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import getCroppedImg from '../utils/cropImage'
import Image from 'next/image'


type Props = {
  onImageCropped: (croppedBlob: Blob) => void | Promise<void>
  aspectRatio?: number
  maxFileSizeMB?: number
  maxZoom?: number
  label?: string
}

const PrimaryButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    className="bg-[#4F6763] text-white px-4 py-2 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
    {...props}
  />
)

const SecondaryButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    className="px-4 py-2 rounded-xl border font-semibold hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
    {...props}
  />
)

function formatMB(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function KuvanLataaja({
  onImageCropped,
  aspectRatio = 4 / 3,
  maxFileSizeMB = 10,
  maxZoom = 3,
  label = 'Valitse kuva',
}: Props) {
  const [isProcessing, setIsProcessing] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [originalName, setOriginalName] = useState<string | null>(null)

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  

  // Clean up preview blob URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const accept = useMemo(() => 'image/*', [])

  const resetAll = () => {
    setError(null)
    setImageSrc(null)
    setOriginalName(null)
    setCroppedAreaPixels(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setPreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old)
      return null
    })

    // allow selecting the same file again
    if (inputRef.current) inputRef.current.value = ''
  }

  const onCropComplete = (_: Area, cropped: Area) => setCroppedAreaPixels(cropped)

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)

    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Valitse kuvatiedosto.')
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    const maxBytes = maxFileSizeMB * 1024 * 1024
    if (file.size > maxBytes) {
      setError(`Kuva on liian iso (${formatMB(file.size)}). Max ${maxFileSizeMB} MB.`)
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    setOriginalName(file.name)

    // Read as dataURL for Cropper
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setImageSrc(reader.result as string)
      // reset crop defaults
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setCroppedAreaPixels(null)
    }
    reader.onerror = () => {
      setError('Kuvan lukeminen epäonnistui.')
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleDone = async () => {
  if (!imageSrc || !croppedAreaPixels) {
    setError('Rajaa kuva ensin.')
    return
  }

  setError(null)
  setIsProcessing(true)

  try {
    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
    if (!croppedBlob) {
      setError('Kuvan rajaus epäonnistui.')
      return
    }

    const url = URL.createObjectURL(croppedBlob)
    setPreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old)
      return url
    })

    await onImageCropped(croppedBlob)

    setImageSrc(null)

    if (inputRef.current) inputRef.current.value = ''
  } catch (e) {
    console.error(e)
    setError('Kuvan käsittely epäonnistui.')
  } finally {
    setIsProcessing(false)
  }
}

  const handleCancelCropping = () => {
    // keep existing preview, just close cropper
    setImageSrc(null)
    setCroppedAreaPixels(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    // allow reselect same file
    if (inputRef.current) inputRef.current.value = ''
  }

  const openFileDialog = () => inputRef.current?.click()

  return (
    <div className="flex flex-col gap-4">
      {/* Picker + preview */}
      {!imageSrc ? (
        <>
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              onChange={onFileChange}
              className="hidden"
            />

            <PrimaryButton onClick={openFileDialog}>{label}</PrimaryButton>

            {previewUrl && (
              <SecondaryButton onClick={resetAll}>
                Poista kuva
              </SecondaryButton>
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {previewUrl ? (
            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <Image
  src={previewUrl}
  alt="Esikatselu"
  width={800}
  height={300}
  className="w-full h-[160px] object-cover"
/>
              <div className="p-3 flex items-center justify-between gap-3">
                <p className="text-sm text-gray-600 truncate">
                  {originalName ?? 'Valittu kuva'}
                </p>
                <SecondaryButton onClick={openFileDialog}>Vaihda kuva</SecondaryButton>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">Esikatsele kuvaa</p>
          )}
        </>
      ) : (
        <>
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="relative w-full h-64 bg-black rounded-2xl overflow-hidden border">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 min-w-[56px]">Zoom</label>
            <input
              type="range"
              min={1}
              max={maxZoom}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-600 tabular-nums w-12 text-right">
              {zoom.toFixed(2)}x
            </span>
          </div>

          <div className="flex gap-2">
            <PrimaryButton onClick={handleDone} disabled={!croppedAreaPixels || isProcessing}>
  {isProcessing ? 'Käsitellään kuvaa…' : 'Rajaa ja käytä kuva'}
</PrimaryButton>
            <SecondaryButton onClick={handleCancelCropping}>
              Peruuta
            </SecondaryButton>
          </div>

          <p className="text-xs text-gray-600">
            Vinkki: siirrä kuvaa raahaamalla ja zoomaa liu’ulla.
          </p>
        </>
      )}
    </div>
  )
}