'use client'

import { useState } from 'react'
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/hooks/useAuth'
import { Listing } from '@/types'

const SEED_LISTINGS: Omit<Listing, 'id'>[] = [
  {
    title: 'Bicicleta rodado 20 casi nueva',
    description: 'Solo 6 meses de uso, ideal para chicos de 6-9 anos. Incluye rueditas estabilizadoras. Se entrega en el club house de Los Castores.',
    price: 145000,
    category: 'sports',
    photos: ['https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&h=600&fit=crop'],
    status: 'active',
    sellerId: 'seed-user-1',
    sellerName: 'Ana G.',
    sellerWhatsapp: '1155001001',
    sellerNeighborhood: 'los_castores',
    sellerTrustLevel: 'verified',
    views: 24,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
  },
  {
    title: 'Servicio de jardineria y paisajismo',
    description: 'Especialista en podas, cercos vivos y mantenimiento de jardines. Conozco perfectamente el suelo de Nordelta. Presupuesto sin cargo. Trabajo en todos los barrios.',
    price: 35000,
    category: 'services',
    photos: ['https://images.unsplash.com/photo-1558904541-efa843a96f01?w=600&h=600&fit=crop'],
    status: 'active',
    sellerId: 'seed-user-2',
    sellerName: 'Carlos R.',
    sellerWhatsapp: '1155002002',
    sellerNeighborhood: 'el_golf',
    sellerTrustLevel: 'trusted',
    views: 67,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
  },
  {
    title: 'Tortas caseras para eventos y cumples',
    description: 'Hago tortas decoradas, cupcakes y mesas dulces. Especial para cumples infantiles. Entregas en Nordelta sin cargo. Pedidos con 48hs de anticipacion.',
    price: 25000,
    category: 'services',
    photos: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop'],
    status: 'active',
    sellerId: 'seed-user-3',
    sellerName: 'Laura B.',
    sellerWhatsapp: '1155003003',
    sellerNeighborhood: 'el_golf',
    sellerTrustLevel: 'verified',
    views: 41,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
  },
  {
    title: 'PlayStation 5 con 2 joysticks',
    description: 'PS5 version disco, incluye 2 joysticks DualSense y 3 juegos fisicos (FIFA 25, Spider-Man 2, God of War). Impecable estado, poco uso.',
    price: 850000,
    category: 'tech',
    photos: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop'],
    status: 'active',
    sellerId: 'seed-user-4',
    sellerName: 'Martin D.',
    sellerWhatsapp: '1155004004',
    sellerNeighborhood: 'bahia_grande',
    sellerTrustLevel: 'verified',
    views: 53,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
  },
  {
    title: 'Mesa de jardin con 6 sillas',
    description: 'Mesa de madera de quebracho con 6 sillas, ideal para quincho o galeria. Esta en perfectas condiciones. Se retira por Portezuelo.',
    price: 320000,
    category: 'garden',
    photos: ['https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&h=600&fit=crop'],
    status: 'active',
    sellerId: 'seed-user-5',
    sellerName: 'Patricia M.',
    sellerWhatsapp: '1155005005',
    sellerNeighborhood: 'portezuelo',
    sellerTrustLevel: 'trusted',
    views: 18,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)),
  },
  {
    title: 'Clases de natacion para chicos',
    description: 'Profesora de natacion certificada. Clases particulares o en grupo (max 4 chicos) en pileta de tu barrio. Experiencia con bebes desde 6 meses. Horarios flexibles.',
    price: 18000,
    category: 'services',
    photos: ['https://images.unsplash.com/photo-1560089000-7433a4ebbd64?w=600&h=600&fit=crop'],
    status: 'active',
    sellerId: 'seed-user-6',
    sellerName: 'Valentina S.',
    sellerWhatsapp: '1155006006',
    sellerNeighborhood: 'la_isla',
    sellerTrustLevel: 'verified',
    views: 35,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)),
  },
  {
    title: 'Sillon esquinero 3 cuerpos',
    description: 'Sillon esquinero en L, tapizado gris claro, muy comodo. Medidas: 2.80 x 1.80. Excelente estado, solo 2 anos de uso. Se entrega con almohadones.',
    price: 480000,
    category: 'furniture',
    photos: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop'],
    status: 'active',
    sellerId: 'seed-user-7',
    sellerName: 'Diego F.',
    sellerWhatsapp: '1155007007',
    sellerNeighborhood: 'el_yacht',
    sellerTrustLevel: 'basic',
    views: 29,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
  },
  {
    title: 'Reparacion de PCs y notebooks a domicilio',
    description: 'Tecnico en sistemas. Formateo, limpieza de virus, upgrade de RAM/SSD, redes WiFi. Voy a domicilio sin cargo de visita en todo Nordelta. Presupuesto en el momento.',
    price: 15000,
    category: 'services',
    photos: ['https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&h=600&fit=crop'],
    status: 'active',
    sellerId: 'seed-user-8',
    sellerName: 'Federico T.',
    sellerWhatsapp: '1155008008',
    sellerNeighborhood: 'los_lagos',
    sellerTrustLevel: 'trusted',
    views: 82,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)),
  },
]

export default function SeedPage() {
  const { user, loading: authLoading } = useAuth()
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSeed() {
    if (!user) return
    setStatus('loading')
    setMessage('Creando listings...')
    try {
      for (const listing of SEED_LISTINGS) {
        const ref = doc(collection(db, 'listings'))
        // Usamos el UID del usuario logueado para pasar las Firestore rules
        await setDoc(ref, { ...listing, id: ref.id, sellerId: user.uid })
      }
      setStatus('done')
      setMessage(`${SEED_LISTINGS.length} listings creados exitosamente!`)
    } catch (err: unknown) {
      setStatus('error')
      setMessage(`Error: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">Acceso restringido</h1>
        <p className="text-on-surface-variant">Necesitas estar logueado para cargar datos de prueba.</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-primary mb-2">Seed Data</h1>
      <p className="text-on-surface-variant mb-8">
        Carga {SEED_LISTINGS.length} listings de ejemplo en Firestore para que el feed no este vacio.
      </p>

      <button
        onClick={handleSeed}
        disabled={status === 'loading' || status === 'done'}
        className={`w-full py-4 rounded-full font-bold text-white transition-all active:scale-95 ${
          status === 'done'
            ? 'bg-secondary'
            : status === 'error'
            ? 'bg-error'
            : 'bg-signature-gradient hover:shadow-xl'
        } disabled:opacity-50`}
      >
        {status === 'loading'
          ? 'Creando...'
          : status === 'done'
          ? 'Listo!'
          : 'Cargar listings de prueba'}
      </button>

      {message && (
        <p className={`mt-4 text-center font-medium ${status === 'error' ? 'text-error' : 'text-secondary'}`}>
          {message}
        </p>
      )}

      {status === 'done' && (
        <a
          href="/feed"
          className="block mt-6 text-center text-primary font-bold underline"
        >
          Ver el feed →
        </a>
      )}
    </div>
  )
}
