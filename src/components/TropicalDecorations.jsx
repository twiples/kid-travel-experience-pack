// Costa Rica-inspired decorative SVG elements

export function ToucanIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Body */}
      <ellipse cx="38" cy="36" rx="18" ry="20" fill="#1a1a2e"/>
      {/* Wing detail */}
      <ellipse cx="42" cy="38" rx="10" ry="12" fill="#2d3436"/>
      {/* Head */}
      <circle cx="24" cy="24" r="14" fill="#1a1a2e"/>
      {/* Eye ring */}
      <circle cx="20" cy="22" r="6" fill="#00afd8"/>
      {/* Eye */}
      <circle cx="20" cy="22" r="3" fill="#1a1a2e"/>
      <circle cx="19" cy="21" r="1" fill="white"/>
      {/* Beak */}
      <path d="M10 26C10 26 -4 30 4 36C8 38 16 34 16 34L10 26Z" fill="#ff9f43"/>
      <path d="M10 26C10 26 2 24 6 32L16 34L10 26Z" fill="#ee5a24"/>
      <path d="M14 28L6 32" stroke="#1a1a2e" strokeWidth="0.5"/>
      {/* Tail */}
      <path d="M54 44C58 48 60 54 56 58C52 54 54 48 54 44Z" fill="#00afd8"/>
      <path d="M52 42C56 46 60 52 56 56" stroke="#008fb3" strokeWidth="1"/>
    </svg>
  )
}

export function TropicalLeaf({ size = 64, className = '', flip = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      style={flip ? { transform: 'scaleX(-1)' } : {}}
    >
      {/* Main leaf */}
      <path
        d="M32 4C32 4 8 20 8 40C8 52 18 60 32 60C46 60 56 52 56 40C56 20 32 4 32 4Z"
        fill="#27ae60"
      />
      {/* Leaf veins */}
      <path d="M32 8V56" stroke="#1e8449" strokeWidth="2"/>
      <path d="M32 20L20 28" stroke="#1e8449" strokeWidth="1.5"/>
      <path d="M32 20L44 28" stroke="#1e8449" strokeWidth="1.5"/>
      <path d="M32 32L18 42" stroke="#1e8449" strokeWidth="1.5"/>
      <path d="M32 32L46 42" stroke="#1e8449" strokeWidth="1.5"/>
      <path d="M32 44L22 52" stroke="#1e8449" strokeWidth="1.5"/>
      <path d="M32 44L42 52" stroke="#1e8449" strokeWidth="1.5"/>
    </svg>
  )
}

export function MonsteraLeaf({ size = 80, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      {/* Main leaf shape */}
      <path
        d="M40 8C20 16 12 32 12 48C12 64 24 72 40 72C56 72 68 64 68 48C68 32 60 16 40 8Z"
        fill="#2ecc71"
      />
      {/* Holes in leaf */}
      <ellipse cx="28" cy="36" rx="6" ry="8" fill="#f5f7f8"/>
      <ellipse cx="52" cy="36" rx="6" ry="8" fill="#f5f7f8"/>
      <ellipse cx="32" cy="54" rx="5" ry="7" fill="#f5f7f8"/>
      <ellipse cx="48" cy="54" rx="5" ry="7" fill="#f5f7f8"/>
      {/* Center vein */}
      <path d="M40 12V68" stroke="#27ae60" strokeWidth="3"/>
      {/* Side veins */}
      <path d="M40 24L24 32" stroke="#27ae60" strokeWidth="2"/>
      <path d="M40 24L56 32" stroke="#27ae60" strokeWidth="2"/>
      <path d="M40 44L26 50" stroke="#27ae60" strokeWidth="2"/>
      <path d="M40 44L54 50" stroke="#27ae60" strokeWidth="2"/>
    </svg>
  )
}

