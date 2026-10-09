export interface Branch {
  id: string
  name: string
  city: string
  address: string
  phone: string
  operatingHours: string
}

export interface Review {
  id: string
  userName: string
  userAvatar?: string
  rating: number // 1 to 5
  date: string
  comment: string
}

export interface Car {
  id: string
  name: string
  type: "اقتصادية" | "سيدان" | "SUV" | "فاخرة" | "عائلية"
  pricePerDay: number // EGP
  seats: number
  transmission: "أوتوماتيك" | "يدوي"
  fuel: "بنزين 92" | "بنزين 95" | "هجين (هايبرد)" | "ديزل"
  branchId: string
  image: string
  rating: number
  reviews: Review[]
  available: boolean
  features: string[]
  doors: number
  luggage: number // bags count
  year: number
  description: string
}

export interface ExtraOption {
  id: string
  name: string
  description: string
  pricePerDay: number
  icon: string
}

export interface Booking {
  id: string
  carId: string
  carName: string
  carImage: string
  carType: string
  branchId: string
  branchName: string
  returnBranchId: string
  returnBranchName: string
  pickupDate: string
  returnDate: string
  totalDays: number
  pricePerDay: number
  selectedExtras: {
    id: string
    name: string
    pricePerDay: number
  }[]
  extrasTotal: number
  subtotal: number
  tax: number // 14% VAT
  totalPrice: number
  customerName: string
  customerEmail: string
  customerPhone: string
  nationalId: string
  paymentMethod: "online" | "cash"
  status: "مؤكد" | "قيد الانتظار" | "مكتمل" | "ملغي"
  createdAt: string
  notes?: string
  userReview?: {
    rating: number
    comment: string
    date: string
  }
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  nationalId: string
  licenseNumber: string
}

export const MOCK_BRANCHES: Branch[] = [
  {
    id: "alexandria",
    name: "فرع الإسكندرية (المقر الرئيسي)",
    city: "الإسكندرية",
    address: "طريق الجيش، الكورنيش، سيدي جابر، الإسكندرية",
    phone: "010 06803316",
    operatingHours: "متاح 24 ساعة يومياً",
  },
  {
    id: "cairo",
    name: "فرع القاهرة (مطار القاهرة الدولي)",
    city: "القاهرة",
    address: "صالة 3 - مطار القاهرة الدولي، مصر الجديدة",
    phone: "010 06803317",
    operatingHours: "متاح 24 ساعة يومياً",
  },
  {
    id: "giza",
    name: "فرع الجيزة (الشيخ زايد)",
    city: "الجيزة",
    address: "محور 26 يوليو، مدخل زايد 1، الجيزة",
    phone: "010 06803318",
    operatingHours: "8:00 ص - 12:00 م",
  },
  {
    id: "sharm",
    name: "فرع شرم الشيخ الدولي",
    city: "شرم الشيخ",
    address: "خليج نعمة، طريق السلام، شرم الشيخ",
    phone: "010 06803319",
    operatingHours: "متاح 24 ساعة يومياً",
  },
  {
    id: "hurghada",
    name: "فرع الغردقة (الممشى السياحي)",
    city: "الغردقة",
    address: "طريق القرى، الممشى السياحي، الغردقة",
    phone: "010 06803320",
    operatingHours: "8:00 ص - 1:00 ص",
  },
  {
    id: "matruh",
    name: "فرع مرسى مطروح",
    city: "مرسى مطروح",
    address: "شارع الإسكندرية، وسط المدينة، مرسى مطروح",
    phone: "010 06803321",
    operatingHours: "9:00 ص - 11:00 م",
  },
]

export const MOCK_EXTRAS: ExtraOption[] = [
  {
    id: "driver",
    name: "سائق خاص محترف ومُعتمد",
    description: "سائق خبير بطرق السفر السريعة ومتاح طوال مدة الرحلة",
    pricePerDay: 400,
    icon: "UserCheck",
  },
  {
    id: "child-seat",
    name: "مقعد أمان للأطفال",
    description: "مقعد مريح وآمن متوافق مع معايير السلامة الدولية",
    pricePerDay: 120,
    icon: "Shield",
  },
  {
    id: "gps",
    name: "جهاز ملاحة متطور GPS",
    description: "خرائط محدثة لمصر مع تنبيهات الطرق والسرعات",
    pricePerDay: 90,
    icon: "Navigation",
  },
  {
    id: "insurance",
    name: "تأمين شامل بدون تحمل (Gold Shield)",
    description: "تغطية كاملة للحوادث والأضرار بدون أي مبالغ تحمل شخصية",
    pricePerDay: 280,
    icon: "ShieldCheck",
  },
]

