# i18n Data Audit Report (`/en` Logged-in Routes)

## Executive Summary
This audit traces all data-driven content appearing in Arabic letters (`[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]`) or Arabic-Indic digits (`[\u0660-\u0669\u06F0-\u06F9]`) on the English version (`/en`) of Golden Trip. While the static application shell was localized via `next-intl`, the underlying dataset (`lib/mockData.ts`) was previously persisted solely in Arabic strings with hardcoded `ar-EG` formatting.

Total offending text instances found across data-driven routes: **98 instances**.

---

## Offender Trace Inventory

### 1. Route: `/en/cars` (Fleet & Catalog)
| # | Selector / Location | Offending Rendered Text | Data Source / File Traced | Root Cause |
|---|---|---|---|---|
| 1 | `.group h3` (Car Card Title) | `"تويوتا كورولا 2024"` | `MOCK_CARS[0].name` in `lib/mockData.ts` | Data stored as Arabic string |
| 2 | `.group span[class*="backdrop-blur"]` | `"سيدان"` | `MOCK_CARS[0].type` in `lib/mockData.ts` | Enum stored as Arabic string |
| 3 | `.group span:has-text("أوتوماتيك")` | `"أوتوماتيك"` | `MOCK_CARS[0].transmission` in `lib/mockData.ts` | Transmission stored as Arabic string |
| 4 | `.group span:has-text("بنزين")` | `"بنزين 92"` | `MOCK_CARS[0].fuel` in `lib/mockData.ts` | Fuel stored as Arabic string |
| 5 | `.group .absolute span:has-text("-")` | `"الإسكندرية - الإسكندرية"` | `branchInfo.city - branchInfo.name.split(" ")[1]` in `cars/page.tsx` | Hardcoded split on Arabic string & duplicate city |
| 6 | `.group span.font-mono:first-of-type` | `"ج.م ١,٤٠٠"` | `formatEGP(car.pricePerDay)` in `cars/page.tsx` | `formatEGP` hardcoded to `ar-EG` |
| 7 | `.group span.font-mono:last-of-type` | `"ج.م ٤,٢٠٠"` | `formatEGP(totalTripPrice)` in `cars/page.tsx` | `formatEGP` hardcoded to `ar-EG` |
| 8 | Filter Type Tabs | `"اقتصادية / سيدان / SUV / فاخرة / عائلية"` | `carTypes` list in `cars/page.tsx` | Filter IDs hardcoded as Arabic strings |
| 9 | Filter Price Slider | `"ج.م ١٥,٠٠٠"` | `formatEGP(maxPrice)` in `cars/page.tsx` | Price indicator hardcoded to `ar-EG` |

### 2. Route: `/en/cars/[id]` (Vehicle Details — All 14 Vehicles)
| # | Selector / Location | Offending Rendered Text | Data Source / File Traced | Root Cause |
|---|---|---|---|---|
| 10 | `h1` (Vehicle Title) | `"هيونداي H-1 ستاريا VIP 2024"` | `car.name` in `lib/mockData.ts` | Vehicle name stored only in Arabic |
| 11 | `p.text-sm` (Description) | `"الفان المستقبلية الأكثر تطوراً في مصر..."` | `car.description` in `lib/mockData.ts` | Vehicle description stored only in Arabic |
| 12 | `div.grid > div:nth-child(2) span.font-bold` | `"أوتوماتيك"` | `car.transmission` in `lib/mockData.ts` | Specs value stored as Arabic string |
| 13 | `div.grid > div:nth-child(3) span.font-bold` | `"ديزل"` | `car.fuel` in `lib/mockData.ts` | Specs value stored as Arabic string |
| 14 | Equipment items `div.grid-cols-2 span` | `"مقاعد استرخاء كهربائية..."` | `car.features[]` in `lib/mockData.ts` | Equipment checklist stored only in Arabic |
| 15 | Branch banner `span.text-xs` | `"فرع القاهرة (مطار القاهرة الدولي) - القاهرة"` | `t("locationInfo")` with Arabic branch fields | Branch name & city stored in Arabic |
| 16 | Branch address | `"صالة 3 - مطار القاهرة الدولي، مصر الجديدة"` | `branchInfo.address` in `lib/mockData.ts` | Branch address stored only in Arabic |
| 17 | Branch working hours | `"متاح 24 ساعة يومياً"` | `branchInfo.operatingHours` in `lib/mockData.ts` | Hours stored only in Arabic |
| 18 | Add-on option title | `"سائق خاص محترف ومُعتمد"` | `extra.name` in `lib/mockData.ts` | Extras stored only in Arabic |
| 19 | Add-on description | `"سائق خبير بطرق السفر السريعة..."` | `extra.description` in `lib/mockData.ts` | Extras description stored only in Arabic |
| 20 | Add-on price badge | `"+400 EGP"` vs `"+ج.م ٨٤٠"` | Inconsistent string concatenation in `cars/[id]/page.tsx` | No single source of truth for money formatting |
| 21 | Reviewer Name | `"م. إسلام نجاتي"` | `rev.userName` in `lib/mockData.ts` | Review author stored only in Arabic |
| 22 | Review Comment | `"سيارة مذهلة جداً ومريحة لأقصى درجة..."` | `rev.comment` in `lib/mockData.ts` | Review text stored only in Arabic |
| 23 | Review Date | `"2026-10-01"` | `rev.date` in `cars/[id]/page.tsx` | ISO date string rendered directly in UI |