export function ButterflyIcon({ size = 40, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Left wing */}
      <path
        d="M24 24C24 24 8 12 6 20C4 28 16 32 24 24Z"
        fill="#00afd8"
      />
      <path
        d="M24 24C24 24 12 32 10 38C8 44 20 40 24 24Z"
        fill="#74d4ed"
      />
      {/* Right wing */}
      <path
        d="M24 24C24 24 40 12 42 20C44 28 32 32 24 24Z"
        fill="#00afd8"
      />
      <path
        d="M24 24C24 24 36 32 38 38C40 44 28 40 24 24Z"
        fill="#74d4ed"
      />
      {/* Wing details */}
      <circle cx="14" cy="20" r="3" fill="#008fb3"/>
      <circle cx="34" cy="20" r="3" fill="#008fb3"/>
      {/* Body */}
      <ellipse cx="24" cy="26" rx="2" ry="8" fill="#2d3436"/>
      {/* Antennae */}
      <path d="M23 18C22 14 20 12 18 10" stroke="#2d3436" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M25 18C26 14 28 12 30 10" stroke="#2d3436" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function HummingbirdIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" className={className}>
      {/* Body */}
      <ellipse cx="32" cy="28" rx="14" ry="10" fill="#27ae60"/>
      {/* Head */}
      <circle cx="18" cy="24" r="8" fill="#2ecc71"/>
      {/* Beak */}
      <path d="M10 24L-2 26L10 28L10 24Z" fill="#2d3436"/>
      {/* Eye */}
      <circle cx="16" cy="22" r="2" fill="#1a1a2e"/>
      <circle cx="15.5" cy="21.5" r="0.5" fill="white"/>
      {/* Wing */}
      <path d="M30 18C30 18 42 8 48 12C54 16 44 28 30 28C30 28 30 18 30 18Z" fill="#00afd8" opacity="0.9"/>
      <path d="M32 22C38 16 44 14 46 16" stroke="#008fb3" strokeWidth="1"/>
      {/* Tail */}
      <path d="M44 28L54 32L52 36L44 30" fill="#1e8449"/>
      {/* Throat patch */}
      <path d="M14 28C14 28 18 32 24 30" fill="#e74c3c"/>
    </svg>
  )
}

export function FlowerIcon({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
      {/* Petals */}
      <ellipse cx="20" cy="10" rx="6" ry="8" fill="#ff6b6b"/>
      <ellipse cx="10" cy="20" rx="8" ry="6" fill="#ff6b6b"/>
      <ellipse cx="30" cy="20" rx="8" ry="6" fill="#ff6b6b"/>
      <ellipse cx="20" cy="30" rx="6" ry="8" fill="#ff6b6b"/>
      <ellipse cx="12" cy="12" rx="6" ry="6" fill="#ee5a5a"/>
      <ellipse cx="28" cy="12" rx="6" ry="6" fill="#ee5a5a"/>
      <ellipse cx="12" cy="28" rx="6" ry="6" fill="#ee5a5a"/>
      <ellipse cx="28" cy="28" rx="6" ry="6" fill="#ee5a5a"/>
      {/* Center */}
      <circle cx="20" cy="20" r="6" fill="#f9ca24"/>
      <circle cx="18" cy="18" r="1" fill="#f39c12"/>
      <circle cx="22" cy="19" r="1" fill="#f39c12"/>
      <circle cx="20" cy="22" r="1" fill="#f39c12"/>
    </svg>
  )
}

export function PalmTree({ size = 80, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      {/* Trunk */}
      <path d="M38 40L36 76H44L42 40" fill="#8b6914"/>
      <path d="M37 50H43" stroke="#725a12" strokeWidth="1"/>
      <path d="M37 58H43" stroke="#725a12" strokeWidth="1"/>
      <path d="M37 66H43" stroke="#725a12" strokeWidth="1"/>
      {/* Fronds */}
      <path d="M40 38C40 38 20 30 8 36C20 38 32 40 40 38Z" fill="#27ae60"/>
      <path d="M40 38C40 38 60 30 72 36C60 38 48 40 40 38Z" fill="#27ae60"/>
      <path d="M40 36C40 36 30 20 24 12C32 22 38 34 40 36Z" fill="#2ecc71"/>
      <path d="M40 36C40 36 50 20 56 12C48 22 42 34 40 36Z" fill="#2ecc71"/>
      <path d="M40 34C40 34 38 14 40 4C42 14 40 34 40 34Z" fill="#27ae60"/>
      {/* Coconuts */}
      <circle cx="38" cy="42" r="3" fill="#8b6914"/>
      <circle cx="44" cy="41" r="3" fill="#725a12"/>
    </svg>
  )
}

