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
