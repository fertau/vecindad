'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getActiveListings } from '@/lib/firestore'
import { trackEvent } from '@/lib/analytics'
import { CATEGORY_LABELS } from '@/constants/categories'
import { NEIGHBORHOOD_LABELS } from '@/constants/neighborhoods'
import { Listing, CategoryId, TrustLevel } from '@/types'

const CATEGORY_MATERIAL_ICONS: Record<CategoryId, string> = {
  furniture:  'chair',
  appliances: 'kitchen',
  clothing:   'checkroom',
  sports:     'pedal_bike',
  toys:       'toys',
  garden:     'yard',
  services:   'build',
  vehicles:   'directions_car',
  tech:       'devices',
  other:      'inventory_2',
}

const TRUST_BADGE: Record<TrustLevel, { icon: string; label: string; show: boolean }> = {
  unverified: { icon: '', label: '', show: false },
  basic:      { icon: '', label: '', show: false },
  verified:   { icon: 'verified_user', label: 'Verificado', show: true },
  trusted:    { icon: 'verified_user', label: 'De Confianza', show: true },
}

type SortOption = 'recent' | 'price_asc' | 'price_desc'

export default function FeedPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null)
  const [sort, setSort] = useState<SortOption>('recent')

  useEffect(() => {
    async function load() {
      try {
        const data = await getActiveListings()
        setListings(data)
        trackEvent('feed_viewed', { count: data.length })
      } catch (err) {
        console.error('Error loading feed:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = listings
    .filter((l) => !activeCategory || l.category === activeCategory)
    .sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price
      if (sort === 'price_desc') return b.price - a.price
      return 0 // already sorted by createdAt desc from Firestore
    })

  function handleCategoryClick(cat: CategoryId | null) {
    setActiveCategory(cat)
    trackEvent('feed_filtered', { category: cat ?? 'all' })
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 pb-32 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">
          Explorar
        </h1>
        <p className="text-on-surface-variant mt-1">
          {filtered.length} publicacion{filtered.length !== 1 ? 'es' : ''} activa{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4">
        <button
          onClick={() => handleCategoryClick(null)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all active:scale-95 ${
            activeCategory === null
              ? 'bg-primary text-white'
              : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">apps</span>
          Todas
        </button>
        {(Object.entries(CATEGORY_LABELS) as [CategoryId, string][]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => handleCategoryClick(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all active:scale-95 ${
              activeCategory === id
                ? 'bg-primary text-white'
                : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {CATEGORY_MATERIAL_ICONS[id]}
            </span>
            {label}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex justify-end mb-6">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="text-sm rounded-full px-4 py-2 bg-surface-container-highest text-on-surface-variant font-semibold"
        >
          <option value="recent">Mas recientes</option>
          <option value="price_asc">Menor precio</option>
          <option value="price_desc">Mayor precio</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-24 space-y-4">
          <span className="material-symbols-outlined text-[80px] text-outline-variant/30">
            storefront
          </span>
          <p className="text-on-surface-variant text-lg font-medium">
            {activeCategory
              ? 'No hay publicaciones en esta categoria.'
              : 'Todavia no hay publicaciones.'}
          </p>
          <Link
            href="/publish"
            className="inline-block bg-signature-gradient text-white px-8 py-3 rounded-full font-bold hover:shadow-xl transition-all active:scale-95"
          >
            Publicar ahora
          </Link>
        </div>
      )}

      {/* Listing grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </main>
  )
}

function ListingCard({ listing }: { listing: Listing }) {
  const trust = TRUST_BADGE[listing.sellerTrustLevel]

  const whatsappUrl = `https://wa.me/549${listing.sellerWhatsapp}?text=${encodeURIComponent(
    `Hola ${listing.sellerName}! Vi tu publicacion "${listing.title}" en Vecindad. Sigue disponible?`
  )}`

  function handleCardClick() {
    trackEvent('listing_card_clicked', {
      listingId: listing.id,
      category: listing.category,
    })
  }

  function handleWhatsApp(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    trackEvent('whatsapp_clicked', {
      listingId: listing.id,
      sellerId: listing.sellerId,
      source: 'feed',
    })
    window.open(whatsappUrl, '_blank')
  }

  return (
    <Link
      href={`/listing/${listing.id}`}
      onClick={handleCardClick}
      className="group bg-surface-container-lowest rounded-2xl overflow-hidden ghost-border hover:shadow-lg transition-all"
    >
      {/* Photo */}
      <div className="relative aspect-square bg-surface-container-low">
        {listing.photos.length > 0 ? (
          <img
            src={listing.photos[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[48px] text-outline-variant/30">
              image
            </span>
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            {CATEGORY_LABELS[listing.category]}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <h3 className="font-bold text-on-surface text-sm leading-tight line-clamp-2">
          {listing.title}
        </h3>
        <p className="text-primary font-extrabold text-lg">
          ${listing.price.toLocaleString('es-AR')}
        </p>

        {/* Seller */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-bold text-on-primary">
              {listing.sellerName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-on-surface-variant truncate">
              {listing.sellerName}
            </p>
            {trust.show && (
              <div className="flex items-center gap-0.5 text-secondary">
                <span
                  className="material-symbols-outlined text-[12px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {trust.icon}
                </span>
                <span className="text-[10px] font-bold">{trust.label}</span>
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        <p className="text-[11px] text-on-surface-variant flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">location_on</span>
          {NEIGHBORHOOD_LABELS[listing.sellerNeighborhood]}
        </p>

        {/* WhatsApp button */}
        <button
          onClick={handleWhatsApp}
          className="w-full bg-whatsapp text-white py-2 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-90 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">chat</span>
          WhatsApp
        </button>
      </div>
    </Link>
  )
}
