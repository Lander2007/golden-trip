import {
  LocalizedString,
  VehicleCategory,
  TransmissionType,
  FuelType,
  BookingStatus,
} from "./localized"
import { money } from "./format"

export interface Branch {
  id: string
  name: LocalizedString
  city: LocalizedString
  governorate: LocalizedString
  address: LocalizedString
  phone: string
  operatingHours: LocalizedString
}

export interface Review {
  id: string
  userName: LocalizedString
  userAvatar?: string
  rating: number // 1 to 5
  date: string // ISO YYYY-MM-DD
  comment: LocalizedString
  originalLang?: "en" | "ar"
}

export interface Car {
  id: string
  name: LocalizedString
  type: VehicleCategory
  pricePerDay: number // in EGP
  seats: number
  transmission: TransmissionType
  fuel: FuelType
  branchId: string
  image: string
  rating: number
  reviews: Review[]
  available: boolean
  features: LocalizedString[]
  doors: number
  luggage: number // large bags count
  year: number
  description: LocalizedString
}

export interface ExtraOption {
  id: string
  name: LocalizedString
  description: LocalizedString
  pricePerDay: number
  icon: string
}

export interface Booking {
  id: string
  carId: string
  carName: LocalizedString
  carImage: string
  carType: VehicleCategory
  branchId: string
  branchName: LocalizedString
  returnBranchId: string
  returnBranchName: LocalizedString
  pickupDate: string
  returnDate: string
  totalDays: number
  pricePerDay: number
  selectedExtras: {
    id: string
    name: LocalizedString
    pricePerDay: number
  }[]
  extrasTotal: number
  subtotal: number
  tax: number // 14% VAT
  totalPrice: number
  customerName: LocalizedString | string
  customerEmail: string
  customerPhone: string
  nationalId: string
  paymentMethod: "online" | "cash"
  status: BookingStatus
  createdAt: string
  notes?: LocalizedString | string
  userReview?: {
    rating: number
    comment: LocalizedString | string
    date: string
  }
}

export interface User {
  id: string
  name: LocalizedString | string
  email: string
  phone: string
  nationalId: string
  licenseNumber: string
}

export const MOCK_BRANCHES: Branch[] = [
  {
    id: "alexandria",
    name: {
      en: "Alexandria Branch (Headquarters)",
      ar: "فرع الإسكندرية (المقر الرئيسي)",
    },
    city: {
      en: "Alexandria",
      ar: "الإسكندرية",
    },
    governorate: {
      en: "Alexandria",
      ar: "الإسكندرية",
    },
    address: {
      en: "El Geish Road, Corniche, Sidi Gaber, Alexandria",
      ar: "طريق الجيش، الكورنيش، سيدي جابر، الإسكندرية",
    },
    phone: "010 06803316",
    operatingHours: {
      en: "Open 24 hours daily",
      ar: "متاح 24 ساعة يومياً",
    },
  },
  {
    id: "cairo",
    name: {
      en: "Cairo Branch (Cairo International Airport)",
      ar: "فرع القاهرة (مطار القاهرة الدولي)",
    },
    city: {
      en: "Cairo",
      ar: "القاهرة",
    },
    governorate: {
      en: "Cairo",
      ar: "القاهرة",
    },
    address: {
      en: "Terminal 3 - Cairo International Airport, Heliopolis",
      ar: "صالة 3 - مطار القاهرة الدولي، مصر الجديدة",
    },
    phone: "010 06803317",
    operatingHours: {
      en: "Open 24 hours daily",
      ar: "متاح 24 ساعة يومياً",
    },
  },
  {
    id: "giza",
    name: {
      en: "Giza Branch (Sheikh Zayed)",
      ar: "فرع الجيزة (الشيخ زايد)",
    },
    city: {
      en: "Giza",
      ar: "الجيزة",
    },
    governorate: {
      en: "Giza",
      ar: "الجيزة",
    },
    address: {
      en: "26th of July Corridor, Zayed 1 Entrance, Giza",
      ar: "محور 26 يوليو، مدخل زايد 1، الجيزة",
    },
    phone: "010 06803318",
    operatingHours: {
      en: "8:00 AM - 12:00 AM",
      ar: "8:00 ص - 12:00 م",
    },
  },
  {
    id: "sharm",
    name: {
      en: "Sharm El-Sheikh International Branch",
      ar: "فرع شرم الشيخ الدولي",
    },
    city: {
      en: "Sharm El-Sheikh",
      ar: "شرم الشيخ",
    },
    governorate: {
      en: "South Sinai",
      ar: "جنوب سيناء",
    },
    address: {
      en: "Naama Bay, Peace Road, Sharm El-Sheikh",
      ar: "خليج نعمة، طريق السلام، شرم الشيخ",
    },
    phone: "010 06803319",
    operatingHours: {
      en: "Open 24 hours daily",
      ar: "متاح 24 ساعة يومياً",
    },
  },
  {
    id: "hurghada",
    name: {
      en: "Hurghada Branch (Touristic Promenade)",
      ar: "فرع الغردقة (الممشى السياحي)",
    },
    city: {
      en: "Hurghada",
      ar: "الغردقة",
    },
    governorate: {
      en: "Red Sea",
      ar: "البحر الأحمر",
    },
    address: {
      en: "Villages Road, Touristic Promenade, Hurghada",
      ar: "طريق القرى، الممشى السياحي، الغردقة",
    },
    phone: "010 06803320",
    operatingHours: {
      en: "8:00 AM - 1:00 AM",
      ar: "8:00 ص - 1:00 ص",
    },
  },
  {
    id: "matruh",
    name: {
      en: "Marsa Matrouh Branch",
      ar: "فرع مرسى مطروح",
    },
    city: {
      en: "Marsa Matrouh",
      ar: "مرسى مطروح",
    },
    governorate: {
      en: "Matrouh",
      ar: "مطروح",
    },
    address: {
      en: "Alexandria Street, Downtown, Marsa Matrouh",
      ar: "شارع الإسكندرية، وسط المدينة، مرسى مطروح",
    },
    phone: "010 06803321",
    operatingHours: {
      en: "9:00 AM - 11:00 PM",
      ar: "9:00 ص - 11:00 م",
    },
  },
]

