import { Neighborhood } from '@/types'

export const NEIGHBORHOOD_LABELS: Record<Neighborhood, string> = {
  bahia_grande:        'Bahia Grande',
  bahia_chica:         'Bahia Chica',
  el_golf:             'El Golf',
  el_hurling:          'El Hurling',
  los_lagos_del_golf:  'Los Lagos del Golf',
  la_isla:             'La Isla',
  los_castores:        'Los Castores',
  las_castoras:        'Las Castoras',
  portezuelo:          'Portezuelo',
  las_caletas:         'Las Caletas',
  las_glorietas:       'Las Glorietas',
  la_alameda:          'La Alameda',
  barrancas_del_lago:  'Barrancas del Lago',
  los_sauces:          'Los Sauces',
  cabos_del_lago:      'Cabos del Lago',
  los_alisos:          'Los Alisos',
  el_puerto:           'El Puerto',
  el_yacht:            'El Yacht',
  los_lagos:           'Los Lagos',
  lago_escondido:      'Lago Escondido',
  el_palmar:           'El Palmar',
  el_portal:           'El Portal',
  puerto_escondido:    'Puerto Escondido',
  sendero:             'Sendero',
  tipas:               'Tipas',
  islas_del_golf:      'Islas del Golf',
  virazon:             'Virazon',
  los_pinos:           'Los Pinos',
  islas_del_canal:     'Islas del Canal',
  los_castanos:        'Los Castanos',
  las_piedras:         'Las Piedras',
  los_puentes:         'Los Puentes',
  oceana:              'Oceana',
}

export const NEIGHBORHOODS_SORTED: Neighborhood[] =
  (Object.keys(NEIGHBORHOOD_LABELS) as Neighborhood[]).sort((a, b) =>
    NEIGHBORHOOD_LABELS[a].localeCompare(NEIGHBORHOOD_LABELS[b], 'es')
  )
