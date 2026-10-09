const fs = require("fs")
const path = require("path")
const sharp = require("sharp")

// Vehicle SVG 1: Black SUV
const suvSvg = `<svg viewBox="0 0 560 190" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="suvGlass" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#323640" />
      <stop offset="50%" stop-color="#252830" />
      <stop offset="100%" stop-color="#1B1D22" />
    </linearGradient>
  </defs>
  <ellipse cx="270" cy="164" rx="230" ry="6" fill="#0A0A0C" opacity="0.8" />
  <path d="M 64 135 L 62 108 Q 63 94 72 88 L 138 78 L 185 40 Q 192 34 204 34 L 366 34 Q 378 34 386 42 L 426 80 L 466 86 Q 478 88 480 100 L 482 122 Q 482 136 476 142 L 472 145 L 435 145 A 36 36 0 0 0 363 145 L 187 145 A 36 36 0 0 0 115 145 L 64 145 Z" fill="#17181C" />
  <path d="M 72 88 L 138 78 L 185 40 Q 192 34 204 34 L 366 34 Q 378 34 386 42 L 426 80 L 466 86 Q 474 88 478 94 L 430 92 L 384 84 L 182 84 L 128 86 Z" fill="#26282E" />
  <rect x="206" y="28" width="160" height="4" rx="2" fill="#3D4049" />
  <rect x="220" y="32" width="6" height="3" fill="#17181C" />
  <rect x="348" y="32" width="6" height="3" fill="#17181C" />
  <path d="M 194 42 L 248 42 L 248 80 L 156 80 Z" fill="url(#suvGlass)" />
  <path d="M 254 42 L 326 42 L 326 80 L 254 80 Z" fill="url(#suvGlass)" />
  <path d="M 332 42 L 374 42 L 412 80 L 332 80 Z" fill="url(#suvGlass)" />
  <path d="M 152 82 L 192 40 L 376 40 L 416 82 Z" stroke="#3D4049" stroke-width="2" fill="none" />
  <line x1="251" y1="42" x2="251" y2="80" stroke="#17181C" stroke-width="4" />
  <line x1="329" y1="42" x2="329" y2="80" stroke="#17181C" stroke-width="4" />
  <path d="M 148 82 Q 138 90 142 98 Q 148 102 162 98 L 160 84 Z" fill="#26282E" stroke="#17181C" stroke-width="1.5" />
  <line x1="251" y1="80" x2="251" y2="142" stroke="#0E0E10" stroke-width="1.5" />
  <line x1="332" y1="80" x2="332" y2="142" stroke="#0E0E10" stroke-width="1.5" />
  <path d="M 416 82 L 410 105 L 420 142" stroke="#0E0E10" stroke-width="1.5" />
  <rect x="264" y="90" width="18" height="3" rx="1.5" fill="#3D4049" />
  <rect x="344" y="90" width="18" height="3" rx="1.5" fill="#3D4049" />
  <text x="292" y="114" fill="#C9A227" font-size="9" font-weight="800" letter-spacing="0.1em" font-family="sans-serif">GT</text>
  <path d="M 64 136 L 115 136 M 187 136 L 363 136 M 435 136 L 474 136" stroke="#0E0E10" stroke-width="5" />
  <path d="M 466 94 L 479 98 L 476 108 L 458 106 Z" fill="#E6CF85" stroke="#C9A227" stroke-width="1" />
  <rect x="473" y="100" width="4" height="6" rx="1" fill="#C9A227" />
  <path d="M 64 96 L 70 96 L 68 112 L 62 110 Z" fill="#E07A2F" />
  <path d="M 112 146 A 38 38 0 0 1 190 146" fill="none" stroke="#0E0E10" stroke-width="4" />
  <path d="M 360 146 A 38 38 0 0 1 438 146" fill="none" stroke="#0E0E10" stroke-width="4" />
  <g>
    <circle cx="151" cy="146" r="32" fill="#0A0A0C" />
    <circle cx="151" cy="146" r="30" stroke="#1A1B1E" stroke-width="1.5" fill="none" />
    <circle cx="151" cy="146" r="22" fill="#1F2126" stroke="#484C56" stroke-width="1.5" />
    <circle cx="151" cy="146" r="16" fill="#141518" />
    <line x1="151" y1="126" x2="151" y2="166" stroke="#4A4E5A" stroke-width="3.5" stroke-linecap="round" />
    <line x1="131" y1="146" x2="171" y2="146" stroke="#4A4E5A" stroke-width="3.5" stroke-linecap="round" />
    <circle cx="151" cy="146" r="6" fill="#141518" stroke="#3D4049" stroke-width="1" />
    <circle cx="151" cy="146" r="3" fill="#C9A227" />
  </g>
  <g>
    <circle cx="399" cy="146" r="32" fill="#0A0A0C" />
    <circle cx="399" cy="146" r="30" stroke="#1A1B1E" stroke-width="1.5" fill="none" />
    <circle cx="399" cy="146" r="22" fill="#1F2126" stroke="#484C56" stroke-width="1.5" />
    <circle cx="399" cy="146" r="16" fill="#141518" />
    <line x1="399" y1="126" x2="399" y2="166" stroke="#4A4E5A" stroke-width="3.5" stroke-linecap="round" />
    <line x1="379" y1="146" x2="419" y2="146" stroke="#4A4E5A" stroke-width="3.5" stroke-linecap="round" />
    <circle cx="399" cy="146" r="6" fill="#141518" stroke="#3D4049" stroke-width="1" />
    <circle cx="399" cy="146" r="3" fill="#C9A227" />
  </g>
</svg>`