export const MOCK_EXTRAS: ExtraOption[] = [
  {
    id: "driver",
    name: {
      en: "Professional certified private driver",
      ar: "سائق خاص محترف ومعتمد",
    },
    description: {
      en: "Expert driver familiar with Egyptian highways, available throughout the entire trip",
      ar: "سائق خبير بطرق السفر السريعة ومتاح طوال مدة الرحلة",
    },
    pricePerDay: 400,
    icon: "UserCheck",
  },
  {
    id: "child-seat",
    name: {
      en: "Child safety seat",
      ar: "مقعد أمان للأطفال",
    },
    description: {
      en: "Comfortable and secure seat compliant with international safety standards",
      ar: "مقعد مريح وآمن متوافق مع معايير السلامة الدولية",
    },
    pricePerDay: 120,
    icon: "Shield",
  },
  {
    id: "gps",
    name: {
      en: "Advanced GPS navigation device",
      ar: "جهاز ملاحة GPS متطور",
    },
    description: {
      en: "Updated Egyptian road maps with real-time route alerts and speed warnings",
      ar: "خرائط محدثة لمصر مع تنبيهات الطرق والسرعات",
    },
    pricePerDay: 90,
    icon: "Navigation",
  },
  {
    id: "insurance",
    name: {
      en: "Comprehensive zero-excess insurance (Gold Shield)",
      ar: "تأمين شامل بدون تحمل (Gold Shield)",
    },
    description: {
      en: "Full accident and damage protection with zero personal deductible liability",
      ar: "تغطية كاملة للحوادث والأضرار بدون أي مبالغ تحمل شخصية",
    },
    pricePerDay: 280,
    icon: "ShieldCheck",
  },
]

