import fs from "fs"
import path from "path"

const chunksDir = path.join(process.cwd(), ".next", "static", "chunks")
const files = fs.readdirSync(chunksDir, { recursive: true })
  .filter((f) => f.endsWith(".js"))
  .map((f) => {
    const full = path.join(chunksDir, f)
    const stat = fs.statSync(full)
    return { file: f, sizeKB: (stat.size / 1024).toFixed(1), bytes: stat.size }
  })
  .sort((a, b) => b.bytes - a.bytes)

console.log("Top 10 JS chunk files:")
files.slice(0, 10).forEach((f) => console.log(`- ${f.file}: ${f.sizeKB} KB`))

// Identify libraries in the largest chunks
for (const f of files.slice(0, 5)) {
  const full = path.join(chunksDir, f.file)
  const content = fs.readFileSync(full, "utf8")
  const libs = []
  if (content.includes("gsap") || content.includes("ScrollTrigger")) libs.push("GSAP / ScrollTrigger")
  if (content.includes("react-dom") || content.includes("createRoot")) libs.push("React DOM")
  if (content.includes("lenis")) libs.push("Lenis")
  if (content.includes("lucide")) libs.push("Lucide Icons")
  if (content.includes("d3-geo") || content.includes("geoMercator")) libs.push("D3-Geo")
  if (content.includes("topojson")) libs.push("Topojson")
  console.log(`Chunk ${f.file} (${f.sizeKB} KB) contains: ${libs.join(", ") || "App code"}`)
}
