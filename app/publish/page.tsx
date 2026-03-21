'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Timestamp } from 'firebase/firestore'
import { useAuth } from '@/hooks/useAuth'
import { createListing } from '@/lib/firestore'
import { uploadListingPhoto } from '@/lib/storage'
import { trackEvent } from '@/lib/analytics'
import { canPublish } from '@/lib/trust'
import { CATEGORY_LABELS } from '@/constants/categories'
import { CategoryId } from '@/types'

const MAX_PHOTOS = 5
const CATEGORIES = Object.entries(CATEGORY_LABELS) as [CategoryId, string][]

export default function PublishPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState<CategoryId | ''>('')
  const [photos, setPhotos] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth')
    }
  }, [loading, user, router])

  useEffect(() => {
    // Generate preview URLs
    const urls = photos.map((f) => URL.createObjectURL(f))
    setPreviews(urls)
    return () => urls.forEach((u) => URL.revokeObjectURL(u))
  }, [photos])

  function handlePhotoAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const remaining = MAX_PHOTOS - photos.length
    if (remaining <= 0) return
    setPhotos((prev) => [...prev, ...files.slice(0, remaining)])
    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handlePhotoRemove(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !category) return

    if (!canPublish(user)) {
      setError('Tu cuenta necesita estar activa para publicar.')
      return
    }

    const priceNum = parseInt(price, 10)
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Ingresa un precio valido.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const now = Timestamp.now()

      // Create listing first to get the ID for photo paths
      const listingId = await createListing({
        title: title.trim(),
        description: description.trim(),
        price: priceNum,
        category,
        photos: [],
        status: 'active',
        sellerId: user.uid,
        sellerName: user.name,
        sellerWhatsapp: user.whatsapp,
        sellerNeighborhood: user.neighborhood,
        sellerTrustLevel: user.trustLevel,
        views: 0,
        createdAt: now,
        updatedAt: now,
      })

      // Upload photos
      let photoUrls: string[] = []
      if (photos.length > 0) {
        photoUrls = await Promise.all(
          photos.map((file, i) => uploadListingPhoto(file, listingId, i))
        )

        // Update listing with photo URLs
        const { updateListing } = await import('@/lib/firestore')
        await updateListing(listingId, { photos: photoUrls })
      }

      trackEvent('listing_created', {
        category,
        photoCount: photos.length,
        hasPrice: true,
      })

      router.push(`/listing/${listingId}`)
    } catch (err) {
      console.error('Publish error:', err)
      setError('Error al publicar. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-extrabold text-primary mb-2 tracking-tight">
          Crear publicacion
        </h1>
        <p className="text-on-surface-variant mb-10">
          Publica algo para tus vecinos de Nordelta.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photos */}
          <div>
            <label className="block text-sm font-bold text-on-surface mb-3">
              Fotos ({photos.length}/{MAX_PHOTOS})
            </label>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {previews.map((url, i) => (
                <div
                  key={i}
                  className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-low"
                >
                  <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handlePhotoRemove(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-on-surface/60 text-white rounded-full flex items-center justify-center text-xs hover:bg-on-surface/80"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              ))}
              {photos.length < MAX_PHOTOS && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-xl bg-surface-container-highest flex flex-col items-center justify-center gap-1 flex-shrink-0 hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined text-on-surface-variant">
                    add_photo_alternate
                  </span>
                  <span className="text-[10px] font-semibold text-on-surface-variant uppercase">
                    Agregar
                  </span>
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handlePhotoAdd}
              className="hidden"
            />
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-bold text-on-surface mb-2">
              Titulo
            </label>
            <input
              id="title"
              type="text"
              required
              maxLength={80}
              placeholder="Ej: Bicicleta rodado 20"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl px-4 py-3.5 text-on-surface placeholder:text-outline"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-bold text-on-surface mb-2">
              Descripcion
            </label>
            <textarea
              id="description"
              required
              maxLength={500}
              rows={4}
              placeholder="Describe tu producto o servicio..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl px-4 py-3.5 text-on-surface placeholder:text-outline resize-none"
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-bold text-on-surface mb-2">
              Precio (ARS)
            </label>
            <input
              id="price"
              type="number"
              required
              min={1}
              placeholder="50000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-xl px-4 py-3.5 text-on-surface placeholder:text-outline"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-bold text-on-surface mb-2">
              Categoria
            </label>
            <select
              id="category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryId)}
              className="w-full rounded-xl px-4 py-3.5 text-on-surface"
            >
              <option value="">Selecciona una categoria</option>
              {CATEGORIES.map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-error text-sm font-medium">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-signature-gradient text-white font-bold rounded-full px-4 py-4 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {submitting ? 'Publicando...' : 'Publicar'}
          </button>
        </form>
      </div>
    </main>
  )
}