export const MOCK_CARS: Car[] = [
  {
    id: "car-1",
    name: {
      en: "Toyota Corolla 2024",
      ar: "تويوتا كورولا 2024",
    },
    type: "sedan",
    pricePerDay: 1400,
    seats: 5,
    doors: 4,
    luggage: 3,
    year: 2024,
    transmission: "automatic",
    fuel: "petrol",
    branchId: "alexandria",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1000&auto=format&fit=crop",
    rating: 4.8,
    available: true,
    description: {
      en: "The most reliable and comfortable sedan for Egyptian highways, equipped with advanced safety systems and outstanding fuel efficiency.",
      ar: "السيارة السيدان الأكثر اعتمادية وراحة على الطرق السريعة في مصر، مزودة بأحدث أنظمة الأمان وكفاءة استهلاك وقود ممتازة.",
    },
    features: [
      { en: "Dual-zone digital climate control", ar: "تكييف هواء رقمي مزدوج" },
      { en: "9-inch touchscreen with Apple CarPlay", ar: "شاشة لمس 9 بوصة تدعم Apple CarPlay" },
      { en: "Parking sensors & rear camera", ar: "حساسات ركن وكاميرا خلفية" },
      { en: "Smart cruise control", ar: "مثبت سرعة ذكي" },
      { en: "6-speaker premium audio system", ar: "نظام صوتي 6 سماعات" },
    ],
    reviews: [
      {
        id: "rev-101",
        userName: { en: "Mahmoud Abdel Aziz", ar: "محمود عبد العزيز" },
        rating: 5,
        date: "2026-09-18",
        comment: {
          en: "Extremely comfortable car and spotless like brand new. Picked it up at the Alexandria branch and the staff was thoroughly professional.",
          ar: "سيارة مريحة جداً ونظيفة كالجديدة تماماً. استلمتها من فرع الإسكندرية وكان التعامل في غاية الاحترافية.",
        },
      },
      {
        id: "rev-102",
        userName: { en: "Sarah Ibrahim", ar: "سارة إبراهيم" },
        rating: 5,
        date: "2026-09-02",
        comment: {
          en: "Very fuel efficient and driving it up to Cairo was smooth and enjoyable.",
          ar: "اقتصادية جداً في البنزين والسفر بها للقاهرة كان ممتعاً وسلساً.",
        },
      },
    ],
  },
  {
    id: "car-2",
    name: {
      en: "Hyundai Elantra CN7 2024",
      ar: "هيونداي إلنترا CN7 2024",
    },
    type: "sedan",
    pricePerDay: 1550,
    seats: 5,
    doors: 4,
    luggage: 3,
    year: 2024,
    transmission: "automatic",
    fuel: "petrol",
    branchId: "cairo",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1000&auto=format&fit=crop",
    rating: 4.9,
    available: true,
    description: {
      en: "Bold futuristic design with a spacious cabin and responsive engine, an ideal choice for executive business trips and intercity travel.",
      ar: "تصميم جريء ومستقبلي مع مقصورة رحبة ومحرك نشط، خيار مثالي لرحلات العمل والمسافات الطويلة بين المحافظات.",
    },
    features: [
      { en: "10.25-inch digital instrument cluster", ar: "شاشة عدادات رقمية 10.25 بوصة" },
      { en: "Electric sunroof", ar: "فتحة سقف كهربائية" },
      { en: "Wireless phone charging pad", ar: "شاحن لاسلكي للهواتف" },
      { en: "Multi-color ambient cabin lighting", ar: "إضاءة محيطية متعددة الألوان" },
      { en: "ABS and ESP electronic stability system", ar: "نظام فرامل مانع للانغلاق ABS و ESP" },
    ],
    reviews: [
      {
        id: "rev-103",
        userName: { en: "Karim Fahmy", ar: "كريم فهمي" },
        rating: 5,
        date: "2026-09-25",
        comment: {
          en: "Outstanding experience at Cairo Airport. Luxurious car and deeply comfortable for late night driving.",
          ar: "تجربة ممتازة من مطار القاهرة. السيارة فارهة ومريحة جداً في القيادة الليلية.",
        },
      },
      {
        id: "rev-104",
        userName: { en: "Ahmed Al-Sharif", ar: "أحمد الشريف" },
        rating: 4,
        date: "2026-08-30",
        comment: {
          en: "Modern and pleasant car. Highly recommend Golden Trip for quick and seamless procedures.",
          ar: "سيارة حديثة وممتعة، وأنصح بالتعامل مع جولدن تريب لسرعة الإجراءات.",
        },
      },
    ],
  },
  {
    id: "car-3",
    name: {
      en: "Nissan Sunny 2024",
      ar: "نيسان صني 2024",
    },
    type: "economy",
    pricePerDay: 950,
    seats: 5,
    doors: 4,
    luggage: 2,
    year: 2024,
    transmission: "automatic",
    fuel: "petrol",
    branchId: "giza",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000&auto=format&fit=crop",
    rating: 4.6,
    available: true,
    description: {
      en: "The premier economic choice for urban commuting and day trips, practical, easy to park, with generous interior room.",
      ar: "الخيار الاقتصادي الأول داخل المدن والرحلات اليومية، عملية وسهلة الاصطفاف ومساحة داخلية جيدة.",
    },
    features: [
      { en: "High-performance air conditioning", ar: "تكييف هواء قوي" },
      { en: "Bluetooth & USB connectivity", ar: "بلوتوث ومدخل USB" },
      { en: "Dual front airbags", ar: "وسائد هوائية أمامية" },
      { en: "Full electric power windows", ar: "زجاج كهربائي كامل" },
      { en: "EBD electronic brake-force distribution", ar: "نظام توزيع إلكتروني للفرامل EBD" },
    ],
    reviews: [
      {
        id: "rev-105",
        userName: { en: "Tarek Mansour", ar: "طارق منصور" },
        rating: 5,
        date: "2026-09-12",
        comment: {
          en: "Best value for price in the market. The car was fully prepped right on time.",
          ar: "أفضل سعر مقابل القيمة في السوق. السيارة كانت جاهزة في الموعد تماماً.",
        },
      },
    ],
  },
  {
    id: "car-4",
    name: {
      en: "Kia Sportage 2025",
      ar: "كيا سبورتاج 2025",
    },
    type: "suv",
    pricePerDay: 2600,
    seats: 5,
    doors: 5,
    luggage: 4,
    year: 2025,
    transmission: "automatic",
    fuel: "petrol",
    branchId: "alexandria",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1000&auto=format&fit=crop",
    rating: 4.9,
    available: true,
    description: {
      en: "A sporty SUV combining power, comfort, and refinement, built to deliver absolute confidence across highways and varied terrain.",
      ar: "سيارة دفع رباعي رياضية تجمع بين القوة والراحة والفخامة، صممت لتمنحك ثقة كاملة على الطرق السريعة والتضاريس المختلفة.",
    },
    features: [
      { en: "Dual curved panoramic display", ar: "شاشة بانورامية منحنية مزدوجة" },
      { en: "Full panoramic glass roof", ar: "سقف بانوراما بالكامل" },
      { en: "Leather seats with heating & ventilation", ar: "مقاعد جلدية مع تدفئة وتبريد" },
      { en: "360-degree surround-view cameras", ar: "كاميرات محيطية 360 درجة" },
      { en: "Lane keeping assist & driving aids", ar: "نظام القيادة الذاتية والمساعدة في الحارة" },
    ],
    reviews: [
      {
        id: "rev-106",
        userName: { en: "Omar Khaled", ar: "عمر خالد" },
        rating: 5,
        date: "2026-10-02",
        comment: {
          en: "Took it on a trip from Alexandria to the North Coast. Fantastic stability and unbelievable comfort.",
          ar: "أخذتها في رحلة من الإسكندرية إلى الساحل الشمالي. ثبات خيالي وراحة لا توصف.",
        },
      },
      {
        id: "rev-107",
        userName: { en: "Mona Zaki", ar: "منى زكي" },
        rating: 5,
        date: "2026-09-15",
        comment: {
          en: "Wonderful family car, huge luggage space and very courteous branch reception.",
          ar: "سيارة رائعة للعائلات، شنطة الأمتعة واسعة جداً والخدمة في الفرع راقية.",
        },
      },
    ],
  },
  {
    id: "car-5",
    name: {
      en: "BMW X5 xDrive 2024",
      ar: "BMW X5 xDrive 2024",
    },
    type: "luxury",
    pricePerDay: 6800,
    seats: 5,
    doors: 5,
    luggage: 5,
    year: 2024,
    transmission: "automatic",
    fuel: "petrol",
    branchId: "cairo",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000&auto=format&fit=crop",
    rating: 5.0,
    available: true,
    description: {
      en: "The pinnacle of German luxury and supreme performance, boasting intelligent all-wheel drive, bespoke leather, and cutting-edge tech.",
      ar: "قمة الفخامة الألمانية والأداء الفائق. مزودة بنظام دفع رباعي ذكي ومقصورة مكسوة بأفخر أنواع الجلد الطبيعي والتكنولوجيا الرائدة.",
    },
    features: [
      { en: "Harman Kardon surround sound system", ar: "نظام صوت Harman Kardon المحيطي" },
      { en: "Adaptive air suspension", ar: "نظام تعليق هوائي متكيف" },
      { en: "Soft-close automatic doors", ar: "أبواب شفط إلكترونية" },
      { en: "Head-Up Display (HUD)", ar: "عرض المعلومات على الزجاج الأمامي HUD" },
      { en: "M Sport aerodynamic package", ar: "حزمة M Sport الرياضية" },
    ],
    reviews: [
      {
        id: "rev-108",
        userName: { en: "Dr. Hany Radwan", ar: "د. هاني رضوان" },
        rating: 5,
        date: "2026-09-28",
        comment: {
          en: "Exceptional luxury and breathtaking performance. Pristine showroom condition.",
          ar: "فخامة استثنائية وأداء مبهر. السيارة كانت برائحة الوكالة وبحالة ممتازة.",
        },
      },
    ],
  },
  {
    id: "car-6",
    name: {
      en: "Mercedes-Benz C200 AMG 2024",
      ar: "مرسيدس بنز C200 AMG 2024",
    },
    type: "luxury",
    pricePerDay: 5400,
    seats: 5,
    doors: 4,
    luggage: 3,
    year: 2024,
    transmission: "automatic",
    fuel: "petrol",
    branchId: "giza",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000&auto=format&fit=crop",
    rating: 4.9,
    available: true,
    description: {
      en: "An icon of prestige and athletic elegance by Mercedes-Benz, highlighted by AMG styling cues and mesmerizing ambient lighting.",
      ar: "أيقونة الفخامة والجاذبية من مرسيدس بنز، بتفاصيل AMG الرياضية وإضاءة محيطية ساحرة تخطف الأنظار في كل رحلة.",
    },
    features: [
      { en: "Vertical MBUX central touchscreen", ar: "شاشة ترفيه مركزية MBUX رأسية" },
      { en: "Burmester 3D surround sound system", ar: "نظام Burmester الصوتي 3D" },
      { en: "Parktronic active parking assist", ar: "نظام ركن آلي Parktronic" },
      { en: "Advanced Digital Light headlamps", ar: "إضاءة رقمية Digital Light متطورة" },
      { en: "Power sport seats with memory settings", ar: "مقاعد رياضية كهربائية بذاكرة" },
    ],
    reviews: [
      {
        id: "rev-109",
        userName: { en: "Yassin Al-Minshawi", ar: "ياسين المنشاوي" },
        rating: 5,
        date: "2026-10-04",
        comment: {
          en: "Superbly elegant vehicle, perfect for high-profile business meetings and upscale occasions.",
          ar: "السيارة قمة في الأناقة ومثالية لاجتماعات العمل والمناسبات الراقية.",
        },
      },
    ],
  },
  {
    id: "car-7",
    name: {
      en: "Toyota Hiace VIP (family van)",
      ar: "تويوتا هايس VIP (فان عائلية)",
    },
    type: "family_van",
    pricePerDay: 3200,
    seats: 12,
    doors: 4,
    luggage: 8,
    year: 2024,
    transmission: "automatic",
    fuel: "diesel",
    branchId: "sharm",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=1000&auto=format&fit=crop",
    rating: 4.8,
    available: true,
    description: {
      en: "The ultimate choice for large family holidays and VIP delegations, featuring plush captain chairs and powerful climate control for all rows.",
      ar: "الخيار الأمثل للرحلات العائلية والمجموعات الكبيرة، مقاعد وثيرة مريحة ومكيف هواء مركزي قوي يغطي جميع الركاب.",
    },
    features: [
      { en: "VIP leather captain seats", ar: "مقاعد قبطانية جلدية VIP" },
      { en: "Independent rear climate control", ar: "تكييف خلفي مركزي مستقل" },
      { en: "Rear passenger entertainment screens", ar: "شاشات عرض للركاب" },
      { en: "Integrated beverage cooler", ar: "ثلاجة مشروبات مدمجة" },
      { en: "Expansive luggage compartment", ar: "مساحة أمتعة ضخمة للحقائب" },
    ],
    reviews: [
      {
        id: "rev-110",
        userName: { en: "Family of Eng. Hesham", ar: "أسرة المهندس هشام" },
        rating: 5,
        date: "2026-08-20",
        comment: {
          en: "Spent a week in Sharm El-Sheikh and the van provided incredible comfort for the whole family.",
          ar: "قضينا أسبوعاً في شرم الشيخ وكانت الحافلة غاية في الراحة لكل أفراد العائلة.",
        },
      },
    ],
  },
  {
    id: "car-8",
    name: {
      en: "Hyundai Tucson NX4 2024",
      ar: "هيونداي توسان NX4 2024",
    },
    type: "suv",
    pricePerDay: 2400,
    seats: 5,
    doors: 5,
    luggage: 4,
    year: 2024,
    transmission: "automatic",
    fuel: "petrol",
    branchId: "hurghada",
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1000&auto=format&fit=crop",
    rating: 4.8,
    available: true,
    description: {
      en: "A modern crossover blending generous space and smart technology, fully prepared for coastal getaways and long highway journeys.",
      ar: "كروس أوفر عصرية تجمع بين الرحابة والتقنية الذكية، مجهزة بالكامل للرحلات الساحلية ورحلات الطرق السريعة.",
    },
    features: [
      { en: "10.25-inch infotainment touchscreen", ar: "شاشة لمسية 10.25 بوصة" },
      { en: "Tri-zone automatic climate control", ar: "نظام تكييف ثلاثي المناطق" },
      { en: "Full side curtain airbags", ar: "وسائد هوائية ستائرية كاملة" },
      { en: "Multi-drive modes (Eco, Sport, Normal)", ar: "أوضاع قيادة متعددة (Eco, Sport, Normal)" },
      { en: "Smart power liftgate", ar: "شنطة أمتعة كهربائية ذكية" },
    ],
    reviews: [
      {
        id: "rev-111",
        userName: { en: "Mostafa Gad", ar: "مصطفى جاد" },
        rating: 4,
        date: "2026-09-10",
        comment: {
          en: "Comfortable and very practical crossover rented in Hurghada. Pickup and handover took under 5 minutes.",
          ar: "سيارة مريحة وعملية جداً استأجرتها في الغردقة، الاستلام والتسليم استغرق أقل من 5 دقائق.",
        },
      },
    ],
  },
  {
    id: "car-9",
    name: {
      en: "Kia Cerato 2024",
      ar: "كيا سيراتو جراند 2024",
    },
    type: "sedan",
    pricePerDay: 1350,
    seats: 5,
    doors: 4,
    luggage: 3,
    year: 2024,
    transmission: "automatic",
    fuel: "petrol",
    branchId: "matruh",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=1000&auto=format&fit=crop",
    rating: 4.7,
    available: true,
    description: {
      en: "A sleek compact sedan delivering proven reliability and smooth composure for city cruising and Egyptian coastal roads.",
      ar: "سيدان أنيقة ومدمجة تجمع بين الموثوقية العالية والراحة أثناء القيادة اليومية والسفر على السواحل المصرية.",
    },
    features: [
      { en: "17-inch alloy sport wheels", ar: "جنوط رياضية 17 بوصة" },
      { en: "Electric power sunroof", ar: "فتحة سقف كهربائية" },
      { en: "Steering wheel audio & cruise controls", ar: "تحكم كامل من عجلة القيادة" },
      { en: "Keyless smart push-button start", ar: "نظام تشغيل بدون مفتاح (بصمة)" },
      { en: "Engine immobilizer anti-theft system", ar: "نظام مانع السرقة إيموبليزر" },
    ],
    reviews: [
      {
        id: "rev-112",
        userName: { en: "Ashraf Kamal", ar: "أشرف كمال" },
        rating: 5,
        date: "2026-08-14",
        comment: {
          en: "Drove it from Marsa Matrouh to Alexandria. Excellent road stability and the air conditioning is ice cold.",
          ar: "سافرت بها من مطروح للإسكندرية، الثبات ممتاز والتكييف ثلاجة في عز الحر.",
        },
      },
    ],
  },
  {
    id: "car-10",
    name: {
      en: "Chevrolet Optra 2023",
      ar: "شيفروليه أوبترا 2023",
    },
    type: "economy",
    pricePerDay: 850,
    seats: 5,
    doors: 4,
    luggage: 2,
    year: 2023,
    transmission: "manual",
    fuel: "petrol",
    branchId: "alexandria",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000&auto=format&fit=crop",
    rating: 4.4,
    available: false,
    description: {
      en: "An economical, nimble manual sedan with minimal operating costs, perfect for swift city errands and everyday reliability.",
      ar: "سيارة اقتصادية وعملية جداً لناقل الحركة اليدوي مع مصاريف تشغيل منخفضة، مثالية للمشاوير السريعة في شوارع المدينة.",
    },
    features: [
      { en: "Manual air conditioning", ar: "تكييف هواء يدوي" },
      { en: "Radio & Bluetooth connectivity", ar: "راديو وبلوتوث" },
      { en: "Anti-lock braking system (ABS)", ar: "فرامل ABS" },
      { en: "Remote central door locking", ar: "إغلاق مركزي للأبواب" },
      { en: "Practical trunk cargo capacity", ar: "صندوق أمتعة عملي" },
    ],
    reviews: [
      {
        id: "rev-113",
        userName: { en: "Hossam Hassan", ar: "حسام حسن" },
        rating: 4,
        date: "2026-07-22",
        comment: {
          en: "Good, highly budget-friendly car for daily urban errands.",
          ar: "سيارة جيدة وموفرة جداً في السعر للمشاوير العادية.",
        },
      },
    ],
  },
  {
    id: "car-11",
    name: {
      en: "Mercedes-Benz S500 Maybach 2024",
      ar: "مرسيدس بنز S500 Maybach 2024",
    },
    type: "luxury",
    pricePerDay: 12500,
    seats: 4,
    doors: 4,
    luggage: 4,
    year: 2024,
    transmission: "automatic",
    fuel: "petrol",
    branchId: "cairo",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1000&auto=format&fit=crop",
    rating: 5.0,
    available: true,
    description: {
      en: "The crowning achievement of bespoke luxury for dignitaries and executives, offering first-class lounge comfort, massage seating, and serene quiet.",
      ar: "تاج الفخامة المطلقة لرجال الأعمال وكبار الشخصيات. مقصورة فندقية من الدرجة الأولى مع مقاعد تدليك ومساحة رحبة لا تضاهى.",
    },
    features: [
      { en: "Executive rear seating with massage & ventilation", ar: "مقاعد خلفية Executive مع تدليك وتدفئة وتبريد" },
      { en: "Dual rear MBUX entertainment displays", ar: "شاشات ترفيه خلفية منفصلة MBUX" },
      { en: "Burmester High-End 3D surround system", ar: "نظام صوتي ثلاثي الأبعاد Burmester High-End" },
      { en: "Acoustic comfort package with dual-pane glass", ar: "نظام عزل صوتي متطور مع زجاج مزدوج" },
      { en: "Folding rear work tables & refrigerated compartment", ar: "طاولات عمل قابلة للطي ومبرد مشروبات" },
    ],
    reviews: [
      {
        id: "rev-114",
        userName: { en: "H.E. Ambassador / Nasser Al-Otaibi", ar: "سعادة السفير / ناصر العتيبي" },
        rating: 5,
        date: "2026-09-30",
        comment: {
          en: "Impeccably refined service and prompt commitment. The car was immaculate and the chauffeur highly professional.",
          ar: "خدمة في غاية الرقي والالتزام. السيارة بحالة الوكالة والسائق كان على أعلى درجات المهنية.",
        },
      },
    ],
  },
  {
    id: "car-12",
    name: {
      en: "Toyota Fortuner 4x4 2024",
      ar: "تويوتا فورتشنر 4x4 2024",
    },
    type: "suv",
    pricePerDay: 3100,
    seats: 7,
    doors: 5,
    luggage: 5,
    year: 2024,
    transmission: "automatic",
    fuel: "petrol",
    branchId: "sharm",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop",
    rating: 4.7,
    available: true,
    description: {
      en: "A rugged 4x4 built for desert safaris and cross-country adventures, offering true four-wheel-drive capability with 7 spacious seats.",
      ar: "وحش الطرق الوعرة والرحلات الصحراوية والسفاري. دفع رباعي حقيقي مع 7 مقاعد تتسع لجميع أفراد العائلة والأمتعة.",
    },
    features: [
      { en: "Full-time 4x4 with low/high range transfer case", ar: "نظام دفع رباعي مع دبل ثقيل وخفيف" },
      { en: "7 comfortable seats with 3rd-row fold flat", ar: "7 مقاعد مريحة مع طي الصف الثالث" },
      { en: "Front & rear parking sonars", ar: "حساسات أمامية وخلفية" },
      { en: "Cruise control with downhill assist", ar: "مثبت سرعة وتحكم بالانحدار" },
      { en: "Advanced emergency brake assist", ar: "نظام فرامل طوارئ متطور" },
    ],
    reviews: [
      {
        id: "rev-115",
        userName: { en: "Walid Sabry", ar: "وليد صبري" },
        rating: 5,
        date: "2026-09-05",
        comment: {
          en: "Tremendous capability across the Sinai mountains and Sharm roads. Powerful and very reassuring.",
          ar: "قوة جبارة في الجبال وطرق شرم الشيخ، سيارة قوية ومريحة جداً.",
        },
      },
    ],
  },
  {
    id: "car-13",
    name: {
      en: "Hyundai H-1 Staria VIP 2024",
      ar: "هيونداي H-1 ستاريا VIP 2024",
    },
    type: "family_van",
    pricePerDay: 3500,
    seats: 9,
    doors: 5,
    luggage: 6,
    year: 2024,
    transmission: "automatic",
    fuel: "diesel",
    branchId: "cairo",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1000&auto=format&fit=crop",
    rating: 4.9,
    available: true,
    description: {
      en: "Egypt's most advanced futuristic passenger van, featuring spaceship styling, panoramic windows, and relaxation seating for long journeys.",
      ar: "الفان المستقبلية الأكثر تطوراً في مصر. تصميم فضائي مع زجاج بانورامي عريض ومقاعد استرخاء فاخرة لرحلات السفر الطويلة.",
    },
    features: [
      { en: "Power relaxation seats with zero-gravity mode", ar: "مقاعد استرخاء كهربائية مع وضعية انعدام الجاذبية" },
      { en: "Smart power sliding side doors", ar: "أبواب جانبية كهربائية ذكية" },
      { en: "10.25-inch high-resolution navigation screen", ar: "شاشة ملاحة 10.25 بوصة" },
      { en: "Independent multi-zone ventilation for all rows", ar: "تكييف هواء مستقل لجميع الصفوف" },
      { en: "Dedicated USB charging ports for each seat", ar: "مداخل شحن USB لكل راكب" },
    ],
    reviews: [
      {
        id: "rev-116",
        userName: { en: "M. Islam Nagaty", ar: "م. إسلام نجاتي" },
        rating: 5,
        date: "2026-10-01",
        comment: {
          en: "Incredible vehicle and comfortable to the utmost degree. We enjoyed the trip from Cairo to Hurghada without fatigue.",
          ar: "سيارة مذهلة جداً ومريحة لأقصى درجة، استمتعنا بالرحلة من القاهرة للغردقة دون أي تعب.",
        },
      },
    ],
  },
  {
    id: "car-14",
    name: {
      en: "Renault Megane 2024",
      ar: "رينو ميجان 2024",
    },
    type: "economy",
    pricePerDay: 1100,
    seats: 5,
    doors: 4,
    luggage: 3,
    year: 2024,
    transmission: "manual",
    fuel: "petrol",
    branchId: "hurghada",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1000&auto=format&fit=crop",
    rating: 4.5,
    available: true,
    description: {
      en: "An elegant European sedan with captivating lines and excellent fuel economy, ideal for solo travellers and Red Sea coastal touring.",
      ar: "سيدان أوروبية أنيقة بتصميم جذاب ومعدل استهلاك وقود ممتاز، مثالية للاستخدام الفردي ولرحلات الساحل الشرقي.",
    },
    features: [
      { en: "Digital instrument display", ar: "لوحة عدادات رقمية" },
      { en: "Cruise control & speed limiter", ar: "نظام تثبيت وتحديد السرعة" },
      { en: "Digital automatic climate control", ar: "تكييف هواء رقمي" },
      { en: "Multifunction leather steering wheel", ar: "عجلة قيادة جلدية متعددة الوظائف" },
      { en: "Hill start assist", ar: "مساعد صعود المرتفعات" },
    ],
    reviews: [
      {
        id: "rev-117",
        userName: { en: "Ziad Hamdy", ar: "زياد حمدي" },
        rating: 4,
        date: "2026-08-19",
        comment: {
          en: "Economical, practical car with a very stylish European profile.",
          ar: "سيارة اقتصادية وعملية وشكلها شيك جداً.",
        },
      },
    ],
  },
]