// Vehicle SVG 2: White Sedan
const sedanSvg = `<svg viewBox="0 0 560 190" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sedanGlass" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2E323B" />
      <stop offset="50%" stop-color="#22252C" />
      <stop offset="100%" stop-color="#181A1F" />
    </linearGradient>
  </defs>
  <ellipse cx="270" cy="164" rx="230" ry="5.5" fill="#0A0A0C" opacity="0.75" />
  <path d="M 60 144 L 58 116 Q 59 104 70 100 L 132 94 L 180 50 Q 188 44 200 44 L 350 44 Q 364 44 374 54 L 434 92 L 474 98 Q 484 100 484 112 L 486 128 Q 486 142 478 144 L 435 144 A 36 36 0 0 0 363 144 L 187 144 A 36 36 0 0 0 115 144 L 60 144 Z" fill="#F4F2EC" />
  <path d="M 70 100 L 132 94 L 180 50 Q 188 44 200 44 L 350 44 Q 364 44 374 54 L 434 92 L 474 98 Q 480 99 482 105 L 436 102 L 372 96 L 182 96 L 126 98 Z" fill="#FFFFFF" />
  <path d="M 188 52 L 244 52 L 244 88 L 148 88 Z" fill="url(#sedanGlass)" />
  <path d="M 250 52 L 320 52 L 320 88 L 250 88 Z" fill="url(#sedanGlass)" />
  <path d="M 326 52 L 362 52 L 420 88 L 326 88 Z" fill="url(#sedanGlass)" />
  <line x1="247" y1="52" x2="247" y2="88" stroke="#0E0E10" stroke-width="4" />
  <line x1="323" y1="52" x2="323" y2="88" stroke="#0E0E10" stroke-width="4" />
  <line x1="247" y1="88" x2="247" y2="142" stroke="#D1CEC5" stroke-width="1.5" />
  <line x1="325" y1="88" x2="325" y2="142" stroke="#D1CEC5" stroke-width="1.5" />
  <rect x="258" y="96" width="16" height="3" rx="1.5" fill="#C9A227" />
  <rect x="336" y="96" width="16" height="3" rx="1.5" fill="#C9A227" />
  <text x="286" y="118" fill="#C9A227" font-size="8.5" font-weight="800" font-family="sans-serif">GT</text>
  <path d="M 470 106 L 484 110 L 480 118 L 460 116 Z" fill="#E6CF85" stroke="#C9A227" stroke-width="1" />
  <path d="M 60 104 L 72 104 L 68 116 L 59 114 Z" fill="#E07A2F" />
  <g>
    <circle cx="151" cy="146" r="32" fill="#0A0A0C" />
    <circle cx="151" cy="146" r="22" fill="#1F2126" stroke="#484C56" stroke-width="1.5" />
    <circle cx="151" cy="146" r="15" fill="#141518" />
    <line x1="151" y1="126" x2="151" y2="166" stroke="#9BA0AC" stroke-width="2.2" stroke-linecap="round" />
    <line x1="131" y1="146" x2="171" y2="146" stroke="#9BA0AC" stroke-width="2.2" stroke-linecap="round" />
    <circle cx="151" cy="146" r="3" fill="#C9A227" />
  </g>
  <g>
    <circle cx="399" cy="146" r="32" fill="#0A0A0C" />
    <circle cx="399" cy="146" r="22" fill="#1F2126" stroke="#484C56" stroke-width="1.5" />
    <circle cx="399" cy="146" r="15" fill="#141518" />
    <line x1="399" y1="126" x2="399" y2="166" stroke="#9BA0AC" stroke-width="2.2" stroke-linecap="round" />
    <line x1="379" y1="146" x2="419" y2="146" stroke="#9BA0AC" stroke-width="2.2" stroke-linecap="round" />
    <circle cx="399" cy="146" r="3" fill="#C9A227" />
  </g>
</svg>`

