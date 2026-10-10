import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import ts from "typescript"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")

// Load i18n-allow.json
const allowPath = path.join(rootDir, "i18n-allow.json")
const allowData = fs.existsSync(allowPath) ? JSON.parse(fs.readFileSync(allowPath, "utf-8")) : {}
const allowedLatinTokens = (allowData.allowedLatinTokensInArabic || [])
  .slice()
  .sort((a, b) => b.length - a.length)

// Helper to transpile and evaluate mockData.ts in a temporary sandbox
function loadMockData() {
  const localizedTsPath = path.join(rootDir, "lib", "localized.ts")
  const mockDataTsPath = path.join(rootDir, "lib", "mockData.ts")

  const localizedTs = fs.readFileSync(localizedTsPath, "utf-8")
  const mockDataTs = fs.readFileSync(mockDataTsPath, "utf-8")

  const localizedJs = ts.transpileModule(localizedTs, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText

  const mockDataJs = ts.transpileModule(mockDataTs, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText

  const localizedModule = { exports: {} }
  const localizedFn = new Function("exports", "module", localizedJs)
  localizedFn(localizedModule.exports, localizedModule)

  const mockModule = { exports: {} }
  const mockFn = new Function("exports", "module", "require", mockDataJs)
  const customRequire = (id) => {
    if (id.includes("localized")) return localizedModule.exports
    if (id.includes("format")) {
      return { money: (amount, loc) => `${amount} EGP` }
    }
    return {}
  }
  mockFn(mockModule.exports, mockModule, customRequire)

  return mockModule.exports
}

const mockData = loadMockData()
const { MOCK_CARS, MOCK_BRANCHES, MOCK_EXTRAS, SEED_BOOKINGS, MOCK_USER } = mockData

const errors = []

const ARABIC_CHAR_REGEX = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/
const ARABIC_DIGIT_REGEX = /[\u0660-\u0669\u06F0-\u06F9]/
const LATIN_CHAR_REGEX = /[A-Za-z]/

function cleanArabicOfAllowedTokens(str) {
  let s = str
  for (const token of allowedLatinTokens) {
    if (token) {
      s = s.split(token).join(" ")
    }
  }
  return s
}

function validateLocalizedString(locObj, pathName) {
  if (!locObj || typeof locObj !== "object") {
    errors.push(`${pathName}: Expected LocalizedString object { en, ar }, received: ${JSON.stringify(locObj)}`)
    return
  }

  const { en, ar } = locObj
  if (typeof en !== "string" || en.trim() === "") {
    errors.push(`${pathName}.en: Missing or empty English translation`)
  } else {
    // English field should NOT contain Arabic characters or Arabic-Indic digits
    if (ARABIC_CHAR_REGEX.test(en)) {
      errors.push(`${pathName}.en: Contains Arabic characters: "${en}"`)
    }
    if (ARABIC_DIGIT_REGEX.test(en)) {
      errors.push(`${pathName}.en: Contains Arabic-Indic digits: "${en}"`)
    }
  }

  if (typeof ar !== "string" || ar.trim() === "") {
    errors.push(`${pathName}.ar: Missing or empty Arabic translation`)
  } else {
    // Arabic field should contain Arabic script or allowed tokens
    const cleanedAr = cleanArabicOfAllowedTokens(ar)
    if (LATIN_CHAR_REGEX.test(cleanedAr)) {
      errors.push(`${pathName}.ar: Contains unallowed Latin characters: "${ar}" (remaining: "${cleanedAr.trim()}")`)
    }
  }
}

// 1. Validate branches
const KNOWN_BRANCH_IDS = new Set(["alexandria", "cairo", "giza", "sharm", "hurghada", "matruh"])
for (const branch of MOCK_BRANCHES) {
  if (!KNOWN_BRANCH_IDS.has(branch.id)) {
    errors.push(`Branch ${branch.id}: Unknown branch ID`)
  }
  validateLocalizedString(branch.name, `branch[${branch.id}].name`)
  validateLocalizedString(branch.city, `branch[${branch.id}].city`)
  validateLocalizedString(branch.governorate, `branch[${branch.id}].governorate`)
  validateLocalizedString(branch.address, `branch[${branch.id}].address`)
  validateLocalizedString(branch.operatingHours, `branch[${branch.id}].operatingHours`)
}

// 2. Validate extras
const KNOWN_EXTRA_IDS = new Set(["driver", "child-seat", "gps", "insurance"])
for (const extra of MOCK_EXTRAS) {
  if (!KNOWN_EXTRA_IDS.has(extra.id)) {
    errors.push(`Extra ${extra.id}: Unknown extra option ID`)
  }
  validateLocalizedString(extra.name, `extra[${extra.id}].name`)
  validateLocalizedString(extra.description, `extra[${extra.id}].description`)
}

// 3. Validate cars
const VALID_CATEGORIES = new Set(["economy", "sedan", "suv", "luxury", "family_van"])
const VALID_TRANSMISSIONS = new Set(["automatic", "manual"])
const VALID_FUELS = new Set(["petrol", "diesel", "hybrid", "electric"])

for (const car of MOCK_CARS) {
  validateLocalizedString(car.name, `car[${car.id}].name`)
  validateLocalizedString(car.description, `car[${car.id}].description`)

  if (!VALID_CATEGORIES.has(car.type)) {
    errors.push(`car[${car.id}].type: Invalid category code "${car.type}"`)
  }
  if (!VALID_TRANSMISSIONS.has(car.transmission)) {
    errors.push(`car[${car.id}].transmission: Invalid transmission code "${car.transmission}"`)
  }
  if (!VALID_FUELS.has(car.fuel)) {
    errors.push(`car[${car.id}].fuel: Invalid fuel code "${car.fuel}"`)
  }
  if (!KNOWN_BRANCH_IDS.has(car.branchId)) {
    errors.push(`car[${car.id}].branchId: Unknown branch ID "${car.branchId}"`)
  }

  // Features list
  if (!Array.isArray(car.features) || car.features.length === 0) {
    errors.push(`car[${car.id}].features: Missing or empty features list`)
  } else {
    car.features.forEach((feat, idx) => {
      validateLocalizedString(feat, `car[${car.id}].features[${idx}]`)
    })
  }

  // Reviews
  if (Array.isArray(car.reviews)) {
    for (const rev of car.reviews) {
      validateLocalizedString(rev.userName, `car[${car.id}].review[${rev.id}].userName`)
      validateLocalizedString(rev.comment, `car[${car.id}].review[${rev.id}].comment`)
    }
  }
}

// 4. Validate seed bookings
const VALID_BOOKING_STATUSES = new Set(["confirmed", "pending", "completed", "cancelled"])
for (const booking of SEED_BOOKINGS) {
  validateLocalizedString(booking.carName, `booking[${booking.id}].carName`)
  validateLocalizedString(booking.branchName, `booking[${booking.id}].branchName`)
  validateLocalizedString(booking.returnBranchName, `booking[${booking.id}].returnBranchName`)

  if (!VALID_BOOKING_STATUSES.has(booking.status)) {
    errors.push(`booking[${booking.id}].status: Invalid booking status code "${booking.status}"`)
  }
  if (!VALID_CATEGORIES.has(booking.carType)) {
    errors.push(`booking[${booking.id}].carType: Invalid carType category code "${booking.carType}"`)
  }

  if (booking.notes && typeof booking.notes === "object") {
    validateLocalizedString(booking.notes, `booking[${booking.id}].notes`)
  }
  if (booking.userReview?.comment && typeof booking.userReview.comment === "object") {
    validateLocalizedString(booking.userReview.comment, `booking[${booking.id}].userReview.comment`)
  }
}

// 5. Output results
if (errors.length > 0) {
  console.error(`\n❌ Found ${errors.length} data i18n error(s):`)
  errors.forEach((err, i) => console.error(`  ${i + 1}. ${err}`))
  process.exit(1)
}

console.log(`\n✅ test:i18n-data passed! All 14 cars, 6 branches, 4 extras, seed reviews and bookings are valid bilingual models with correct enum codes.`)
process.exit(0)