### 3. Route: `/en/booking/[id]` (Direct Booking Flow Steps 1–4)
| # | Selector / Location | Offending Rendered Text | Data Source / File Traced | Root Cause |
|---|---|---|---|---|
| 24 | Header subtitle | `"Completing booking for: تويوتا كورولا 2024"` | `car.name` in `booking/[id]/page.tsx` | Stored Arabic car name passed to `{name}` placeholder |
| 25 | Category badge | `"Category: سيدان"` | `car.type` in `booking/[id]/page.tsx` | Stored Arabic car type passed to `{type}` placeholder |
| 26 | Branch selector option | `"الإسكندرية (الإسكندرية)"` | `MOCK_BRANCHES` map in `booking/[id]/page.tsx` | Branch city & name in Arabic |
| 27 | Summary table per-day price | `"ج.م ١,٤٠٠"` | `formatEGP(car.pricePerDay)` | Hardcoded `ar-EG` currency |
| 28 | Summary table extras total | `"+ج.م ٨٤٠"` | `formatEGP(totalExtrasCost)` | Hardcoded `ar-EG` currency |
| 29 | Summary table tax amount | `"ج.م ٧٠٦"` | `formatEGP(taxAmount)` | Hardcoded `ar-EG` currency |
| 30 | Summary table grand total | `"ج.م ٥,٧٤٦"` | `formatEGP(grandTotal)` | Hardcoded `ar-EG` currency |
| 31 | Step 4 Confirmation reference | Car name, branch name in Arabic | `MOCK_CARS` / `MOCK_BRANCHES` | Non-localized booking snapshot |

### 4. Route: `/en/my-bookings` (Customer Bookings Dashboard)
| # | Selector / Location | Offending Rendered Text | Data Source / File Traced | Root Cause |
|---|---|---|---|---|
| 32 | Status filter tabs | `"مؤكد / قيد الانتظار / مكتمل / ملغي"` | `activeTab` comparisons in `my-bookings/page.tsx` | Status tab IDs compared against Arabic status strings |
| 33 | Booking card car title | `"تويوتا كورولا 2024"` | `b.carName` in `SEED_BOOKINGS` | Stored booking car name in Arabic |
| 34 | Booking card branch line | `"To: فرع القاهرة (مطار القاهرة الدولي)"` | `b.returnBranchName` in `SEED_BOOKINGS` | Stored branch name in Arabic |
| 35 | Booking card status badge | `"مؤكد"` / `"قيد الانتظار"` | `b.status` in `SEED_BOOKINGS` | Status displayed as stored Arabic text |
| 36 | Booking card prices | `"ج.م ١,٤٠٠ / day"`, `"ج.م ٥,٧٤٦"` | `formatEGP(...)` in `my-bookings/page.tsx` | Hardcoded `ar-EG` formatter |
| 37 | Published review in booking | `"رحلة رائعة جداً والسيارة كانت ممتازة..."` | `b.userReview.comment` in `SEED_BOOKINGS` | Review comment stored only in Arabic |

---

## Resolution Strategy
1. **Bilingual Data Model**: Upgrade `lib/mockData.ts` to `LocalizedString = { en: string, ar: string }` across all models.
2. **Canonical Enumeration Codes**: Replace Arabic display values with standard keys (`economy | sedan | suv | luxury | family_van`, `automatic | manual`, `petrol | diesel | hybrid | electric`, `confirmed | pending | completed | cancelled`).
3. **Unified Formatter**: Implement `lib/format.ts` with `money(amount, locale)` returning `"EGP 3,500"` in `/en` and `"٣٬٥٠٠ ج.م"` in `/ar`.
4. **Localization Helper**: Implement `lib/localized.ts` (`pick(field, locale)`), throwing on missing translations in development/testing.
5. **UGC Transliteration & Fallback**: Implement `lib/translate.ts` with name transliteration and `[data-ugc-original="true"]` fallback.
