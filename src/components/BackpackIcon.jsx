function BackpackIcon({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main backpack body */}
      <path
        d="M6 8C6 6.89543 6.89543 6 8 6H16C17.1046 6 18 6.89543 18 8V19C18 20.1046 17.1046 21 16 21H8C6.89543 21 6 20.1046 6 19V8Z"
        fill="#00afd8"
      />
      {/* Top loop/handle */}
      <path
        d="M9 6V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V6"
        stroke="#00afd8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Front pocket */}
      <rect
        x="8"
        y="12"
        width="8"
        height="5"
        rx="1"
        fill="#008fb3"
      />
      {/* Pocket zipper line */}
      <line
        x1="10"
        y1="14.5"
        x2="14"
        y2="14.5"
        stroke="#00afd8"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Left strap */}
      <path
        d="M6 10C4.5 10 4 11 4 12V17C4 17.5 4.5 18 5 18"
        stroke="#008fb3"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Right strap */}
      <path
        d="M18 10C19.5 10 20 11 20 12V17C20 17.5 19.5 18 19 18"
        stroke="#008fb3"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default BackpackIcon