export const MOCK_CARS: Car[] = [
  {
    id: "car-1",
    name: "تويوتا كورولا 2024",
    type: "سيدان",
    pricePerDay: 1400,
    seats: 5,
    doors: 4,
    luggage: 3,
    year: 2024,
    transmission: "أوتوماتيك",
    fuel: "بنزين 92",
    branchId: "alexandria",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1000&auto=format&fit=crop",
    rating: 4.8,
    available: true,
    description: "السيارة السيدان الأكثر اعتمادية وراحة على الطرق السريعة في مصر، مزودة بأحدث أنظمة الأمان وكفاءة استهلاك وقود ممتازة.",
    features: ["تكييف هواء رقمي مزدوج", "شاشة لمس 9 بوصة تدعم Apple CarPlay", "حساسات ركن وكاميرا خلفية", "مثبت سرعة ذكي", "نظام صوتي 6 سماعات"],
    reviews: [
      {
        id: "rev-101",
        userName: "محمود عبد العزيز",
        rating: 5,
        date: "2026-09-18",
        comment: "سيارة مريحة جداً ونظيفة كالجديدة تماماً. استلمتها من فرع الإسكندرية وكان التعامل في غاية الاحترافية.",
      },
      {
        id: "rev-102",
        userName: "سارة إبراهيم",
        rating: 5,
        date: "2026-09-02",
        comment: "اقتصادية جداً في البنزين والسفر بها للقاهرة كان ممتعاً وسلساً.",
      },
    ],
  },
  {
    id: "car-2",
    name: "هيونداي إلنترا CN7 2024",
    type: "سيدان",
    pricePerDay: 1550,
    seats: 5,
    doors: 4,
    luggage: 3,
    year: 2024,
    transmission: "أوتوماتيك",
    fuel: "بنزين 92",
    branchId: "cairo",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1000&auto=format&fit=crop",
    rating: 4.9,
    available: true,
    description: "تصميم جريء ومستقبلي مع مقصورة رحبة ومحرك نشط، خيار مثالي لرحلات العمل والمسافات الطويلة بين المحافظات.",
    features: ["شاشة عدادات رقمية 10.25 بوصة", "فتحة سقف كهربائية", "شاحن لاسلكي للهواتف", "إضاءة محيطية متعددة الألوان", "نظام فرامل مانع للانغلاق ABS و ESP"],
    reviews: [
      {
        id: "rev-103",
        userName: "كريم فهمي",
        rating: 5,
        date: "2026-09-25",
        comment: "تجربة ممتازة من مطار القاهرة. السيارة فارهة ومريحة جداً في القيادة الليلية.",
      },
      {
        id: "rev-104",
        userName: "أحمد الشريف",
        rating: 4,
        date: "2026-08-30",
        comment: "سيارة حديثة وممتعة، وأنصح بالتعامل مع جولدن تريب لسرعة الإجراءات.",
      },
    ],
  },
  {
    id: "car-3",
    name: "نيسان صني 2024",
    type: "اقتصادية",
    pricePerDay: 950,
    seats: 5,
    doors: 4,
    luggage: 2,
    year: 2024,
    transmission: "أوتوماتيك",
    fuel: "بنزين 92",
    branchId: "giza",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000&auto=format&fit=crop",
    rating: 4.6,
    available: true,
    description: "الخيار الاقتصادي الأول داخل المدن والرحلات اليومية، عملية وسهلة الاصطفاف ومساحة داخلية جيدة.",
    features: ["تكييف هواء قوي", "بلوتوث ومدخل USB", "وسائد هوائية أمامية", "زجاج كهربائي كامل", "نظام توزيع إلكتروني للفرامل EBD"],
    reviews: [
      {
        id: "rev-105",
        userName: "طارق منصور",
        rating: 5,
        date: "2026-09-12",
        comment: "أفضل سعر مقابل القيمة في السوق. السيارة كانت جاهزة في الموعد تماماً.",
      },
    ],
  },
  {
    id: "car-4",
    name: "كيا سبورتاج 2025",
    type: "SUV",
    pricePerDay: 2600,
    seats: 5,
    doors: 5,
    luggage: 4,
    year: 2025,
    transmission: "أوتوماتيك",
    fuel: "بنزين 95",
    branchId: "alexandria",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1000&auto=format&fit=crop",
    rating: 4.9,
    available: true,
    description: "سيارة دفع رباعي رياضية تجمع بين القوة والراحة والفخامة، صممت لتمنحك ثقة كاملة على الطرق السريعة والتضاريس المختلفة.",
    features: ["شاشة بانورامية منحنية مزدوجة", "سقف بانوراما بالكامل", "مقاعد جلدية مع تدفئة وتبريد", "كاميرات محيطية 360 درجة", "نظام القيادة الذاتية والمساعدة في الحارة"],
    reviews: [
      {
        id: "rev-106",
        userName: "عمر خالد",
        rating: 5,
        date: "2026-10-02",
        comment: "أخذتها في رحلة من الإسكندرية إلى الساحل الشمالي. ثبات خيالي وراحة لا توصف.",
      },
      {
        id: "rev-107",
        userName: "منى زكي",
        rating: 5,
        date: "2026-09-15",
        comment: "سيارة رائعة للعائلات، شنطة الأمتعة واسعة جداً والخدمة في الفرع راقية.",
      },
    ],
  },
  {
    id: "car-5",
    name: "BMW X5 xDrive 2024",
    type: "فاخرة",
    pricePerDay: 6800,
    seats: 5,
    doors: 5,
    luggage: 5,
    year: 2024,
    transmission: "أوتوماتيك",
    fuel: "بنزين 95",
    branchId: "cairo",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000&auto=format&fit=crop",
    rating: 5.0,
    available: true,
    description: "قمة الفخامة الألمانية والأداء الفائق. مزودة بنظام دفع رباعي ذكي ومقصورة مكسوة بأفخر أنواع الجلد الطبيعي والتكنولوجيا الرائدة.",
    features: ["نظام صوت Harman Kardon المحيطي", "نظام تعليق هوائي متكيف", "أبواب شفط إلكترونية", "عرض المعلومات على الزجاج الأمامي HUD", "حزمة M Sport الرياضية"],
    reviews: [
      {
        id: "rev-108",
        userName: "د. هاني رضوان",
        rating: 5,
        date: "2026-09-28",
        comment: "فخامة استثنائية وأداء مبهر. السيارة كانت برائحة الوكالة وبحالة ممتازة.",
      },
    ],
  },
  {
    id: "car-6",
    name: "مرسيدس بنز C200 AMG 2024",
    type: "فاخرة",
    pricePerDay: 5400,
    seats: 5,
    doors: 4,
    luggage: 3,
    year: 2024,
    transmission: "أوتوماتيك",
    fuel: "بنزين 95",
    branchId: "giza",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000&auto=format&fit=crop",
    rating: 4.9,
    available: true,
    description: "أيقونة الفخامة والجاذبية من مرسيدس بنز، بتفاصيل AMG الرياضية وإضاءة محيطية ساحرة تخطف الأنظار في كل رحلة.",
    features: ["شاشة ترفيه مركزية MBUX رأسية", "نظام Burmester الصوتي 3D", "نظام ركن آلي Parktronic", "إضاءة رقمية Digital Light متطورة", "مقاعد رياضية كهربائية بذاكرة"],
    reviews: [
      {
        id: "rev-109",
        userName: "ياسين المنشاوي",
        rating: 5,
        date: "2026-10-04",
        comment: "السيارة قمة في الأناقة ومثالية لاجتماعات العمل والمناسبات الراقية.",
      },
    ],
  },
  {
    id: "car-7",
    name: "تويوتا هايس VIP (فان عائلية)",
    type: "عائلية",
    pricePerDay: 3200,
    seats: 12,
    doors: 4,
    luggage: 8,
    year: 2024,
    transmission: "أوتوماتيك",
    fuel: "ديزل",
    branchId: "sharm",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=1000&auto=format&fit=crop",
    rating: 4.8,
    available: true,
    description: "الخيار الأمثل للرحلات العائلية والمجموعات الكبيرة، مقاعد وثيرة مريحة ومكيف هواء مركزي قوي يغطي جميع الركاب.",
    features: ["مقاعد قبطانية جلدية VIP", "تكييف خلفي مركزي مستقل", "شاشات عرض للركاب", "ثلاجة مشروبات مدمجة", "مساحة أمتعة ضخمة للحقائب"],
    reviews: [
      {
        id: "rev-110",
        userName: "أسرة المهندس هشام",
        rating: 5,
        date: "2026-08-20",
        comment: "قضينا أسبوعاً في شرم الشيخ وكانت الحافلة غاية في الراحة لكل أفراد العائلة.",
      },
    ],
  },
  {
    id: "car-8",
    name: "هيونداي توسان NX4 2024",
    type: "SUV",
    pricePerDay: 2400,
    seats: 5,
    doors: 5,
    luggage: 4,
    year: 2024,
    transmission: "أوتوماتيك",
    fuel: "بنزين 92",
    branchId: "hurghada",
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1000&auto=format&fit=crop",
    rating: 4.8,
    available: true,
    description: "كروس أوفر عصرية تجمع بين الرحابة والتقنية الذكية، مجهزة بالكامل للرحلات الساحلية ورحلات الطرق السريعة.",
    features: ["شاشة لمسية 10.25 بوصة", "نظام تكييف ثلاثي المناطق", "وسائد هوائية ستائرية كاملة", "أوضاع قيادة متعددة (Eco, Sport, Normal)", "شنطة أمتعة كهربائية ذكية"],
    reviews: [
      {
        id: "rev-111",
        userName: "مصطفى جاد",
        rating: 4,
        date: "2026-09-10",
        comment: "سيارة مريحة وعملية جداً استأجرتها في الغردقة، الاستلام والتسليم استغرق أقل من 5 دقائق.",
      },
    ],
  },
  {
    id: "car-9",
    name: "كيا سيراتو جراند 2024",
    type: "سيدان",
    pricePerDay: 1350,
    seats: 5,
    doors: 4,
    luggage: 3,
    year: 2024,
    transmission: "أوتوماتيك",
    fuel: "بنزين 92",
    branchId: "matruh",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=1000&auto=format&fit=crop",
    rating: 4.7,
    available: true,
    description: "سيدان أنيقة ومدمجة تجمع بين الموثوقية العالية والراحة أثناء القيادة اليومية والسفر على السواحل المصرية.",
    features: ["جنوط رياضية 17 بوصة", "فتحة سقف كهربائية", "تحكم كامل من عجلة القيادة", "نظام تشغيل بدون مفتاح (بصمة)", "نظام مانع السرقة إيموبليزر"],
    reviews: [
      {
        id: "rev-112",
        userName: "أشرف كمال",
        rating: 5,
        date: "2026-08-14",
        comment: "سافرت بها من مطروح للإسكندرية، الثبات ممتاز والتكييف ثلاجة في عز الحر.",
      },
    ],
  },
  {
    id: "car-10",
    name: "شيفروليه أوبترا 2023",
    type: "اقتصادية",
    pricePerDay: 850,
    seats: 5,
    doors: 4,
    luggage: 2,
    year: 2023,
    transmission: "يدوي",
    fuel: "بنزين 92",
    branchId: "alexandria",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000&auto=format&fit=crop",
    rating: 4.4,
    available: false, // Currently booked / unavailable for demo testing
    description: "سيارة اقتصادية وعملية جداً لناقل الحركة اليدوي مع مصاريف تشغيل منخفضة، مثالية للمشاوير السريعة في شوارع المدينة.",
    features: ["تكييف هواء يدوي", "راديو وبلوتوث", "فرامل ABS", "إغلاق مركزي للأبواب", "صندوق أمتعة عملي"],
    reviews: [
      {
        id: "rev-113",
        userName: "حسام حسن",
        rating: 4,
        date: "2026-07-22",
        comment: "سيارة جيدة وموفرة جداً في السعر للمشاوير العادية.",
      },
    ],
  },
  {
    id: "car-11",
    name: "مرسيدس بنز S500 Maybach 2024",
    type: "فاخرة",
    pricePerDay: 12500,
    seats: 4,
    doors: 4,
    luggage: 4,
    year: 2024,
    transmission: "أوتوماتيك",
    fuel: "بنزين 95",
    branchId: "cairo",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1000&auto=format&fit=crop",
    rating: 5.0,
    available: true,
    description: "تاج الفخامة المطلقة لرجال الأعمال وكبار الشخصيات. مقصورة فندقية من الدرجة الأولى مع مقاعد تدليك ومساحة رحبة لا تضاهى.",
    features: ["مقاعد خلفية Executive مع تدليك وتدفئة وتبريد", "شاشات ترفيه خلفية منفصلة MBUX", "نظام صوتي ثلاثي الأبعاد Burmester High-End", "نظام عزل صوتي متطور مع زجاج مزدوج", "طاولات عمل قابلة للطي ومبرد مشروبات"],
    reviews: [
      {
        id: "rev-114",
        userName: "سعادة السفير / ناصر العتيبي",
        rating: 5,
        date: "2026-09-30",
        comment: "خدمة في غاية الرقي والالتزام. السيارة بحالة الوكالة والسائق كان على أعلى درجات المهنية.",
      },
    ],
  },
  {
    id: "car-12",
    name: "تويوتا فورتشنر 4x4 2024",
    type: "SUV",
    pricePerDay: 3100,
    seats: 7,
    doors: 5,
    luggage: 5,
    year: 2024,
    transmission: "أوتوماتيك",
    fuel: "بنزين 92",
    branchId: "sharm",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop",
    rating: 4.7,
    available: true,
    description: "وحش الطرق الوعرة والرحلات الصحراوية والسفاري. دفع رباعي حقيقي مع 7 مقاعد تتسع لجميع أفراد العائلة والأمتعة.",
    features: ["نظام دفع رباعي مع دبل ثقيل وخفيف", "7 مقاعد مريحة مع طي الصف الثالث", "حساسات أمامية وخلفية", "مثبت سرعة وتحكم بالانحدار", "نظام فرامل طوارئ متطور"],
    reviews: [
      {
        id: "rev-115",
        userName: "وليد صبري",
        rating: 5,
        date: "2026-09-05",
        comment: "قوة جبارة في الجبال وطرق شرم الشيخ، سيارة قوية ومريحة جداً.",
      },
    ],
  },
  {
    id: "car-13",
    name: "هيونداي H-1 ستاريا VIP 2024",
    type: "عائلية",
    pricePerDay: 3500,
    seats: 9,
    doors: 5,
    luggage: 6,
    year: 2024,
    transmission: "أوتوماتيك",
    fuel: "ديزل",
    branchId: "cairo",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1000&auto=format&fit=crop",
    rating: 4.9,
    available: true,
    description: "الفان المستقبلية الأكثر تطوراً في مصر. تصميم فضائي مع زجاج بانورامي عريض ومقاعد استرخاء فاخرة لرحلات السفر الطويلة.",
    features: ["مقاعد استرخاء كهربائية مع وضعية انعدام الجاذبية", "أبواب جانبية كهربائية ذكية", "شاشة ملاحة 10.25 بوصة", "تكييف هواء مستقل لجميع الصفوف", "مداخل شحن USB لكل راكب"],
    reviews: [
      {
        id: "rev-116",
        userName: "م. إسلام نجاتي",
        rating: 5,
        date: "2026-10-01",
        comment: "سيارة مذهلة جداً ومريحة لأقصى درجة، استمتعنا بالرحلة من القاهرة للغردقة دون أي تعب.",
      },
    ],
  },
  {
    id: "car-14",
    name: "رينو ميجان 2024",
    type: "اقتصادية",
    pricePerDay: 1100,
    seats: 5,
    doors: 4,
    luggage: 3,
    year: 2024,
    transmission: "يدوي",
    fuel: "بنزين 92",
    branchId: "hurghada",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1000&auto=format&fit=crop",
    rating: 4.5,
    available: true,
    description: "سيدان أوروبية أنيقة بتصميم جذاب ومعدل استهلاك وقود ممتاز، مثالية للاستخدام الفردي ولرحلات الساحل الشرقي.",
    features: ["لوحة عدادات رقمية", "نظام تثبيت وتحديد السرعة", "تكييف هواء رقمي", "عجلة قيادة جلدية متعددة الوظائف", "مساعد صعود المرتفعات"],
    reviews: [
      {
        id: "rev-117",
        userName: "زياد حمدي",
        rating: 4,
        date: "2026-08-19",
        comment: "سيارة اقتصادية وعملية وشكلها شيك جداً.",
      },
    ],
  },
]