// Destination-specific icons
export function TokyoIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Pagoda/Tower shape */}
      <path d="M32 4L24 16H40L32 4Z" fill="#d32f2f"/>
      <path d="M26 16L20 28H44L38 16H26Z" fill="#c62828"/>
      <path d="M22 28L16 40H48L42 28H22Z" fill="#d32f2f"/>
      <path d="M18 40L12 52H52L46 40H18Z" fill="#c62828"/>
      {/* Tower details */}
      <rect x="28" y="52" width="8" height="8" fill="#5d4037"/>
      <circle cx="32" cy="8" r="2" fill="#ffd700"/>
      {/* Cherry blossoms */}
      <circle cx="12" cy="20" r="4" fill="#ffb7c5"/>
      <circle cx="52" cy="24" r="3" fill="#ffb7c5"/>
      <circle cx="8" cy="36" r="3" fill="#ffc0cb"/>
    </svg>
  )
}

export function ParisIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Eiffel Tower */}
      <path d="M32 4L28 20H36L32 4Z" fill="#5d4e37"/>
      <path d="M28 20L22 40H42L36 20H28Z" fill="#4a3f31"/>
      <path d="M22 40L14 60H50L42 40H22Z" fill="#5d4e37"/>
      {/* Cross beams */}
      <rect x="26" y="24" width="12" height="2" fill="#6d5d4a"/>
      <rect x="20" y="44" width="24" height="2" fill="#6d5d4a"/>
      {/* Decorative arches */}
      <path d="M24 48C24 44 28 42 32 42C36 42 40 44 40 48" stroke="#6d5d4a" strokeWidth="2" fill="none"/>
      {/* Stars */}
      <circle cx="12" cy="16" r="2" fill="#ffd700"/>
      <circle cx="52" cy="20" r="2" fill="#ffd700"/>
      <circle cx="8" cy="40" r="1.5" fill="#ffd700"/>
    </svg>
  )
}

export function LondonIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Big Ben tower */}
      <rect x="24" y="12" width="16" height="44" fill="#c9a85c"/>
      <rect x="22" y="8" width="20" height="6" fill="#b8973f"/>
      {/* Clock face */}
      <circle cx="32" cy="24" r="6" fill="#f5f5dc"/>
      <circle cx="32" cy="24" r="5" stroke="#333" strokeWidth="1" fill="none"/>
      <line x1="32" y1="24" x2="32" y2="20" stroke="#333" strokeWidth="1.5"/>
      <line x1="32" y1="24" x2="35" y2="24" stroke="#333" strokeWidth="1"/>
      {/* Spire */}
      <path d="M32 8L28 2L32 0L36 2L32 8Z" fill="#c9a85c"/>
      {/* Windows */}
      <rect x="28" y="34" width="3" height="5" fill="#87ceeb"/>
      <rect x="33" y="34" width="3" height="5" fill="#87ceeb"/>
      <rect x="28" y="44" width="3" height="5" fill="#87ceeb"/>
      <rect x="33" y="44" width="3" height="5" fill="#87ceeb"/>
      {/* Red phone box accent */}
      <rect x="48" y="44" width="8" height="16" rx="1" fill="#cc0000"/>
    </svg>
  )
}

