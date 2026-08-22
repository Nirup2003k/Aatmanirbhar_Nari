// Mock data for Aatmanirbhar Nari Frontend

export const categories = [
  {
    id: 1,
    name: "Tiffin Services",
    description: "Homemade, healthy, and hygienic daily meals delivered to you.",
    icon: "ChefHat",
  },
  {
    id: 2,
    name: "Tailoring & Boutique",
    description: "Custom stitching, alterations, and beautiful ethnic wear.",
    icon: "Scissors",
  },
  {
    id: 3,
    name: "Beauty Services",
    description: "Professional salon services from the comfort of your home.",
    icon: "Sparkles",
  },
  {
    id: 4,
    name: "Handicrafts & Decor",
    description: "Unique handmade decor, gifts, and traditional art pieces.",
    icon: "Palette",
  },
];

const defaultWeeklyHours = [
  { day: "Monday", isAvailable: true, startTime: "09:00 AM", endTime: "07:00 PM" },
  { day: "Tuesday", isAvailable: true, startTime: "09:00 AM", endTime: "07:00 PM" },
  { day: "Wednesday", isAvailable: true, startTime: "09:00 AM", endTime: "07:00 PM" },
  { day: "Thursday", isAvailable: true, startTime: "09:00 AM", endTime: "07:00 PM" },
  { day: "Friday", isAvailable: true, startTime: "09:00 AM", endTime: "07:00 PM" },
  { day: "Saturday", isAvailable: true, startTime: "09:00 AM", endTime: "06:00 PM" },
  { day: "Sunday", isAvailable: false, startTime: "-", endTime: "-" },
];