export const MOCK_USER: User = {
  id: "user-demo-1",
  name: {
    en: "Ahmed Mahmoud El-Naggar",
    ar: "أحمد محمود النجار",
  },
  email: "demo@example.com",
  phone: "010 1234 5678",
  nationalId: "29508140102345",
  licenseNumber: "DL-EGY-89420",
}

export const SEED_BOOKINGS: Booking[] = [
  {
    id: "GT-2026-8491",
    carId: "car-1",
    carName: {
      en: "Toyota Corolla 2024",
      ar: "تويوتا كورولا 2024",
    },
    carImage: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1000&auto=format&fit=crop",
    carType: "sedan",
    branchId: "alexandria",
    branchName: {
      en: "Alexandria Branch (Headquarters)",
      ar: "فرع الإسكندرية (المقر الرئيسي)",
    },
    returnBranchId: "cairo",
    returnBranchName: {
      en: "Cairo Branch (Cairo International Airport)",
      ar: "فرع القاهرة (مطار القاهرة الدولي)",
    },
    pickupDate: "2026-10-15",
    returnDate: "2026-10-18",
    totalDays: 3,
    pricePerDay: 1400,
    selectedExtras: [
      {
        id: "insurance",
        name: {
          en: "Comprehensive zero-excess insurance (Gold Shield)",
          ar: "تأمين شامل بدون تحمل (Gold Shield)",
        },
        pricePerDay: 280,
      },
    ],
    extrasTotal: 840,
    subtotal: 5040,
    tax: 705.6,
    totalPrice: 5745.6,
    customerName: {
      en: "Ahmed Mahmoud El-Naggar",
      ar: "أحمد محمود النجار",
    },
    customerEmail: "demo@example.com",
    customerPhone: "010 1234 5678",
    nationalId: "29508140102345",
    paymentMethod: "online",
    status: "confirmed",
    createdAt: "2026-10-08",
    notes: {
      en: "Please prepare the vehicle in the branch lobby at 10:00 AM",
      ar: "يرجى تجهيز السيارة في بهو الفرع الساعة 10:00 صباحاً",
    },
  },
  {
    id: "GT-2026-7914",
    carId: "car-4",
    carName: {
      en: "Kia Sportage 2025",
      ar: "كيا سبورتاج 2025",
    },
    carImage: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1000&auto=format&fit=crop",
    carType: "suv",
    branchId: "cairo",
    branchName: {
      en: "Cairo Branch (Cairo International Airport)",
      ar: "فرع القاهرة (مطار القاهرة الدولي)",
    },
    returnBranchId: "cairo",
    returnBranchName: {
      en: "Cairo Branch (Cairo International Airport)",
      ar: "فرع القاهرة (مطار القاهرة الدولي)",
    },
    pickupDate: "2026-10-22",
    returnDate: "2026-10-25",
    totalDays: 3,
    pricePerDay: 2600,
    selectedExtras: [
      {
        id: "driver",
        name: {
          en: "Professional certified private driver",
          ar: "سائق خاص محترف ومعتمد",
        },
        pricePerDay: 400,
      },
      {
        id: "insurance",
        name: {
          en: "Comprehensive zero-excess insurance (Gold Shield)",
          ar: "تأمين شامل بدون تحمل (Gold Shield)",
        },
        pricePerDay: 280,
      },
    ],
    extrasTotal: 2040,
    subtotal: 9840,
    tax: 1377.6,
    totalPrice: 11217.6,
    customerName: {
      en: "Ahmed Mahmoud El-Naggar",
      ar: "أحمد محمود النجار",
    },
    customerEmail: "demo@example.com",
    customerPhone: "010 1234 5678",
    nationalId: "29508140102345",
    paymentMethod: "cash",
    status: "pending",
    createdAt: "2026-10-07",
    notes: {
      en: "Pickup from Terminal 3 Arrivals hall, Cairo International Airport",
      ar: "استلام من صالة الوصول رقم 3 بمطار القاهرة",
    },
  },
  {
    id: "GT-2026-6205",
    carId: "car-2",
    carName: {
      en: "Hyundai Elantra CN7 2024",
      ar: "هيونداي إلنترا CN7 2024",
    },
    carImage: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1000&auto=format&fit=crop",
    carType: "sedan",
    branchId: "alexandria",
    branchName: {
      en: "Alexandria Branch (Headquarters)",
      ar: "فرع الإسكندرية (المقر الرئيسي)",
    },
    returnBranchId: "alexandria",
    returnBranchName: {
      en: "Alexandria Branch (Headquarters)",
      ar: "فرع الإسكندرية (المقر الرئيسي)",
    },
    pickupDate: "2026-09-20",
    returnDate: "2026-09-23",
    totalDays: 3,
    pricePerDay: 1550,
    selectedExtras: [],
    extrasTotal: 0,
    subtotal: 4650,
    tax: 651,
    totalPrice: 5301,
    customerName: {
      en: "Ahmed Mahmoud El-Naggar",
      ar: "أحمد محمود النجار",
    },
    customerEmail: "demo@example.com",
    customerPhone: "010 1234 5678",
    nationalId: "29508140102345",
    paymentMethod: "online",
    status: "completed",
    createdAt: "2026-09-18",
    userReview: {
      rating: 5,
      comment: {
        en: "A truly wonderful journey! The car was in immaculate condition and on schedule. Thank you Golden Trip team!",
        ar: "رحلة رائعة جداً والسيارة كانت ممتازة ونظيفة في الموعد بالضبط. شكراً فريق جولدن تريب!",
      },
      date: "2026-09-24",
    },
  },
]

