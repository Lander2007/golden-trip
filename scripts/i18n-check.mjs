import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")

const enPath = path.join(rootDir, "messages", "en.json")
const arPath = path.join(rootDir, "messages", "ar.json")
const allowPath = path.join(rootDir, "i18n-allow.json")

if (!fs.existsSync(enPath)) {
  console.error("Missing messages/en.json")
  process.exit(1)
}
if (!fs.existsSync(arPath)) {
  console.error("Missing messages/ar.json")
  process.exit(1)
}

const en = JSON.parse(fs.readFileSync(enPath, "utf-8"))
const ar = JSON.parse(fs.readFileSync(arPath, "utf-8"))
const allow = fs.existsSync(allowPath) ? JSON.parse(fs.readFileSync(allowPath, "utf-8")) : {}

const allowedIdentical = new Set(allow.allowedIdenticalKeys || [])
const allowedLatinTokensInArabic = (allow.allowedLatinTokensInArabic || []).slice().sort((a, b) => b.length - a.length)
const allowedArabicTokensInEnglish = (allow.allowedArabicTokensInEnglish || []).slice().sort((a, b) => b.length - a.length)

function flatten(obj, prefix = "") {
  return Object.entries(obj).flatMap(([k, v]) => {
    const cur = prefix ? `${prefix}.${k}` : k
    if (typeof v === "object" && v !== null && !Array.isArray(v)) {
      return flatten(v, cur)
    }
    return [[cur, v]]
  })
}

const enEntries = flatten(en)
const arEntries = flatten(ar)

const enMap = new Map(enEntries)
const arMap = new Map(arEntries)

const errors = []

// 1. Check identical keys
for (const k of enMap.keys()) {
  if (!arMap.has(k)) {
    errors.push(`Missing key in ar.json: "${k}"`)
  }
}
for (const k of arMap.keys()) {
  if (!enMap.has(k)) {
    errors.push(`Extra key in ar.json: "${k}"`)
  }
}

// 2. No empty or whitespace values
for (const [k, v] of enEntries) {
  if (typeof v !== "string" || v.trim() === "") {
    errors.push(`Empty or whitespace value in en.json for key: "${k}"`)
  }
}
for (const [k, v] of arEntries) {
  if (typeof v !== "string" || v.trim() === "") {
    errors.push(`Empty or whitespace value in ar.json for key: "${k}"`)
  }
}

// Extract variables like {name}, {count}
function getPlaceholders(str) {
  const placeholders = []
  let depth = 0
  let current = ""
  for (let i = 0; i < str.length; i++) {
    const ch = str[i]
    if (ch === "{") {
      if (depth === 0) {
        current = ""
      }
      depth++
    } else if (ch === "}") {
      depth--
      if (depth === 0) {
        const varName = current.trim().split(/[, ]/)[0]
        if (varName && /^[a-zA-Z0-9_]+$/.test(varName)) {
          placeholders.push(varName)
        }
      }
    } else if (depth === 1) {
      current += ch
    }
  }
  return placeholders
}

function cleanIcu(str) {
  let s = str
  // Remove plural headers: {count, plural,
  s = s.replace(/\{[a-zA-Z0-9_]+,\s*plural,\s*/g, " ")
  // Remove plural subcategory tags: zero {, one {, two {, few {, many {, other {
  s = s.replace(/(?:zero|one|two|few|many|other)\s*\{/g, " ")
  // Remove simple placeholders: {count}, {name}
  s = s.replace(/\{[a-zA-Z0-9_]+\}/g, " ")
  // Remove remaining closing braces
  s = s.replace(/\}/g, " ")
  return s
}

const REQUIRED_AR_PLURAL_FORMS = ["zero", "one", "two", "few", "many", "other"]

for (const [k, vEn] of enEntries) {
  const vAr = arMap.get(k)
  if (!vAr) continue

  // 3. Placeholders check
  const enPlaceholders = Array.from(new Set(getPlaceholders(vEn))).sort()
  const arPlaceholders = Array.from(new Set(getPlaceholders(vAr))).sort()
  if (JSON.stringify(enPlaceholders) !== JSON.stringify(arPlaceholders)) {
    errors.push(
      `Placeholder mismatch for key "${k}": en=[${enPlaceholders.join(",")}] vs ar=[${arPlaceholders.join(",")}]`
    )
  }

  // Check 6 plural forms for any plural message in ar.json
  if (vEn.includes("plural,")) {
    if (!vAr.includes("plural,")) {
      errors.push(`Expected plural message in ar.json for key "${k}"`)
    } else {
      for (const form of REQUIRED_AR_PLURAL_FORMS) {
        const regex = new RegExp(`\\b${form}\\s*\\{`)
        if (!regex.test(vAr)) {
          errors.push(`Missing plural form "${form}" in ar.json for key "${k}"`)
        }
      }
    }
  }

  // 4. Identical value check
  if (vEn === vAr && !allowedIdentical.has(k)) {
    errors.push(`Arabic value is identical to English value without allowlist for key "${k}": "${vEn}"`)
  }

  // 5. Arabic value containing Latin letters
  let strippedAr = cleanIcu(vAr)
  for (const token of allowedLatinTokensInArabic) {
    strippedAr = strippedAr.split(token).join("")
  }
  const latinMatches = strippedAr.match(/[A-Za-z]+/g)
  if (latinMatches) {
    errors.push(
      `Arabic value for key "${k}" contains unallowed Latin letters: [${latinMatches.join(", ")}] in "${vAr}"`
    )
  }

  // 6. English value containing Arabic letters
  let strippedEn = vEn
  for (const token of allowedArabicTokensInEnglish) {
    strippedEn = strippedEn.split(token).join("")
  }
  const arabicMatches = strippedEn.match(/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]+/g)
  if (arabicMatches) {
    errors.push(
      `English value for key "${k}" contains unallowed Arabic letters: [${arabicMatches.join(", ")}] in "${vEn}"`
    )
  }
}

if (errors.length > 0) {
  console.error(`\x1b[31mi18n-check failed with ${errors.length} error(s):\x1b[0m`)
  for (const err of errors) {
    console.error(` - ${err}`)
  }
  process.exit(1)
}

console.log(`\x1b[32m✔ i18n-check passed: ${enEntries.length} keys verified in en.json and ar.json.\x1b[0m`)
process.exit(0)
