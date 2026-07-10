// Icon identifiers to fetch from Iconifika API for the hero background
// Stroke-based icons (tabler/lucide) so they're visible as thin lines at low opacity
export const HERO_ICON_IDS = [
  // dev / software
  { set: 'lucide', name: 'code-2' },
  { set: 'lucide', name: 'terminal' },
  // online store / e-commerce
  { set: 'tabler', name: 'shopping-cart' },
  { set: 'tabler', name: 'credit-card' },
  // apps / mobile
  { set: 'tabler', name: 'device-mobile' },
  { set: 'lucide', name: 'layers' },
  // personas / social
  { set: 'tabler', name: 'user' },
  { set: 'tabler', name: 'heart' },
  // indicaciones / navegación
  { set: 'tabler', name: 'map-pin' },
  { set: 'tabler', name: 'arrow-right' },
  // analytics / datos
  { set: 'tabler', name: 'chart-bar' },
  { set: 'lucide', name: 'database' },
  // comunicación
  { set: 'tabler', name: 'message' },
  { set: 'tabler', name: 'bell' },
  // multimedia / misc
  { set: 'tabler', name: 'camera' },
  { set: 'tabler', name: 'star' },
]

// ponytail: keep empty export for any legacy imports
export const HERO_ICONS: { name: string; svg: string }[] = []