// Utilities for price calculations and date calculations
export function calculateDaysBetween(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 1
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  const diffTime = Math.max(0, end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 1
}

/**
 * Migration helper to ensure any cached car objects in localStorage conform to the bilingual schema.
 */
export function migrateLegacyCar(raw: any): Car {
  if (!raw) return MOCK_CARS[0]

  // Category mapping
  const categoryMap: Record<string, VehicleCategory> = {
    "اقتصادية": "economy",
    "economy": "economy",
    "سيدان": "sedan",
    "sedan": "sedan",
    "SUV": "suv",
    "suv": "suv",
    "فاخرة": "luxury",
    "luxury": "luxury",
    "عائلية": "family_van",
    "family_van": "family_van",
  }

  // Transmission mapping
  const transmissionMap: Record<string, TransmissionType> = {
    "أوتوماتيك": "automatic",
    "automatic": "automatic",
    "يدوي": "manual",
    "manual": "manual",
  }

  // Fuel mapping
  const fuelMap: Record<string, FuelType> = {
    "بنزين 92": "petrol",
    "بنزين 95": "petrol",
    "petrol": "petrol",
    "ديزل": "diesel",
    "diesel": "diesel",
    "هجين (هايبرد)": "hybrid",
    "hybrid": "hybrid",
    "كهربائي": "electric",
    "electric": "electric",
  }

  // Match against mock cars for fallback English data if missing
  const matchedSeed = MOCK_CARS.find((c) => c.id === raw.id)

  const name: LocalizedString =
    typeof raw.name === "object" && raw.name?.en && raw.name?.ar
      ? raw.name
      : matchedSeed?.name || { en: raw.name || "Vehicle", ar: raw.name || "مركبة" }

  const description: LocalizedString =
    typeof raw.description === "object" && raw.description?.en && raw.description?.ar
      ? raw.description
      : matchedSeed?.description || { en: raw.description || "", ar: raw.description || "" }

  const type: VehicleCategory = categoryMap[raw.type] || matchedSeed?.type || "sedan"
  const transmission: TransmissionType =
    transmissionMap[raw.transmission] || matchedSeed?.transmission || "automatic"
  const fuel: FuelType = fuelMap[raw.fuel] || matchedSeed?.fuel || "petrol"

  const features: LocalizedString[] = Array.isArray(raw.features)
    ? raw.features.map((f: any, idx: number) => {
        if (typeof f === "object" && f?.en && f?.ar) return f
        return matchedSeed?.features[idx] || { en: String(f), ar: String(f) }
      })
    : matchedSeed?.features || []

  const reviews: Review[] = Array.isArray(raw.reviews)
    ? raw.reviews.map((r: any) => {
        const userName: LocalizedString =
          typeof r.userName === "object" && r.userName?.en && r.userName?.ar
            ? r.userName
            : { en: r.userName || "Customer", ar: r.userName || "عميل" }
        const comment: LocalizedString =
          typeof r.comment === "object" && r.comment?.en && r.comment?.ar
            ? r.comment
            : { en: r.comment || "", ar: r.comment || "" }
        return {
          id: r.id || `rev-${Date.now()}`,
          userName,
          userAvatar: r.userAvatar,
          rating: Number(r.rating) || 5,
          date: r.date || "2026-10-01",
          comment,
          originalLang: r.originalLang || "ar",
        }
      })
    : matchedSeed?.reviews || []

  return {
    id: raw.id,
    name,
    type,
    pricePerDay: Number(raw.pricePerDay) || 1000,
    seats: Number(raw.seats) || 5,
    doors: Number(raw.doors) || 4,
    luggage: Number(raw.luggage) || 2,
    year: Number(raw.year) || 2024,
    transmission,
    fuel,
    branchId: raw.branchId || "alexandria",
    image: raw.image || matchedSeed?.image || "",
    rating: Number(raw.rating) || 4.8,
    available: raw.available !== undefined ? Boolean(raw.available) : true,
    description,
    features,
    reviews,
  }
}

/**
 * Migration helper to ensure any cached booking objects in localStorage conform to the bilingual schema.
 */
export function migrateLegacyBooking(raw: any): Booking {
  const statusMap: Record<string, BookingStatus> = {
    "مؤكد": "confirmed",
    "confirmed": "confirmed",
    "قيد الانتظار": "pending",
    "pending": "pending",
    "مكتمل": "completed",
    "completed": "completed",
    "ملغي": "cancelled",
    "cancelled": "cancelled",
  }

  const matchedCar = MOCK_CARS.find((c) => c.id === raw.carId)
  const pickupBranch = MOCK_BRANCHES.find((b) => b.id === raw.branchId) || MOCK_BRANCHES[0]
  const returnBranch =
    MOCK_BRANCHES.find((b) => b.id === raw.returnBranchId) || pickupBranch

  const carName: LocalizedString =
    typeof raw.carName === "object" && raw.carName?.en && raw.carName?.ar
      ? raw.carName
      : matchedCar?.name || { en: raw.carName || "Vehicle", ar: raw.carName || "مركبة" }

  const branchName: LocalizedString =
    typeof raw.branchName === "object" && raw.branchName?.en && raw.branchName?.ar
      ? raw.branchName
      : pickupBranch.name

  const returnBranchName: LocalizedString =
    typeof raw.returnBranchName === "object" && raw.returnBranchName?.en && raw.returnBranchName?.ar
      ? raw.returnBranchName
      : returnBranch.name

  const customerName: LocalizedString =
    typeof raw.customerName === "object" && raw.customerName?.en && raw.customerName?.ar
      ? raw.customerName
      : { en: raw.customerName || "Customer", ar: raw.customerName || "عميل" }

  const selectedExtras = Array.isArray(raw.selectedExtras)
    ? raw.selectedExtras.map((extra: any) => {
        const matched = MOCK_EXTRAS.find((e) => e.id === extra.id)
        const name: LocalizedString =
          typeof extra.name === "object" && extra.name?.en && extra.name?.ar
            ? extra.name
            : matched?.name || { en: extra.name || "Add-on", ar: extra.name || "إضافة" }
        return {
          id: extra.id,
          name,
          pricePerDay: Number(extra.pricePerDay) || 0,
        }
      })
    : []

  return {
    id: raw.id,
    carId: raw.carId,
    carName,
    carImage: raw.carImage || matchedCar?.image || "",
    carType: matchedCar?.type || "sedan",
    branchId: raw.branchId || "alexandria",
    branchName,
    returnBranchId: raw.returnBranchId || "alexandria",
    returnBranchName,
    pickupDate: raw.pickupDate || "2026-10-15",
    returnDate: raw.returnDate || "2026-10-18",
    totalDays: Number(raw.totalDays) || 3,
    pricePerDay: Number(raw.pricePerDay) || 1000,
    selectedExtras,
    extrasTotal: Number(raw.extrasTotal) || 0,
    subtotal: Number(raw.subtotal) || 3000,
    tax: Number(raw.tax) || 420,
    totalPrice: Number(raw.totalPrice) || 3420,
    customerName,
    customerEmail: raw.customerEmail || "demo@example.com",
    customerPhone: raw.customerPhone || "010 1234 5678",
    nationalId: raw.nationalId || "29508140102345",
    paymentMethod: raw.paymentMethod || "online",
    status: statusMap[raw.status] || "confirmed",
    createdAt: raw.createdAt || "2026-10-08",
    notes: raw.notes,
    userReview: raw.userReview,
  }
}
