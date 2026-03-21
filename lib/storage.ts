import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function uploadListingPhoto(
  file: File,
  listingId: string,
  index: number
): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Formato no soportado. Usa JPG, PNG o WebP.')
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('La imagen no puede superar los 5 MB.')
  }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `listings/${listingId}/${index}.${ext}`
  const storageRef = ref(storage, path)

  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}
