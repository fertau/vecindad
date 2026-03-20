import { CategoryId } from '@/types'

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  furniture:   'Muebles',
  appliances:  'Electrodomésticos',
  clothing:    'Ropa y calzado',
  sports:      'Deportes y bicicletas',
  toys:        'Juguetes',
  garden:      'Jardín y exterior',
  services:    'Servicios',
  vehicles:    'Autos y motos',
  tech:        'Tecnología',
  other:       'Otros',
}

export const CATEGORY_ICONS: Record<CategoryId, string> = {
  furniture:   '🛋️',
  appliances:  '🏠',
  clothing:    '👕',
  sports:      '🚲',
  toys:        '🧸',
  garden:      '🌿',
  services:    '🔧',
  vehicles:    '🚗',
  tech:        '💻',
  other:       '📦',
}