// Vehicle SVG 3: White Van
const vanSvg = `<svg viewBox="0 0 570 210" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="vanGlass" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2E333D" />
      <stop offset="50%" stop-color="#22252C" />
      <stop offset="100%" stop-color="#181A1F" />
    </linearGradient>
  </defs>
  <ellipse cx="280" cy="184" rx="240" ry="6" fill="#0A0A0C" opacity="0.8" />
  <path d="M 64 165 L 60 76 Q 61 56 76 52 L 400 48 Q 420 48 432 64 L 478 114 L 494 122 Q 502 126 502 138 L 500 156 Q 498 165 488 165 L 445 165 A 36 36 0 0 0 373 165 L 187 165 A 36 36 0 0 0 115 165 L 64 165 Z" fill="#F4F2EC" />
  <path d="M 76 52 L 400 48 Q 420 48 432 64 L 478 114 L 494 122 Q 498 124 500 128 L 472 124 L 426 72 L 182 68 L 74 68 Z" fill="#FFFFFF" />
  <path d="M 120 62 L 190 62 L 190 108 L 120 108 Z" fill="url(#vanGlass)" />
  <path d="M 198 62 L 278 62 L 278 108 L 198 108 Z" fill="url(#vanGlass)" />
  <path d="M 286 62 L 366 62 L 366 108 L 286 108 Z" fill="url(#vanGlass)" />
  <path d="M 374 62 L 420 62 L 466 108 L 374 108 Z" fill="url(#vanGlass)" />
  <line x1="194" y1="58" x2="194" y2="112" stroke="#0E0E10" stroke-width="4" />
  <line x1="282" y1="58" x2="282" y2="112" stroke="#0E0E10" stroke-width="4" />
  <line x1="370" y1="58" x2="370" y2="112" stroke="#0E0E10" stroke-width="4" />
  <line x1="282" y1="112" x2="282" y2="164" stroke="#D1CEC5" stroke-width="1.5" />
  <line x1="372" y1="112" x2="372" y2="164" stroke="#D1CEC5" stroke-width="1.5" />
  <rect x="290" y="120" width="16" height="3" rx="1.5" fill="#C9A227" />
  <rect x="380" y="120" width="16" height="3" rx="1.5" fill="#C9A227" />
  <text x="320" y="140" fill="#C9A227" font-size="8.5" font-weight="800" font-family="sans-serif">GT</text>
  <path d="M 478 122 L 496 126 L 492 136 L 470 132 Z" fill="#E6CF85" stroke="#C9A227" stroke-width="1" />
  <path d="M 60 78 L 65 78 L 65 120 L 60 120 Z" fill="#E07A2F" />
  <g>
    <circle cx="151" cy="166" r="32" fill="#0A0A0C" />
    <circle cx="151" cy="166" r="22" fill="#1F2126" stroke="#484C56" stroke-width="1.5" />
    <circle cx="151" cy="166" r="16" fill="#141518" />
    <line x1="151" y1="146" x2="151" y2="186" stroke="#7C818E" stroke-width="3.2" stroke-linecap="round" />
    <line x1="131" y1="166" x2="171" y2="166" stroke="#7C818E" stroke-width="3.2" stroke-linecap="round" />
    <circle cx="151" cy="166" r="3" fill="#C9A227" />
  </g>
  <g>
    <circle cx="409" cy="166" r="32" fill="#0A0A0C" />
    <circle cx="409" cy="166" r="22" fill="#1F2126" stroke="#484C56" stroke-width="1.5" />
    <circle cx="409" cy="166" r="16" fill="#141518" />
    <line x1="409" y1="146" x2="409" y2="186" stroke="#7C818E" stroke-width="3.2" stroke-linecap="round" />
    <line x1="389" y1="166" x2="429" y2="166" stroke="#7C818E" stroke-width="3.2" stroke-linecap="round" />
    <circle cx="409" cy="166" r="3" fill="#C9A227" />
  </g>
</svg>`

async function run() {
  const targetDir = path.join(process.cwd(), "public", "vehicles")
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
  }

  console.log("Generating transparent cutout webp vehicles...")

  await sharp(Buffer.from(suvSvg))
    .webp({ quality: 95, lossless: true })
    .toFile(path.join(targetDir, "suv.webp"))
  console.log("Generated suv.webp")

  await sharp(Buffer.from(sedanSvg))
    .webp({ quality: 95, lossless: true })
    .toFile(path.join(targetDir, "sedan.webp"))
  console.log("Generated sedan.webp")

  await sharp(Buffer.from(vanSvg))
    .webp({ quality: 95, lossless: true })
    .toFile(path.join(targetDir, "van.webp"))
  console.log("Generated van.webp")

  console.log("All cutout vehicles generated successfully!")
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
