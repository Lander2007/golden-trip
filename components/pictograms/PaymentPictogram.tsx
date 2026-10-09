export default function PaymentPictogram() {
  return (
    <svg
      viewBox="0 0 64 64"
      width="56"
      height="56"
      fill="none"
      aria-hidden="true"
    >
      <rect x="6" y="18" width="40" height="28" rx="4" fill="#EADFC8" />
      <rect x="6" y="24" width="40" height="6" fill="#0B0A09" />
      <rect x="12" y="36" width="12" height="4" rx="1" fill="#C9A227" />
      <rect x="28" y="36" width="8" height="4" rx="1" fill="#C9A227" opacity="0.45" />
      <circle cx="48" cy="40" r="12" fill="#C9A227" />
      <circle cx="48" cy="40" r="8" fill="#0B0A09" />
      <path
        d="M45.5 40h5M48 37.5v5"
        stroke="#C9A227"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}
