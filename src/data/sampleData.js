/**
 * Sample initial data for AiMindset Shop (Myanmar Telegram Shop Platform)
 * Used as default data and fallback when Supabase credentials are not present.
 */

export const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "Royal Myanmar Milk Tea (30 Sachets)",
    nameMm: "ရွိုင်ရယ် မြန်မာ လက်ဖက်ရည်ထုပ် (၃၀ ထုပ်)",
    priceKs: 9500,
    stock: 28,
    category: "Snacks & Drinks",
    categoryMm: "မုန့်နှင့် အဖျော်ယမကာ",
    imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80",
    description: "Authentic Myanmar sweet and creamy tea mix loved by locals and tea lovers.",
    active: true,
  },
  {
    id: "prod-2",
    name: "Shwe Pyi Nann Natural Bark Thanaka",
    nameMm: "ရွှေပြည်နန်း သဘာဝ သနပ်ခါးတုံး",
    priceKs: 6500,
    stock: 14,
    category: "Beauty & Wellness",
    categoryMm: "အလှကုန်နှင့် ကျန်းမာရေး",
    imageUrl: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80",
    description: "Pure natural herbal cooling skincare bark for sun protection and smooth glow.",
    active: true,
  },
  {
    id: "prod-3",
    name: "Handwoven Acheik Silk Longyi (Men/Women)",
    nameMm: "ရိုးရာ လက်ရက် အချိတ် ပုဆိုး/လုံချည်",
    priceKs: 42000,
    stock: 6, // Low stock (< 10) for alert demonstration!
    category: "Traditional Fashion",
    categoryMm: "ရိုးရာဖက်ရှင်",
    imageUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
    description: "Intricately woven traditional wave pattern cotton silk longyi for celebrations.",
    active: true,
  },
  {
    id: "prod-4",
    name: "Crispy Spicy Fried Laphet (Tea Leaf Salad Kit)",
    nameMm: "ရှမ်းရိုးရာ ကြွပ်ကြွပ်ရွ အကြော်စုံ လက်ဖက်သုပ်စုံ",
    priceKs: 5500,
    stock: 35,
    category: "Snacks & Drinks",
    categoryMm: "မုန့်နှင့် အဖျော်ယမကာ",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    description: "Shan organic pickled tea leaves paired with crispy fried beans, garlic, and sesame.",
    active: true,
  },
  {
    id: "prod-5",
    name: "Bagan Lacquerware Trinket Box (Handmade)",
    nameMm: "ပုဂံ လက်လုပ် ယွန်းထည် လက်ဝတ်ရတနာထည့်ဘူး",
    priceKs: 28000,
    stock: 8, // Low stock (< 10)
    category: "Art & Crafts",
    categoryMm: "ရိုးရာလက်မှုပညာ",
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
    description: "Master artisan lacquer finish with gold leaf etching straight from Bagan workshops.",
    active: true,
  },
  {
    id: "prod-6",
    name: "Ywangan Specialty Arabica Coffee Beans (250g)",
    nameMm: "ရွာငံ အထူး အာရေးဗီးကား ကော်ဖီစေ့ (၂၅၀ ဂရမ်)",
    priceKs: 16000,
    stock: 19,
    category: "Snacks & Drinks",
    categoryMm: "မုန့်နှင့် အဖျော်ယမကာ",
    imageUrl: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=600&q=80",
    description: "Award-winning Danu mountain highland washed Arabica beans with citrus floral notes.",
    active: true,
  },
  {
    id: "prod-7",
    name: "Inle Lotus Fibre Hand-Crafted Scarf",
    nameMm: "အင်းလေး ကြာချည် လက်ရက် ပဝါနု",
    priceKs: 65000,
    stock: 5, // Low stock (< 10)
    category: "Traditional Fashion",
    categoryMm: "ရိုးရာဖက်ရှင်",
    imageUrl: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=600&q=80",
    description: "Ultra-rare breathable lotus stem silk weaving from Inle Lake master artisans.",
    active: true,
  },
  {
    id: "prod-8",
    name: "Pyin Oo Lwin Organic Strawberry Jam (380g)",
    nameMm: "ပြင်ဦးလွင် သဘာဝ စတော်ဘယ်ရီယိုစစ်စစ် (၃၈၀ ဂရမ်)",
    priceKs: 7800,
    stock: 22,
    category: "Snacks & Drinks",
    categoryMm: "မုန့်နှင့် အဖျော်ယမကာ",
    imageUrl: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80",
    description: "Sweet chunk fresh mountain strawberries slow cooked with minimal organic cane sugar.",
    active: true,
  },
];

