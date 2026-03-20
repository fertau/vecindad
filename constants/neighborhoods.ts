import { Neighborhood } from '@/types'

// NOTA: Verificar nombres exactos contra sitio oficial de Nordelta S.A.
// antes del lanzamiento. Algunos nombres pueden diferir.

export const NEIGHBORHOOD_LABELS: Record<Neighborhood, string> = {
  el_canton:           'El Cantón',
  los_alisos:          'Los Alisos',
  la_bahia:            'La Bahía',
  las_glorietas:       'Las Glorietas',
  los_tulipanes:       'Los Tulipanes',
  las_margaritas:      'Las Margaritas',
  el_portezuelo:       'El Portezuelo',
  la_comarca:          'La Comarca',
  los_castanos:        'Los Castaños',
  el_arroyo:           'El Arroyo',
  las_mananitas:       'Las Mañanitas',
  los_navegantes:      'Los Navegantes',
  la_laguna:           'La Laguna',
  el_palmar:           'El Palmar',
  las_acacias:         'Las Acacias',
  la_ribera:           'La Ribera',
  los_sauces:          'Los Sauces',
  el_faro:             'El Faro',
  la_alameda:          'La Alameda',
  los_tilos:           'Los Tilos',
  el_ensueno:          'El Ensueño',
  los_fresnos:         'Los Fresnos',
  la_orilla:           'La Orilla',
  el_encuentro:        'El Encuentro',
  rincon_de_milberg:   'Rincón de Milberg',
  remeros:             'Remeros',
  villanueva:          'Villanueva',
}

export const NEIGHBORHOODS_SORTED: Neighborhood[] =
  (Object.keys(NEIGHBORHOOD_LABELS) as Neighborhood[]).sort((a, b) =>
    NEIGHBORHOOD_LABELS[a].localeCompare(NEIGHBORHOOD_LABELS[b], 'es')
  )
