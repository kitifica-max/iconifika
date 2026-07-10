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

// Slide 2 — StatsSlide: naturaleza, viaje, salud, educación, clima
export const STATS_ICON_IDS = [
  { set: 'tabler', name: 'leaf' },
  { set: 'tabler', name: 'plane' },
  { set: 'tabler', name: 'heartbeat' },
  { set: 'tabler', name: 'school' },
  { set: 'tabler', name: 'cloud' },
  { set: 'tabler', name: 'bike' },
  { set: 'tabler', name: 'pizza' },
  { set: 'tabler', name: 'music' },
  { set: 'tabler', name: 'sun' },
  { set: 'tabler', name: 'tree' },
]

// Slide 3 — InstallSlide: herramientas, construcción, ciencia, trabajo, finanzas
export const INSTALL_ICON_IDS = [
  { set: 'tabler', name: 'tools' },
  { set: 'tabler', name: 'building' },
  { set: 'tabler', name: 'flask' },
  { set: 'tabler', name: 'briefcase' },
  { set: 'tabler', name: 'coin' },
  { set: 'tabler', name: 'rocket' },
  { set: 'tabler', name: 'shield' },
  { set: 'tabler', name: 'lock' },
  { set: 'tabler', name: 'truck' },
  { set: 'tabler', name: 'printer' },
]

// HeroSlide — brand logos strip (prestigiosas librerías de iconos)
export const BRAND_ICON_IDS = [
  { set: 'simple-icons', name: 'materialdesign', label: 'Material' },
  { set: 'simple-icons', name: 'tailwindcss', label: 'Tailwind' },
  { set: 'simple-icons', name: 'bootstrap', label: 'Bootstrap' },
  { set: 'simple-icons', name: 'figma', label: 'Figma' },
  { set: 'simple-icons', name: 'github', label: 'GitHub' },
  { set: 'simple-icons', name: 'fontawesome', label: 'Font Awesome' },
  { set: 'simple-icons', name: 'antdesign', label: 'Ant Design' },
  { set: 'simple-icons', name: 'ionic', label: 'Ionic' },
  { set: 'simple-icons', name: 'phosphoricons', label: 'Phosphor' },
  { set: 'simple-icons', name: 'lucide', label: 'Lucide' },
]

// Slide 4 — UseSlide: arte, moda, gaming, hogar, mascotas
export const USE_ICON_IDS = [
  { set: 'tabler', name: 'palette' },
  { set: 'tabler', name: 'shirt' },
  { set: 'tabler', name: 'device-gamepad' },
  { set: 'tabler', name: 'home' },
  { set: 'tabler', name: 'paw' },
  { set: 'tabler', name: 'gift' },
  { set: 'tabler', name: 'crown' },
  { set: 'tabler', name: 'flag' },
  { set: 'tabler', name: 'umbrella' },
  { set: 'tabler', name: 'book' },
]