export const INITIAL_ORDERS = [
  {
    id: "AMS-1001",
    customerName: "Daw Khin Myat Noe",
    phone: "09420018899",
    address: "Room 402, 34th Street, Kyauktada Tsp, Yangon",
    items: [
      { productId: "prod-1", name: "Royal Myanmar Milk Tea (30 Sachets)", quantity: 2, priceKs: 9500 },
      { productId: "prod-4", name: "Crispy Spicy Fried Laphet", quantity: 1, priceKs: 5500 }
    ],
    deliveryFeeKs: 2500,
    totalKs: 27000,
    status: "Delivered",
    paymentMethod: "Cash on Delivery",
    createdAt: "2026-11-01T10:15:00Z"
  },
  {
    id: "AMS-1002",
    customerName: "Ko Aung Thu",
    phone: "09798541233",
    address: "No. 12B, 73rd Street, Chanayethazan Tsp, Mandalay",
    items: [
      { productId: "prod-3", name: "Handwoven Acheik Silk Longyi", quantity: 1, priceKs: 42000 }
    ],
    deliveryFeeKs: 3000,
    totalKs: 45000,
    status: "Confirmed",
    paymentMethod: "Cash on Delivery",
    createdAt: "2026-11-02T14:40:00Z"
  },
  {
    id: "AMS-1003",
    customerName: "Ma Htet Htet Zaw",
    phone: "09965123456",
    address: "Condo 7A, Inya Road, Kamayut Tsp, Yangon",
    items: [
      { productId: "prod-2", name: "Shwe Pyi Nann Natural Bark Thanaka", quantity: 2, priceKs: 6500 },
      { productId: "prod-6", name: "Ywangan Specialty Arabica Coffee", quantity: 1, priceKs: 16000 }
    ],
    deliveryFeeKs: 2500,
    totalKs: 31500,
    status: "Pending",
    paymentMethod: "Cash on Delivery",
    createdAt: "2026-11-03T09:20:00Z"
  },
  {
    id: "AMS-1004",
    customerName: "U Min Min Latt",
    phone: "09250089765",
    address: "Building 9, Cherry Garden, Zabuthiri Tsp, Naypyidaw",
    items: [
      { productId: "prod-5", name: "Bagan Lacquerware Trinket Box", quantity: 1, priceKs: 28000 }
    ],
    deliveryFeeKs: 3500,
    totalKs: 31500,
    status: "Pending",
    paymentMethod: "Cash on Delivery",
    createdAt: "2026-11-03T18:05:00Z"
  }
];