export const businesses = [
  {
    id: 101,
    name: "Annapurna Home Kitchen",
    categoryId: 1,
    location: "Vidya Nagar, Hubli",
    description: "Authentic South Indian home-cooked meals. Specializing in healthy vegetarian daily tiffins.",
    pricingRange: "₹80 - ₹120 per meal",
    availability: "Available today",
    isAvailable: true,
    createdAt: "2026-01-15T10:00:00Z",
    entrepreneur: {
      name: "Annapurna Patil",
      experienceLevel: "6+ years culinary experience",
      bio: "Annapurna started her home kitchen to provide warm, hygienic, home-style South Indian meals to working professionals and students in Hubli.",
    },
    serviceArea: "Serving Vidya Nagar, Shirur Park, and BVB Campus area in Hubli within a 4 km radius.",
    weeklyHours: [
      { day: "Monday", isAvailable: true, startTime: "08:00 AM", endTime: "08:30 PM" },
      { day: "Tuesday", isAvailable: true, startTime: "08:00 AM", endTime: "08:30 PM" },
      { day: "Wednesday", isAvailable: true, startTime: "08:00 AM", endTime: "08:30 PM" },
      { day: "Thursday", isAvailable: true, startTime: "08:00 AM", endTime: "08:30 PM" },
      { day: "Friday", isAvailable: true, startTime: "08:00 AM", endTime: "08:30 PM" },
      { day: "Saturday", isAvailable: true, startTime: "08:00 AM", endTime: "08:30 PM" },
      { day: "Sunday", isAvailable: true, startTime: "09:00 AM", endTime: "02:00 PM" },
    ],
    services: [
      {
        id: "s101-1",
        name: "South Indian Daily Lunch Tiffin",
        description: "Fresh steamed rice, sambar, rasam, 2 wheat chapatis, vegetable curry, and fresh buttermilk.",
        price: "₹90 per meal",
        availability: "Monday – Saturday",
      },
      {
        id: "s101-2",
        name: "Special Healthy Diet Tiffin",
        description: "Low-oil millets meal with sprouted salads, dal, and multigrain rotis.",
        price: "₹120 per meal",
        availability: "Monday – Friday",
      },
      {
        id: "s101-3",
        name: "Evening Chapati & Curry Combo",
        description: "4 soft handmade chapatis with rich vegetable kurma or dal fry.",
        price: "₹80 per pack",
        availability: "Daily 6:30 PM – 8:30 PM",
      },
    ],
  },
  {
    id: 102,
    name: "Sahana Tailoring Studio",
    categoryId: 2,
    location: "Gokul Road, Hubli",
    description: "Expert alterations and custom blouse stitching with traditional and modern designs.",
    pricingRange: "Starts from ₹300",
    availability: "By appointment",
    isAvailable: true,
    createdAt: "2026-02-01T10:00:00Z",
    entrepreneur: {
      name: "Sahana Kulkarni",
      experienceLevel: "8+ years in apparel design",
      bio: "Sahana specializes in precision stitching, boutique blouse designs, and festive ethnic wear tailoring for women.",
    },
    serviceArea: "Serving Gokul Road, Industrial Estate, and Akshay Park areas in Hubli.",
    weeklyHours: defaultWeeklyHours,
    services: [
      {
        id: "s102-1",
        name: "Designer Blouse Stitching",
        description: "Custom neck patterns, piping, linings, and padded blouse tailoring.",
        price: "₹450 - ₹800",
        availability: "3-5 days delivery",
      },
      {
        id: "s102-2",
        name: "Salwar Suit & Kurti Stitching",
        description: "Complete salwar suit stitching with customized neck designs and pant fittings.",
        price: "₹350 - ₹600",
        availability: "3-4 days delivery",
      },
      {
        id: "s102-3",
        name: "Express Garment Alterations",
        description: "Fitting adjustments for dresses, blouses, jeans, and saree picco work.",
        price: "₹100 - ₹250",
        availability: "Same-day service available",
      },
    ],
  },
  {
    id: 103,
    name: "Sneha Home Beauty Services",
    categoryId: 3,
    location: "Keshwapur, Hubli",
    description: "Bridal makeup, threading, and relaxing facials. Using premium organic products.",
    pricingRange: "Services from ₹150",
    availability: "By appointment",
    isAvailable: true,
    createdAt: "2026-02-10T10:00:00Z",
    entrepreneur: {
      name: "Sneha Joshi",
      experienceLevel: "5+ years certified beautician",
      bio: "Sneha brings salon-quality grooming, herbal facials, and doorstep bridal styling directly to women in their homes.",
    },
    serviceArea: "Serving Keshwapur, Ramesh Bhavan area, and English Medium School locality in Hubli.",
    weeklyHours: [
      { day: "Monday", isAvailable: true, startTime: "10:00 AM", endTime: "06:30 PM" },
      { day: "Tuesday", isAvailable: true, startTime: "10:00 AM", endTime: "06:30 PM" },
      { day: "Wednesday", isAvailable: true, startTime: "10:00 AM", endTime: "06:30 PM" },
      { day: "Thursday", isAvailable: true, startTime: "10:00 AM", endTime: "06:30 PM" },
      { day: "Friday", isAvailable: true, startTime: "10:00 AM", endTime: "06:30 PM" },
      { day: "Saturday", isAvailable: true, startTime: "09:30 AM", endTime: "07:00 PM" },
      { day: "Sunday", isAvailable: true, startTime: "09:30 AM", endTime: "02:00 PM" },
    ],
    services: [
      {
        id: "s103-1",
        name: "Herbal Glow Facial",
        description: "Deep cleansing facial using organic aloe vera and papaya extracts with head massage.",
        price: "₹500",
        availability: "By appointment",
      },
      {
        id: "s103-2",
        name: "Doorstep Threading & Waxing Package",
        description: "Eyebrow threading, upper lip, and full-arms honey wax treatment.",
        price: "₹350",
        availability: "By appointment",
      },
      {
        id: "s103-3",
        name: "Bridal Makeup & Hair Styling",
        description: "HD bridal makeup, saree draping, and customized hair styling for weddings.",
        price: "Starts from ₹3,500",
        availability: "Advance booking required",
      },
    ],
  },
  {
    id: 104,
    name: "KalaKriti Handicrafts",
    categoryId: 4,
    location: "Dharwad",
    description: "Beautiful handcrafted terracotta jewelry and hand-painted home decor items.",
    pricingRange: "₹200 - ₹1500",
    availability: "Available this week",
    isAvailable: true,
    createdAt: "2026-01-05T10:00:00Z",
    entrepreneur: {
      name: "Kavita Deshpande",
      experienceLevel: "7+ years artisan crafts",
      bio: "Kavita crafts handmade eco-friendly terracotta bangles, neckpieces, and hand-painted decorative wall plates celebrating Indian heritage.",
    },
    serviceArea: "Serving Dharwad city and shipping products across Hubli-Dharwad twin cities.",
    weeklyHours: defaultWeeklyHours,
    services: [
      {
        id: "s104-1",
        name: "Handcrafted Terracotta Jewelry Set",
        description: "Eco-friendly clay necklace with matching earrings in vibrant hand-painted colors.",
        price: "₹450",
        availability: "In stock / Custom orders",
      },
      {
        id: "s104-2",
        name: "Hand-Painted Wall Art Plates",
        description: "Traditional motif ceramic and terracotta decorative plates for living room walls.",
        price: "₹750 per pair",
        availability: "In stock",
      },
      {
        id: "s104-3",
        name: "Custom Handmade Gift Hampers",
        description: "Customized gift boxes featuring miniature handicrafts and handcrafted diyas.",
        price: "Starts from ₹600",
        availability: "Order 3 days in advance",
      },
    ],
  },
  {
    id: 105,
    name: "Mahalaxmi Catering & Tiffins",
    categoryId: 1,
    location: "Unkal, Hubli",
    description: "Hygienic vegetarian & North Indian daily lunch and dinner boxes delivered fresh.",
    pricingRange: "₹90 - ₹140 per meal",
    availability: "Available today",
    isAvailable: true,
    createdAt: "2026-03-01T10:00:00Z",
    entrepreneur: {
      name: "Lakshmi Hegde",
      experienceLevel: "10+ years catering experience",
      bio: "Lakshmi runs a community-loved catering service known for mouthwatering North Indian and South Indian thalis.",
    },
    serviceArea: "Serving Unkal, Unkal Lake area, and Sainagar in Hubli.",
    weeklyHours: defaultWeeklyHours,
    services: [
      {
        id: "s105-1",
        name: "North Indian Executive Tiffin",
        description: "Paneer butter masala, jeera rice, 3 butter rotis, dal fry, salad, and sweet.",
        price: "₹120 per meal",
        availability: "Daily lunch & dinner",
      },
      {
        id: "s105-2",
        name: "Mini Party Catering (10-25 pax)",
        description: "Custom vegetarian menu for small home functions and family get-togethers.",
        price: "₹250 per plate",
        availability: "Advance booking",
      },
    ],
  },
  {
    id: 106,
    name: "Shraddha Designer Boutique",
    categoryId: 2,
    location: "Deshpande Nagar, Hubli",
    description: "Specialized in designer lehengas, custom embroidery, and silk saree dressmaking.",
    pricingRange: "Starts from ₹500",
    availability: "Available this week",
    isAvailable: true,
    createdAt: "2026-03-12T10:00:00Z",
    entrepreneur: {
      name: "Shraddha Shettar",
      experienceLevel: "9+ years fashion design",
      bio: "Shraddha crafts high-fashion bridal lehengas, intricate zardosi work, and festive blouses for boutique clientele.",
    },
    serviceArea: "Serving Deshpande Nagar, Club Road, and Koppikar Road in Hubli.",
    weeklyHours: defaultWeeklyHours,
    services: [
      {
        id: "s106-1",
        name: "Zardosi & Aari Embroidery Blouse",
        description: "Intricate hand embroidery for bridal and festive silk saree blouses.",
        price: "₹1,200 - ₹3,500",
        availability: "7 days crafting time",
      },
      {
        id: "s106-2",
        name: "Custom Anarkali & Lehenga Stitching",
        description: "Tailored designer lehenga skirts and tops with perfect fitting.",
        price: "₹1,500 - ₹4,000",
        availability: "10 days crafting time",
      },
    ],
  },
  {
    id: 107,
    name: "Glow & Grace Salon at Home",
    categoryId: 3,
    location: "Vidya Nagar, Hubli",
    description: "Doorstep hair styling, organic skin treatments, and pedicure/manicure sessions.",
    pricingRange: "Services from ₹250",
    availability: "Available today",
    isAvailable: true,
    createdAt: "2026-03-20T10:00:00Z",
    entrepreneur: {
      name: "Pooja Naik",
      experienceLevel: "4+ years beauty care",
      bio: "Pooja provides relaxing spa pedicures, hair spas, and organic skin care treatments at home.",
    },
    serviceArea: "Serving Vidya Nagar and Court Circle in Hubli.",
    weeklyHours: defaultWeeklyHours,
    services: [
      {
        id: "s107-1",
        name: "Nourishing Hair Spa & Blowdry",
        description: "Deep conditioning cream massage, steam, and professional hair styling.",
        price: "₹650",
        availability: "Available today",
      },
      {
        id: "s107-2",
        name: "Aroma Foot Spa & Pedicure",
        description: "Relaxing foot soak, scrub, nail shaping, and foot massage.",
        price: "₹400",
        availability: "Available today",
      },
    ],
  },
  {
    id: 108,
    name: "Shilpa Clay Art & Crafts",
    categoryId: 4,
    location: "Old Hubli",
    description: "Custom clay wall hangings, eco-friendly diyas, and personalized handmade gifts.",
    pricingRange: "₹150 - ₹1200",
    availability: "By appointment",
    isAvailable: false,
    createdAt: "2026-02-25T10:00:00Z",
    entrepreneur: {
      name: "Shilpa Badami",
      experienceLevel: "6+ years pottery craft",
      bio: "Shilpa transforms natural clay into handcrafted home accent pieces, decorative pots, and festival decor.",
    },
    serviceArea: "Serving Old Hubli and nearby areas.",
    weeklyHours: defaultWeeklyHours,
    services: [
      {
        id: "s108-1",
        name: "Eco-Friendly Terracotta Diya Set",
        description: "Pack of 12 hand-painted decorative terracotta diyas.",
        price: "₹250",
        availability: "By appointment",
      },
    ],
  },
  {
    id: 109,
    name: "Radhika Daily Meals",
    categoryId: 1,
    location: "Gokul Road, Hubli",
    description: "Simple, nutritious home meal packages for working professionals and students.",
    pricingRange: "₹70 - ₹110 per meal",
    availability: "Available today",
    isAvailable: true,
    createdAt: "2026-04-02T10:00:00Z",
    entrepreneur: {
      name: "Radhika Kulkarni",
      experienceLevel: "5+ years home catering",
      bio: "Radhika offers homely North and South Indian daily lunch parcels with wholesome taste and minimal oil.",
    },
    serviceArea: "Serving Gokul Road and Industrial Estate in Hubli.",
    weeklyHours: defaultWeeklyHours,
    services: [
      {
        id: "s109-1",
        name: "Standard Veg Tiffin Parcel",
        description: "3 chapatis, 1 dry curry, 1 gravy curry, rice, and dal.",
        price: "₹85 per meal",
        availability: "Daily lunch & dinner",
      },
    ],
  },
  {
    id: 110,
    name: "Pari Fashion Stitching",
    categoryId: 2,
    location: "Dharwad",
    description: "Fast-turnaround suit stitching, western outfit fitting, and kids' traditional wear.",
    pricingRange: "Starts from ₹250",
    availability: "Available today",
    isAvailable: true,
    createdAt: "2026-04-10T10:00:00Z",
    entrepreneur: {
      name: "Parvati Angadi",
      experienceLevel: "7+ years tailoring",
      bio: "Parvati is known for quick turnaround suit stitching and adorable kids ethnic dresses in Dharwad.",
    },
    serviceArea: "Serving Malmaddi and Line Bazaar in Dharwad.",
    weeklyHours: defaultWeeklyHours,
    services: [
      {
        id: "s110-1",
        name: "Kids Ethnic Wear Stitching",
        description: "Custom traditional pavada, lehenga, or kurta sets for children.",
        price: "₹350 - ₹700",
        availability: "3 days delivery",
      },
    ],
  },
  {
    id: 111,
    name: "Natural Herbal Care",
    categoryId: 3,
    location: "Unkal, Hubli",
    description: "Traditional Ayurvedic facial packs, herbal hair oil treatments, and mehendi design.",
    pricingRange: "Services from ₹200",
    availability: "Available this week",
    isAvailable: true,
    createdAt: "2026-04-15T10:00:00Z",
    entrepreneur: {
      name: "Saraswati Hiremath",
      experienceLevel: "8+ years herbal wellness",
      bio: "Saraswati creates home-blended herbal packs for skin nourishment and natural mehendi art.",
    },
    serviceArea: "Serving Unkal and Bairidevarkoppa in Hubli.",
    weeklyHours: defaultWeeklyHours,
    services: [
      {
        id: "s111-1",
        name: "Bridal & Festival Mehendi Design",
        description: "Intricate organic mehendi application for hands and feet.",
        price: "₹500 - ₹2,000",
        availability: "Advance booking",
      },
    ],
  },
  {
    id: 112,
    name: "Srushti Crochet & Embroidery",
    categoryId: 4,
    location: "Deshpande Nagar, Hubli",
    description: "Handcrafted crochet bags, embroidered cushion covers, and table runners.",
    pricingRange: "₹300 - ₹2000",
    availability: "Available this week",
    isAvailable: true,
    createdAt: "2026-04-18T10:00:00Z",
    entrepreneur: {
      name: "Srushti Bellad",
      experienceLevel: "4+ years crochet craft",
      bio: "Srushti creates sustainable handcrafted crochet handbags, tote bags, and embroidered cushion covers.",
    },
    serviceArea: "Serving Deshpande Nagar and all areas in Hubli.",
    weeklyHours: defaultWeeklyHours,
    services: [
      {
        id: "s112-1",
        name: "Handcrafted Crochet Tote Bag",
        description: "Durable and trendy eco-friendly cotton yarn crochet handbag.",
        price: "₹550",
        availability: "In stock",
      },
    ],
  },
];

