import { Area } from 'react-easy-crop'

export default function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = imageSrc
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = pixelCrop.width
      canvas.height = pixelCrop.height
      const ctx = canvas.getContext('2d')

      if (!ctx) return reject('Canvas ei toimi')

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      )

      canvas.toBlob((blob) => {
        if (blob) {
          // 🔧 MUUTOS: blob -> file
          const file = new File([blob], `rajaus_${Date.now()}.jpg`, {
            type: 'image/jpeg',
          })
          resolve(file)
        } else {
          reject('Rajaus epäonnistui')
        }
      }, 'image/jpeg')
    }
    image.onerror = reject
  })
}
