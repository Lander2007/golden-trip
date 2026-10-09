"use client" /* Mechanical shadow overlays for roller depth effect */ /* Rolling column */ /* Corner rivet dots */ /* Tiny km label */

export default function Odometer({
  km = 0,
  light = false,
}: {
  km?: number
  light?: boolean
}) {
  const clamped = Math.max(0, Math.min(980, km))
  const formatted = String(clamped).padStart(3, "0")
  const digits = [
    parseInt(formatted[0], 10),
    parseInt(formatted[1], 10),
    parseInt(formatted[2], 10),
  ]

  const digitWheel = (currentDigit: number, index: number) => (
    <div
      key={index}
      className="relative h-[26px] w-[18px] overflow-hidden bg-[#0A0A0C] border-x border-[#2A2B2E]/60"
    >
      {}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-b from-black/80 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-t from-black/80 to-transparent z-10" />

      {}
      <div
        className="transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
        style={{ transform: `translateY(-${currentDigit * 26}px)` }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <div
            key={d}
            className="flex h-[26px] w-[18px] items-center justify-center font-display text-[15px] font-bold tabular-nums text-[#F4F2EC]"
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div
      className={`inline-flex items-center gap-2.5 rounded-sm border px-2.5 py-1.5 shadow-md ${
        light
          ? "border-[#2A2B2E] bg-[#161719]"
          : "border-[#2A2B2E] bg-[#141518]"
      }`}
      role="status"
      aria-label={`Odometer: ${clamped} kilometers traveled`}
    >
      {}
      <div className="relative flex items-center gap-0.5 rounded-[2px] bg-[#0E0E10] p-[2px] border border-[#2A2B2E]">
        {digits.map((digit, i) => digitWheel(digit, i))}
      </div>

      {}
      <div className="flex flex-col justify-center">
        <span className="font-mono text-[11px] font-bold text-[#C9A227]">
          km
        </span>
      </div>
    </div>
  )
}