export const featuredBusinesses = businesses.slice(0, 4);

export const getCategoryName = (categoryId) => {
  const cat = categories.find((c) => c.id === Number(categoryId));
  return cat ? cat.name : '';
};

export const learningResources = [
  {
    id: 1,
    title: "Starting Your Home Business",
    category: "Business Setup",
    description: "Step-by-step roadmap to start operating your business safely and effectively from home.",
    readTime: "7 min read",
    author: "Aatmanirbhar Nari Mentorship Team",
    publishedDate: "August 2026",
    summary: "Starting a micro-enterprise from home requires minimal initial capital if planned wisely. Follow this beginner-friendly checklist to validate your idea, set up a working environment, and secure your first paying customers.",
    sections: [
      {
        heading: "1. Define Your Core Skill & Signature Offering",
        content: "Focus on what you do best—whether it's authentic North/South Indian cooking, custom blouse stitching, bridal mehendi, or handcrafted home decor. Keep your initial menu or service list small and high-quality."
      },
      {
        heading: "2. Set Up a Clean, Dedicated Workspace",
        content: "Separate your family space from your business area. For home kitchens, ensure pristine hygiene, separate storage for raw ingredients, and labeled containers. For tailoring, arrange proper lighting and ergonomic seating."
      },
      {
        heading: "3. Test With Neighbors & Local Groups",
        content: "Offer free samples or introductory discounts to 5-10 neighbors or friends. Ask for honest feedback on quality, pricing, and packaging before launching publicly."
      },
      {
        heading: "4. Create Your Digital Business Card",
        content: "Register on Aatmanirbhar Nari platform, list your working hours, and share your profile link across local WhatsApp community groups and word-of-mouth networks."
      }
    ],
    keyTakeaways: [
      "Start small with 2-3 signature products or services.",
      "Gather customer feedback early before scaling.",
      "Maintain strict quality and hygienic standards at home.",
      "Leverage direct WhatsApp connections with local neighborhood buyers."
    ]
  },
  {
    id: 2,
    title: "Pricing Basics: Profit Without Undercharging",
    category: "Pricing & Finance",
    description: "Learn how to calculate your true costs and set a fair, profitable price for your services.",
    readTime: "5 min read",
    author: "Financial Literacy Cell",
    publishedDate: "August 2026",
    summary: "Many women entrepreneurs calculate prices based only on raw material cost, forgetting labor, electricity, packaging, and personal profit margins. Here is a simple math formula to price correctly.",
    sections: [
      {
        heading: "1. Calculate Direct Material Costs",
        content: "Add up every item that goes into one unit (e.g., for a tiffin: rice, vegetables, spices, oil, gas, disposable containers)."
      },
      {
        heading: "2. Factor in Your Personal Labor & Time",
        content: "Your time is valuable! Assign a reasonable hourly rate for your work. If a blouse takes 3 hours to stitch, include labor cost for all 3 hours."
      },
      {
        heading: "3. Include Overhead & Utilities",
        content: "Add a small 10-15% buffer to cover electricity, fuel, equipment wear-and-tear, and water charges."
      },
      {
        heading: "4. Add a Fair Profit Margin (20% - 30%)",
        content: "Profit is what allows your business to grow and reinvest. Never sell at cost price just to match market competitors."
      }
    ],
    keyTakeaways: [
      "Formula: Total Cost = Raw Materials + Labor Time + Overheads + Profit Margin.",
      "Never ignore your own labor time in price calculations.",
      "Offer tiered packages (Basic, Standard, Premium) for different budgets.",
      "Keep a physical notebook or digital expense log every week."
    ]
  },
  {
    id: 3,
    title: "Digital Marketing via WhatsApp & Social Media",
    category: "Marketing",
    description: "Simple steps to promote your business in local WhatsApp and Facebook groups.",
    readTime: "8 min read",
    author: "Digital Growth Coach",
    publishedDate: "August 2026",
    summary: "You don't need expensive ads to grow your customer base. Highlighting real photos of your fresh food or finished garments in local WhatsApp groups drives high trust and rapid word-of-mouth orders.",
    sections: [
      {
        heading: "1. Take Bright, Real Photos in Natural Light",
        content: "Place your cooked dish or finished boutique dress near a window with clean background lighting. Avoid dark or blurred camera angles."
      },
      {
        heading: "2. Craft Clear WhatsApp Broadcast Messages",
        content: "Keep messages concise: Product Name, Price, Delivery Area, and a direct link to your Aatmanirbhar Nari profile for full details."
      },
      {
        heading: "3. Request Customer Reviews & Photos",
        content: "After delivering a meal or outfit, text your customer: 'Hope you enjoyed it! A quick review would mean the world to me.' Share positive feedback screenshots (with permission)."
      },
      {
        heading: "4. Run Festival & Weekend Specials",
        content: "Offer festive snack boxes during Diwali, festive saree stitching packages before weddings, or weekend tiffin combos."
      }
    ],
    keyTakeaways: [
      "Real photo uploads build 3x more trust than stock images.",
      "Post consistently during peak decision hours (e.g., 10 AM for lunch tiffins).",
      "Treat every customer with warm personal courtesy to ensure repeat orders."
    ]
  },
  {
    id: 4,
    title: "Creating Your Brand Identity & Packaging",
    category: "Branding",
    description: "How to choose a memorable name, logo, and presentation for your products.",
    readTime: "6 min read",
    author: "Brand Strategy Desk",
    publishedDate: "August 2026",
    summary: "Your brand is the promise you make to your customers. A memorable business name, clean packaging, and a custom thank-you note turn one-time buyers into lifelong advocates.",
    sections: [
      {
        heading: "1. Choosing a Memorable Business Name",
        content: "Select a name that reflects warmth, trust, and your primary craft (e.g., 'Annapurna Home Kitchen', 'Sahana Tailoring Studio')."
      },
      {
        heading: "2. Simple & Clean Packaging Solutions",
        content: "Invest in eco-friendly paper bags, tamper-proof food containers, or branded stickers. Neat packaging reflects high professionalism."
      },
      {
        heading: "3. Personal Touch: Handwritten Thank-You Notes",
        content: "Adding a tiny note like 'Made with love for you!' inside the package creates an instant emotional bond."
      }
    ],
    keyTakeaways: [
      "Memorable names are simple and easy to pronounce.",
      "Clean packaging protects products during transport and builds brand value.",
      "Small personal touches cost almost nothing but create loyal customers."
    ]
  },
  {
    id: 5,
    title: "Licensing & Legal Basics for Micro-Businesses",
    category: "Legal Basics",
    description: "A quick guide to local business registrations and food safety licenses (FSSAI).",
    readTime: "10 min read",
    author: "Compliance & Advisory Team",
    publishedDate: "August 2026",
    summary: "Understanding basic registrations like FSSAI (for food businesses) and Udyam Registration (for MSMEs) protects your business and unlocks government subsidies.",
    sections: [
      {
        heading: "1. FSSAI Basic Registration for Home Caterers",
        content: "If you prepare or sell home-cooked meals, applying for an FSSAI Basic Registration online costs under ₹100/year and gives customers complete peace of mind regarding food safety standards."
      },
      {
        heading: "2. Free MSME Udyam Registration",
        content: "Government of India offers free online Udyam registration for micro-enterprises using Aadhaar. It qualifies you for priority bank loans and micro-credit schemes."
      },
      {
        heading: "3. Maintaining Simple Accounts",
        content: "Maintain a daily ledger of Income and Expenses. Keep separate bank accounts for personal use and business transactions."
      }
    ],
    keyTakeaways: [
      "FSSAI Registration is simple and essential for food businesses.",
      "Udyam Registration is free and opens access to government financial assistance.",
      "Separating personal and business accounts prevents cash flow confusion."
    ]
  }
];