export function OrlandoIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Castle */}
      <rect x="20" y="28" width="24" height="28" fill="#e8dcc8"/>
      {/* Towers */}
      <rect x="16" y="20" width="8" height="36" fill="#d4c4b0"/>
      <rect x="40" y="20" width="8" height="36" fill="#d4c4b0"/>
      {/* Tower tops */}
      <path d="M20 20L16 8L12 20H20Z" fill="#4169e1"/>
      <path d="M52 20L48 8L44 20H52Z" fill="#4169e1"/>
      <path d="M36 28L32 16L28 28H36Z" fill="#4169e1"/>
      {/* Flags */}
      <path d="M16 8L16 4L22 6L16 8Z" fill="#ff69b4"/>
      <path d="M48 8L48 4L54 6L48 8Z" fill="#ff69b4"/>
      {/* Windows */}
      <rect x="24" y="36" width="6" height="8" rx="3" fill="#87ceeb"/>
      <rect x="34" y="36" width="6" height="8" rx="3" fill="#87ceeb"/>
      {/* Door */}
      <path d="M32 56L26 56L26 48C26 44 29 42 32 42C35 42 38 44 38 48L38 56L32 56Z" fill="#8b4513"/>
      {/* Stars */}
      <circle cx="8" cy="24" r="2" fill="#ffd700"/>
      <circle cx="56" cy="16" r="2" fill="#ffd700"/>
    </svg>
  )
}

export function BeachIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Sun */}
      <circle cx="48" cy="16" r="10" fill="#ffd700"/>
      <circle cx="48" cy="16" r="6" fill="#ffeb3b"/>
      {/* Waves */}
      <path d="M0 44C8 40 16 48 24 44C32 40 40 48 48 44C56 40 64 48 72 44V64H0V44Z" fill="#00bcd4"/>
      <path d="M0 50C8 46 16 54 24 50C32 46 40 54 48 50C56 46 64 54 72 50V64H0V50Z" fill="#0097a7"/>
      {/* Beach */}
      <path d="M0 56L64 48V64H0V56Z" fill="#f4d03f"/>
      {/* Palm tree */}
      <path d="M18 32L16 56H20L18 32Z" fill="#8b6914"/>
      <path d="M18 32C18 32 8 28 4 32C10 32 16 34 18 32Z" fill="#27ae60"/>
      <path d="M18 32C18 32 28 28 32 32C26 32 20 34 18 32Z" fill="#2ecc71"/>
      <path d="M18 30C18 30 14 20 18 14C22 20 18 30 18 30Z" fill="#27ae60"/>
      {/* Starfish */}
      <path d="M52 54L54 50L56 54L60 52L56 56L58 60L54 58L52 62L50 58L46 60L50 56L48 52L52 54Z" fill="#ff6b6b"/>
    </svg>
  )
}

export function BangkokIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Thai Temple/Stupa */}
      <path d="M32 4L28 12H36L32 4Z" fill="#ffd700"/>
      <path d="M32 12L26 20H38L32 12Z" fill="#ff9800"/>
      <path d="M28 20L22 32H42L36 20H28Z" fill="#ffd700"/>
      <path d="M24 32L18 48H46L40 32H24Z" fill="#ff9800"/>
      {/* Temple base */}
      <rect x="16" y="48" width="32" height="8" fill="#ffd700"/>
      <rect x="14" y="54" width="36" height="6" fill="#e65100"/>
      {/* Spire details */}
      <circle cx="32" cy="6" r="2" fill="#ffd700"/>
      <path d="M30 8L32 4L34 8" stroke="#ff6f00" strokeWidth="1" fill="none"/>
      {/* Decorative elements */}
      <path d="M22 40L20 44H24L22 40Z" fill="#fff176"/>
      <path d="M42 40L40 44H44L42 40Z" fill="#fff176"/>
      {/* Small Buddha silhouette */}
      <ellipse cx="32" cy="42" rx="4" ry="5" fill="#ffcc80"/>
      <circle cx="32" cy="38" r="3" fill="#ffcc80"/>
    </svg>
  )
}