export const MOCK_USER: User = {
  id: "user-demo-1",
  name: "أحمد محمود النجار",
  email: "demo@example.com",
  phone: "010 1234 5678",
  nationalId: "29508140102345",
  licenseNumber: "DL-EGY-89420",
}

export const SEED_BOOKINGS: Booking[] = [
  {
    id: "GT-2026-8491",
    carId: "car-1",
    carName: "تويوتا كورولا 2024",
    carImage: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1000&auto=format&fit=crop",
    carType: "سيدان",
    branchId: "alexandria",
    branchName: "فرع الإسكندرية (المقر الرئيسي)",
    returnBranchId: "cairo",
    returnBranchName: "فرع القاهرة (مطار القاهرة الدولي)",
    pickupDate: "2026-10-15",
    returnDate: "2026-10-18",
    totalDays: 3,
    pricePerDay: 1400,
    selectedExtras: [
      { id: "insurance", name: "تأمين شامل بدون تحمل (Gold Shield)", pricePerDay: 280 },
    ],
    extrasTotal: 840,
    subtotal: 5040,
    tax: 705.6,
    totalPrice: 5745.6,
    customerName: "أحمد محمود النجار",
    customerEmail: "demo@example.com",
    customerPhone: "010 1234 5678",
    nationalId: "29508140102345",
    paymentMethod: "online",
    status: "مؤكد",
    createdAt: "2026-10-08",
    notes: "يرجى تجهيز السيارة في بهو الفرع الساعة 10:00 صباحاً",
  },
  {
    id: "GT-2026-7914",
    carId: "car-4",
    carName: "كيا سبورتاج 2025",
    carImage: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1000&auto=format&fit=crop",
    carType: "SUV",
    branchId: "cairo",
    branchName: "فرع القاهرة (مطار القاهرة الدولي)",
    returnBranchId: "cairo",
    returnBranchName: "فرع القاهرة (مطار القاهرة الدولي)",
    pickupDate: "2026-10-22",
    returnDate: "2026-10-25",
    totalDays: 3,
    pricePerDay: 2600,
    selectedExtras: [
      { id: "driver", name: "سائق خاص محترف ومُعتمد", pricePerDay: 400 },
      { id: "insurance", name: "تأمين شامل بدون تحمل (Gold Shield)", pricePerDay: 280 },
    ],
    extrasTotal: 2040,
    subtotal: 9840,
    tax: 1377.6,
    totalPrice: 11217.6,
    customerName: "أحمد محمود النجار",
    customerEmail: "demo@example.com",
    customerPhone: "010 1234 5678",
    nationalId: "29508140102345",
    paymentMethod: "cash",
    status: "قيد الانتظار",
    createdAt: "2026-10-07",
    notes: "استلام من صالة الوصول رقم 3 بمطار القاهرة",
  },
  {
    id: "GT-2026-6205",
    carId: "car-2",
    carName: "هيونداي إلنترا CN7 2024",
    carImage: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1000&auto=format&fit=crop",
    carType: "سيدان",
    branchId: "alexandria",
    branchName: "فرع الإسكندرية (المقر الرئيسي)",
    returnBranchId: "alexandria",
    returnBranchName: "فرع الإسكندرية (المقر الرئيسي)",
    pickupDate: "2026-09-20",
    returnDate: "2026-09-23",
    totalDays: 3,
    pricePerDay: 1550,
    selectedExtras: [],
    extrasTotal: 0,
    subtotal: 4650,
    tax: 651,
    totalPrice: 5301,
    customerName: "أحمد محمود النجار",
    customerEmail: "demo@example.com",
    customerPhone: "010 1234 5678",
    nationalId: "29508140102345",
    paymentMethod: "online",
    status: "مكتمل",
    createdAt: "2026-09-18",
    userReview: {
      rating: 5,
      comment: "رحلة رائعة جداً والسيارة كانت ممتازة ونظيفة في الموعد بالضبط. شكراً فريق جولدن تريب!",
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

export function formatEGP(amount: number): string {
  return new Intl.NumberFormat("ar-EG", {
    maximumFractionDigits: 0,
  }).format(amount) + " ج.م"
}