export const INITIAL_FAQS = [
  {
    id: "faq-1",
    question: "How do customers order through Telegram?",
    questionMm: "ဝယ်ယူသူတွေ တယ်လီဂရမ်ကနေ ဘယ်လို အော်ဒါတင်ရမလဲ?",
    answer: "Buyers open your Telegram Shop bot (@AiMindsetBot) and click 'Open Shop' to browse products in the interactive Telegram Web App. Once they pick items and enter their delivery details, the order syncs instantly to your merchant dashboard!",
    answerMm: "ဝယ်ယူသူများသည် သင့်ဆိုင်၏ Telegram Bot (@AiMindsetBot) သို့သွားပြီး 'Open Shop' ခလုတ်ကို နှိပ်ကာ Telegram Web App အတွင်း စျေးဝယ်နိုင်ပါသည်။ အော်ဒါတင်လိုက်သည်နှင့် Merchant Dashboard ထဲသို့ ချက်ချင်း ရောက်ရှိလာပါမည်။"
  },
  {
    id: "faq-2",
    question: "What payment methods are supported?",
    questionMm: "ငွေပေးချေမှုပုံစံ ဘယ်လိုတွေ လက်ခံပေးလဲ?",
    answer: "Cash on Delivery (COD) is enabled by default for all cities in Myanmar. Mobile wallets like KBZPay, WavePay, and AYA Pay can be integrated seamlessly via Telegram bot notifications.",
    answerMm: "မြန်မာနိုင်ငံရှိ မြို့နယ်အားလုံးအတွက် အိမ်ရောက်ငွေချေစနစ် (COD) ကို အခြေခံထားပြီး KBZPay, WavePay, AYA Pay တို့ဖြင့်လည်း အလွယ်တကူ လက်ခံဆောင်ရွက်နိုင်ပါသည်။"
  },
  {
    id: "faq-3",
    question: "How fast is delivery inside Yangon and other cities?",
    questionMm: "ရန်ကုန်နှင့် နယ်မြို့များသို့ ပို့ဆောင်ခနှင့် ကြာချိန် ဘယ်လောက်ရှိလဲ?",
    answer: "Inside Yangon, delivery typically takes 24-48 hours (delivery fee 2,000 - 3,000 Ks). For other cities including Mandalay and Naypyidaw, express door-to-door delivery takes 2-4 business days.",
    answerMm: "ရန်ကုန်မြို့တွင်း ၂၄-၄၈ နာရီအတွင်း ရောက်ရှိပြီး (ပို့ခ ၂,၀၀၀ မှ ၃,၀၀၀ ကျပ်)၊ မန္တလေး၊ နေပြည်တော်နှင့် အခြားမြို့များသို့ ၂-၄ ရက်အတွင်း အိမ်အရောက် ပို့ဆောင်ပေးပါသည်။"
  },
  {
    id: "faq-4",
    question: "Can I manage inventory from a mobile phone?",
    questionMm: "ဖုန်းတစ်လုံးတည်းနဲ့ ကုန်ပစ္စည်းစာရင်း စီမံခန့်ခွဲနိုင်ပါသလား?",
    answer: "Yes! The AiMindset Shop Merchant Dashboard is 100% mobile-friendly. You can add new products, update prices, adjust stock levels, and review orders right from your smartphone.",
    answerMm: "ရနိုင်ပါတယ်! AiMindset Shop ဆိုင်ရှင်ဒက်ရှ်ဘုတ်ကို မိုဘိုင်းဖုန်းဖြင့် အလွယ်တကူ သုံးစွဲနိုင်အောင် ပြုလုပ်ထားပြီး ပစ္စည်းအသစ်ထည့်ခြင်း၊ ဈေးနှုန်းနှင့် ပစ္စည်းလက်ကျန် ပြင်ဆင်ခြင်းများကို ဖုန်းဖြင့် လုပ်ဆောင်နိုင်ပါသည်။"
  }
];

export const CATEGORIES = [
  { id: "all", name: "All Products", nameMm: "အားလုံး" },
  { id: "Snacks & Drinks", name: "Snacks & Drinks", nameMm: "မုန့်နှင့် အဖျော်ယမကာ" },
  { id: "Beauty & Wellness", name: "Beauty & Wellness", nameMm: "အလှကုန်နှင့် ကျန်းမာရေး" },
  { id: "Traditional Fashion", name: "Traditional Fashion", nameMm: "ရိုးရာဖက်ရှင်" },
  { id: "Art & Crafts", name: "Art & Crafts", nameMm: "ရိုးရာလက်မှုပညာ" }
];