export function VeronaIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Roman Arena/Colosseum */}
      <ellipse cx="32" cy="40" rx="28" ry="16" fill="#d4a574"/>
      <ellipse cx="32" cy="38" rx="24" ry="12" fill="#c9956c"/>
      <ellipse cx="32" cy="36" rx="20" ry="8" fill="#deb887"/>
      {/* Arena floor */}
      <ellipse cx="32" cy="40" rx="16" ry="6" fill="#f5deb3"/>
      {/* Arches - outer ring */}
      <path d="M8 36C8 36 10 44 12 44C14 44 14 36 14 36" stroke="#8b7355" strokeWidth="1.5" fill="none"/>
      <path d="M16 34C16 34 18 42 20 42C22 42 22 34 22 34" stroke="#8b7355" strokeWidth="1.5" fill="none"/>
      <path d="M24 33C24 33 26 40 28 40C30 40 30 33 30 33" stroke="#8b7355" strokeWidth="1.5" fill="none"/>
      <path d="M34 33C34 33 36 40 38 40C40 40 40 33 40 33" stroke="#8b7355" strokeWidth="1.5" fill="none"/>
      <path d="M42 34C42 34 44 42 46 42C48 42 48 34 48 34" stroke="#8b7355" strokeWidth="1.5" fill="none"/>
      <path d="M50 36C50 36 52 44 54 44C56 44 56 36 56 36" stroke="#8b7355" strokeWidth="1.5" fill="none"/>
      {/* Heart for Romeo & Juliet */}
      <path d="M32 12C28 8 22 8 22 14C22 20 32 28 32 28C32 28 42 20 42 14C42 8 36 8 32 12Z" fill="#e63946"/>
      {/* Italian flag colors accent */}
      <rect x="4" y="52" width="6" height="8" fill="#009246"/>
      <rect x="10" y="52" width="6" height="8" fill="white"/>
      <rect x="16" y="52" width="6" height="8" fill="#ce2b37"/>
    </svg>
  )
}

// Animated cloud component
export function CloudIcon({ size = 80, className = '' }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 100 50" fill="none" className={className}>
      <ellipse cx="30" cy="35" rx="20" ry="12" fill="white" fillOpacity="0.9"/>
      <ellipse cx="50" cy="30" rx="25" ry="15" fill="white" fillOpacity="0.9"/>
      <ellipse cx="70" cy="35" rx="20" ry="12" fill="white" fillOpacity="0.9"/>
      <ellipse cx="45" cy="22" rx="15" ry="10" fill="white" fillOpacity="0.9"/>
      <ellipse cx="60" cy="20" rx="12" ry="8" fill="white" fillOpacity="0.9"/>
    </svg>
  )
}

// Sparkle/star for accents
export function SparkleIcon({ size = 24, className = '', color = '#ffd700' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" fill={color}/>
    </svg>
  )
}

// Airplane for travel theme
export function AirplaneIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M56 24L36 32L20 28L8 32L20 36L36 32L56 40L60 32L56 24Z" fill="#00afd8"/>
      <path d="M28 32L24 44L32 40L28 32Z" fill="#008fb3"/>
      <path d="M28 32L24 20L32 24L28 32Z" fill="#008fb3"/>
      <circle cx="16" cy="32" r="4" fill="#2d3436"/>
      <ellipse cx="36" cy="32" rx="8" ry="4" fill="#74d4ed"/>
    </svg>
  )
}

// Compass for navigation theme
export function CompassIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <circle cx="32" cy="32" r="28" fill="#f5f5dc" stroke="#c9a85c" strokeWidth="3"/>
      <circle cx="32" cy="32" r="24" stroke="#ddd" strokeWidth="1"/>
      {/* Cardinal points */}
      <path d="M32 8L36 28H28L32 8Z" fill="#d32f2f"/>
      <path d="M32 56L28 36H36L32 56Z" fill="#333"/>
      <path d="M8 32L28 28V36L8 32Z" fill="#333"/>
      <path d="M56 32L36 36V28L56 32Z" fill="#333"/>
      {/* Center */}
      <circle cx="32" cy="32" r="4" fill="#c9a85c"/>
      {/* Direction markers */}
      <text x="32" y="18" textAnchor="middle" fill="#333" fontSize="6" fontWeight="bold">N</text>
    </svg>
  )
}
