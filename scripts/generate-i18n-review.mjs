import fs from "node:fs"
import path from "node:path"

const en = JSON.parse(fs.readFileSync("messages/en.json", "utf8"))
const ar = JSON.parse(fs.readFileSync("messages/ar.json", "utf8"))

function flatten(obj, prefix = "") {
  let result = {}
  for (const [k, v] of Object.entries(obj)) {
    const nextKey = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(result, flatten(v, nextKey))
    } else {
      result[nextKey] = String(v)
    }
  }
  return result
}

const flatEn = flatten(en)
const flatAr = flatten(ar)

const keys = Object.keys(flatEn).sort()

let md = "# Golden Trip i18n Review Table\n\n"
md += `This document contains all ${keys.length} localized strings for both English and Arabic locales.\n`
md += "Tone: Modern Standard Arabic with a warm, natural Egyptian tone adhering strictly to the Golden Trip glossary.\n\n"
md += "| # | Key | English | Arabic |\n"
md += "|---|-----|---------|--------|\n"

let idx = 1
for (const k of keys) {
  const enVal = (flatEn[k] || "").replace(/\|/g, "\\|").replace(/\n/g, "<br>")
  const arVal = (flatAr[k] || "").replace(/\|/g, "\\|").replace(/\n/g, "<br>")
  md += `| ${idx++} | \`${k}\` | ${enVal} | ${arVal} |\n`
}

fs.writeFileSync("i18n-review.md", md, "utf8")
console.log(`Successfully generated i18n-review.md with ${keys.length} entries.`)
