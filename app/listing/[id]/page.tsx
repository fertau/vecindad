'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getListing } from '@/lib/firestore'
import { trackEvent } from '@/lib/analytics'
import { NEIGHBORHOOD_LABELS } from '@/constants/neighborhoods'
import { CATEGORY_LABELS } from '@/constants/categories'
import { Listing, TrustLevel } from '@/types'

const TRUST_BADGE: Record<TrustLevel, { label: string; show: boolean }> = {
  unverified: { label: '', show: false },
  basic:      { label: 'Vecino Basico', show: false },
  verified:   { label: 'Vecino Verificado', show: true },
  trusted:    { label: 'Vecino de Confianza', show: true },
}

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [photoIndex, setPhotoIndex] = useState(0)

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getListing(params.id)
        if (!data) {
          router.replace('/')
          return
        }
        setListing(data)
        trackEvent('listing_viewed', { listingId: params.id, category: data.category })
      } catch (err) {
        console.error('Error fetching listing:', err)
        router.replace('/')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!listing) return null

  const trustBadge = TRUST_BADGE[listing.sellerTrustLevel]
  const whatsappUrl = `https://wa.me/549${listing.sellerWhatsapp}?text=${encodeURIComponent(
    `Hola ${listing.sellerName}! Vi tu publicacion "${listing.title}" en Vecindad. Sigue disponible?`
  )}`

  function handleWhatsAppClick() {
    trackEvent('whatsapp_clicked', { listingId: listing!.id, sellerId: listing!.sellerId })
    window.open(whatsappUrl, '_blank')
  }

  return (
    <main className="max-w-4xl mx-auto pb-32">
      {/* Photo Carousel */}
      <section className="p-6">
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-surface-container-low">
          {listing.photos.length > 0 ? (
            <>
              <img
                src={listing.photos[photoIndex]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              {listing.photos.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {listing.photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPhotoIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        i === photoIndex
                          ? 'bg-white scale-110'
                          : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[100px] text-outline-variant/30">
                image
              </span>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {CATEGORY_LABELS[listing.category]}
            </span>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="px-6 space-y-8">
        {/* Title + Price */}
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1 flex-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-primary">
              {listing.title}
            </h1>
            <p className="text-on-surface-variant font-medium">
              {NEIGHBORHOOD_LABELS[listing.sellerNeighborhood]}
            </p>
          </div>
          <div className="text-3xl font-bold text-primary flex-shrink-0">
            ${listing.price.toLocaleString('es-AR')}
          </div>
        </div>

        {/* Seller Card */}
        <div className="bg-surface-container-lowest p-6 rounded-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xl font-bold text-on-primary">
                  {listing.sellerName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-on-surface">{listing.sellerName}</h3>
                {trustBadge.show && (
                  <div className="flex items-center gap-1 text-secondary text-sm font-bold">
                    <span
                      className="material-symbols-outlined text-sm"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified_user
                    </span>
                    {trustBadge.label}
                  </div>
                )}
              </div>
            </div>
          </div>

          {listing.description && (
            <p className="text-on-surface-variant leading-relaxed">
              &quot;{listing.description}&quot;
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container flex items-center gap-3 p-3 rounded-lg">
              <span className="material-symbols-outlined text-primary">location_on</span>
              <div className="text-xs">
                <p className="text-on-surface-variant font-medium">Barrio</p>
                <p className="font-bold text-on-surface">
                  {NEIGHBORHOOD_LABELS[listing.sellerNeighborhood]}
                </p>
              </div>
            </div>
            <div className="bg-surface-container flex items-center gap-3 p-3 rounded-lg">
              <span className="material-symbols-outlined text-primary">visibility</span>
              <div className="text-xs">
                <p className="text-on-surface-variant font-medium">Vistas</p>
                <p className="font-bold text-on-surface">{listing.views}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp CTA */}
      <div className="fixed bottom-24 left-0 w-full px-6 z-40 md:static md:px-6 md:mt-12">
        <div className="bg-surface-bright/80 backdrop-blur-xl p-4 rounded-2xl flex gap-3 shadow-[0_-4px_24px_rgba(28,28,23,0.06)] ghost-border">
          <button
            onClick={handleWhatsAppClick}
            className="flex-1 bg-whatsapp text-white py-4 rounded-full font-bold text-lg flex justify-center items-center gap-3 hover:opacity-90 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">chat</span>
            Contactar por WhatsApp
          </button>
        </div>
      </div>
    </main>
  )
}
