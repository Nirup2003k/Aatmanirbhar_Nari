const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');
require('dotenv').config();

const prisma = new PrismaClient();

const defaultWeeklyHours = [
  { dayOfWeek: 'Monday', isAvailable: true, startTime: '09:00 AM', endTime: '07:00 PM' },
  { dayOfWeek: 'Tuesday', isAvailable: true, startTime: '09:00 AM', endTime: '07:00 PM' },
  { dayOfWeek: 'Wednesday', isAvailable: true, startTime: '09:00 AM', endTime: '07:00 PM' },
  { dayOfWeek: 'Thursday', isAvailable: true, startTime: '09:00 AM', endTime: '07:00 PM' },
  { dayOfWeek: 'Friday', isAvailable: true, startTime: '09:00 AM', endTime: '07:00 PM' },
  { dayOfWeek: 'Saturday', isAvailable: true, startTime: '09:00 AM', endTime: '06:00 PM' },
  { dayOfWeek: 'Sunday', isAvailable: false, startTime: '-', endTime: '-' },
];

const seedData = [
  {
    businessName: "Annapurna Home Kitchen",
    category: "Tiffin Services",
    location: "Vidya Nagar, Hubli",
    description: "Authentic South Indian home-cooked meals. Specializing in healthy vegetarian daily tiffins.",
    ownerName: "Annapurna Patil",
    experienceLevel: "6+ years culinary experience",
    serviceArea: "Serving Vidya Nagar, Shirur Park, and BVB Campus area in Hubli within a 4 km radius.",
    pricingRange: "₹80 - ₹120 per meal",
    availability: [
      { dayOfWeek: "Monday", isAvailable: true, startTime: "08:00 AM", endTime: "08:30 PM" },
      { dayOfWeek: "Tuesday", isAvailable: true, startTime: "08:00 AM", endTime: "08:30 PM" },
      { dayOfWeek: "Wednesday", isAvailable: true, startTime: "08:00 AM", endTime: "08:30 PM" },
      { dayOfWeek: "Thursday", isAvailable: true, startTime: "08:00 AM", endTime: "08:30 PM" },
      { dayOfWeek: "Friday", isAvailable: true, startTime: "08:00 AM", endTime: "08:30 PM" },
      { dayOfWeek: "Saturday", isAvailable: true, startTime: "08:00 AM", endTime: "08:30 PM" },
      { dayOfWeek: "Sunday", isAvailable: true, startTime: "09:00 AM", endTime: "02:00 PM" },
    ],
    services: [
      {
        name: "South Indian Daily Lunch Tiffin",
        description: "Fresh steamed rice, sambar, rasam, 2 wheat chapatis, vegetable curry, and fresh buttermilk.",
        price: "₹90 per meal",
        availability: "Monday – Saturday",
      },
      {
        name: "Special Healthy Diet Tiffin",
        description: "Low-oil millets meal with sprouted salads, dal, and multigrain rotis.",
        price: "₹120 per meal",
        availability: "Monday – Friday",
      },
      {
        name: "Evening Chapati & Curry Combo",
        description: "4 soft handmade chapatis with rich vegetable kurma or dal fry.",
        price: "₹80 per pack",
        availability: "Daily 6:30 PM – 8:30 PM",
      },
    ],
  },
  {
    businessName: "Sahana Tailoring Studio",
    category: "Tailoring & Boutique",
    location: "Gokul Road, Hubli",
    description: "Expert alterations and custom blouse stitching with traditional and modern designs.",
    ownerName: "Sahana Kulkarni",
    experienceLevel: "8+ years in apparel design",
    serviceArea: "Serving Gokul Road, Industrial Estate, and Akshay Park areas in Hubli.",
    pricingRange: "Starts from ₹300",
    availability: defaultWeeklyHours,
    services: [
      {
        name: "Designer Blouse Stitching",
        description: "Custom neck patterns, piping, linings, and padded blouse tailoring.",
        price: "₹450 - ₹800",
        availability: "3-5 days delivery",
      },
      {
        name: "Salwar Suit & Kurti Stitching",
        description: "Complete salwar suit stitching with customized neck designs and pant fittings.",
        price: "₹350 - ₹600",
        availability: "3-4 days delivery",
      },
      {
        name: "Express Garment Alterations",
        description: "Fitting adjustments for dresses, blouses, jeans, and saree picco work.",
        price: "₹100 - ₹250",
        availability: "Same-day service available",
      },
    ],
  },
  {
    businessName: "Sneha Home Beauty Services",
    category: "Beauty Services",
    location: "Keshwapur, Hubli",
    description: "Bridal makeup, threading, and relaxing facials. Using premium organic products.",
    ownerName: "Sneha Joshi",
    experienceLevel: "5+ years certified beautician",
    serviceArea: "Serving Keshwapur, Ramesh Bhavan area, and English Medium School locality in Hubli.",
    pricingRange: "Services from ₹150",
    availability: defaultWeeklyHours,
    services: [
      {
        name: "Herbal Facial & Cleanup",
        description: "Organic turmeric and aloe vera facial treatment for radiant skin.",
        price: "₹450",
        availability: "By appointment",
      },
    ],
  },
  {
    businessName: "KalaKriti Handicrafts",
    category: "Handicrafts & Decor",
    location: "Old Hubli",
    description: "Handmade terracotta crafts, festive torans, and customized gifting options.",
    ownerName: "Kavita Deshpande",
    experienceLevel: "10+ years traditional artisan",
    serviceArea: "Serving Old Hubli and whole Hubli-Dharwad twin city.",
    pricingRange: "₹200 - ₹1,500",
    availability: defaultWeeklyHours,
    services: [
      {
        name: "Hand-Painted Terracotta Diya Set",
        description: "Set of 6 decorative clay lamps painted with non-toxic vibrant colors.",
        price: "₹250 per set",
        availability: "In stock",
      },
    ],
  },
  {
    businessName: "Mahalaxmi Catering & Tiffins",
    category: "Tiffin Services",
    location: "Dharwad",
    description: "North Karnataka special Jolada Rotti meal packages for events and daily lunch.",
    ownerName: "Lakshmi Hegde",
    experienceLevel: "12+ years catering experience",
    serviceArea: "Serving Line Bazaar, Sattur, and SDM Medical College campus in Dharwad.",
    pricingRange: "₹100 - ₹250 per plate",
    availability: defaultWeeklyHours,
    services: [
      {
        name: "Jolada Rotti Oota (Thali)",
        description: "2 Jowar rottis, yennegai (stuffed brinjal curry), shenga chutney, sprouts, and curd.",
        price: "₹110 per meal",
        availability: "Daily Lunch & Dinner",
      },
    ],
  },
  {
    businessName: "Shraddha Designer Boutique",
    category: "Tailoring & Boutique",
    location: "Vidya Nagar, Hubli",
    description: "Handicraft embroidery, maggam work blouses, and custom designer sarees.",
    ownerName: "Shraddha Shettar",
    experienceLevel: "7+ years fashion designer",
    serviceArea: "Serving Vidya Nagar and Shirur Park in Hubli.",
    pricingRange: "₹500 - ₹3,000",
    availability: defaultWeeklyHours,
    services: [
      {
        name: "Bridal Maggam Work Blouse",
        description: "Heavy zardosi, bead, and thread embroidery work tailored for wedding blouses.",
        price: "₹1,800 - ₹3,500",
        availability: "7-10 days delivery",
      },
    ],
  },
  {
    businessName: "Glow & Grace Salon at Home",
    category: "Beauty Services",
    location: "Gokul Road, Hubli",
    description: "Full body waxing, pedicure, manicure, and hair spa brought directly to your home.",
    ownerName: "Pooja Naik",
    experienceLevel: "6+ years professional beautician",
    serviceArea: "Serving Gokul Road, Akshay Park, and dollars colony in Hubli.",
    pricingRange: "Packages from ₹600",
    availability: defaultWeeklyHours,
    services: [
      {
        name: "Full Arms & Legs Rica Waxing",
        description: "Hygienic, smooth wax treatment using skin-friendly cartridge wax.",
        price: "₹650",
        availability: "Doorstep service",
      },
    ],
  },
  {
    businessName: "Shilpa Clay Art & Crafts",
    category: "Handicrafts & Decor",
    location: "Unkal, Hubli",
    description: "Customized clay murtis, festive eco-friendly Ganesha idols, and wall murals.",
    ownerName: "Shilpa Badami",
    experienceLevel: "9+ years clay sculptor",
    serviceArea: "Serving Unkal, Bairidevarkoppa, and Rayapur in Hubli-Dharwad.",
    pricingRange: "₹350 - ₹2,500",
    availability: defaultWeeklyHours,
    services: [
      {
        name: "Eco-Friendly Natural Clay Ganesha Idol",
        description: "100% biodegradable unpainted raw clay Ganesha for festival immersion.",
        price: "₹800",
        availability: "Seasonal / Pre-order",
      },
    ],
  },
  {
    businessName: "Radhika Daily Meals",
    category: "Tiffin Services",
    location: "Keshwapur, Hubli",
    description: "Pure Brahmin vegetarian lunch and dinner tiffins with home-ground spices.",
    ownerName: "Radhika Kulkarni",
    experienceLevel: "15+ years culinary mastery",
    serviceArea: "Serving Keshwapur, Kusugal Road, and railway colony in Hubli.",
    pricingRange: "₹90 - ₹130 per meal",
    availability: defaultWeeklyHours,
    services: [
      {
        name: "Full Sattvik Lunch Box",
        description: "Rice, dal fry, 3 soft wheat chapatis, palya, pickle, and fresh curd.",
        price: "₹100 per box",
        availability: "Monday – Saturday",
      },
    ],
  },
  {
    businessName: "Pari Fashion Stitching",
    category: "Tailoring & Boutique",
    location: "Deshpande Nagar, Hubli",
    description: "Kidswear dresses, lehenga choli tailoring, and Western outfit alterations.",
    ownerName: "Parvati Angadi",
    experienceLevel: "5+ years tailoring",
    serviceArea: "Serving Deshpande Nagar, Court Circle, and Hubli main Market.",
    pricingRange: "₹300 - ₹1,200",
    availability: defaultWeeklyHours,
    services: [
      {
        name: "Custom Girls Lehenga Choli Stitching",
        description: "Designer flared festive lehenga with lining, net dupatta, and tassels.",
        price: "₹900 - ₹1,500",
        availability: "5 days delivery",
      },
    ],
  },
  {
    businessName: "Natural Herbal Care",
    category: "Beauty Services",
    location: "Unkal, Hubli",
    description: "Traditional Ayurvedic facial packs, herbal hair oil treatments, and mehendi design.",
    ownerName: "Saraswati Hiremath",
    experienceLevel: "8+ years herbal wellness",
    serviceArea: "Serving Unkal and Bairidevarkoppa in Hubli.",
    pricingRange: "Services from ₹200",
    availability: defaultWeeklyHours,
    services: [
      {
        name: "Bridal & Festival Mehendi Design",
        description: "Intricate organic mehendi application for hands and feet.",
        price: "₹500 - ₹2,000",
        availability: "Advance booking",
      },
    ],
  },
  {
    businessName: "Srushti Crochet & Embroidery",
    category: "Handicrafts & Decor",
    location: "Deshpande Nagar, Hubli",
    description: "Handcrafted crochet bags, embroidered cushion covers, and table runners.",
    ownerName: "Srushti Bellad",
    experienceLevel: "4+ years crochet craft",
    serviceArea: "Serving Deshpande Nagar and all areas in Hubli.",
    pricingRange: "₹300 - ₹2000",
    availability: defaultWeeklyHours,
    services: [
      {
        name: "Handcrafted Crochet Tote Bag",
        description: "Durable and trendy eco-friendly cotton yarn crochet handbag.",
        price: "₹550",
        availability: "In stock",
      },
    ],
  },
];

async function main() {
  console.log('Running idempotent seed script...');

  // Hash passwords using Argon2id
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'AdminPass123!';
  const customerPassword = process.env.SEED_CUSTOMER_PASSWORD || 'CustomerPass123!';
  const entrepreneurPassword = process.env.SEED_ENTREPRENEUR_PASSWORD || 'EntrepreneurPass123!';

  const adminHash = await argon2.hash(adminPassword);
  const customerHash = await argon2.hash(customerPassword);
  const entrepreneurHash = await argon2.hash(entrepreneurPassword);

  // 1. Seed Development ADMIN User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@aatmanirbharnari.com' },
    update: { passwordHash: adminHash },
    create: {
      name: 'System Admin',
      email: 'admin@aatmanirbharnari.com',
      phone: '9900000001',
      passwordHash: adminHash,
      role: 'ADMIN',
    },
  });
  console.log(`Verified Seed ADMIN user: ${adminUser.email} (ID: ${adminUser.id})`);

  // 2. Seed Development CUSTOMER User
  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@aatmanirbharnari.com' },
    update: { passwordHash: customerHash },
    create: {
      name: 'Demo Customer',
      email: 'customer@aatmanirbharnari.com',
      phone: '9900000002',
      passwordHash: customerHash,
      role: 'CUSTOMER',
    },
  });
  console.log(`Verified Seed CUSTOMER user: ${customerUser.email} (ID: ${customerUser.id})`);

  // Map to reuse user accounts for identical ownerNames
  const ownerToUserMap = new Map();

  // 3. Seed/Upsert 7 Official Categories
  const officialCategories = [
    { name: 'Tiffin Services', slug: 'tiffin-services', description: 'Homemade, healthy, and hygienic daily meals delivered to you.', icon: 'ChefHat' },
    { name: 'Tailoring & Boutique', slug: 'tailoring-boutique', description: 'Custom stitching, alterations, and beautiful ethnic wear.', icon: 'Scissors' },
    { name: 'Beauty Services', slug: 'beauty-services', description: 'Professional salon services from the comfort of your home.', icon: 'Sparkles' },
    { name: 'Handicrafts & Decor', slug: 'handicrafts-decor', description: 'Unique handmade decor, gifts, and traditional art pieces.', icon: 'Palette' },
    { name: 'Catering & Food', slug: 'catering-food', description: 'Bulk food orders, event catering, and specialty delicacies.', icon: 'UtensilsCrossed' },
    { name: 'Education & Tutoring', slug: 'education-tutoring', description: 'Private tuition, skill classes, and educational coaching.', icon: 'GraduationCap' },
    { name: 'Other Services', slug: 'other-services', description: 'Various specialized services, home businesses, and custom support.', icon: 'Store' },
  ];

  const categoryMap = new Map();
  for (const cat of officialCategories) {
    const dbCat = await prisma.category.upsert({
      where: { name: cat.name },
      update: {
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        isActive: true,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        isActive: true,
      },
    });
    categoryMap.set(cat.name, dbCat);
  }
  console.log(`Seeded ${categoryMap.size} official categories.`);

  // 4. Upsert Entrepreneur Users and update/backfill Businesses safely
  for (const item of seedData) {
    const ownerName = item.ownerName;
    const categoryRecord = categoryMap.get(item.category);

    let entrepreneurUser = ownerToUserMap.get(ownerName);

    if (!entrepreneurUser) {
      const emailPrefix = ownerName.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
      const email = `${emailPrefix}@aatmanirbharnari.com`;

      entrepreneurUser = await prisma.user.upsert({
        where: { email },
        update: {
          name: ownerName,
        },
        create: {
          name: ownerName,
          email,
          phone: '9876543210',
          passwordHash: entrepreneurHash,
          role: 'ENTREPRENEUR',
        },
      });
      ownerToUserMap.set(ownerName, entrepreneurUser);
      console.log(`Verified Entrepreneur user: ${entrepreneurUser.name} (${entrepreneurUser.email}, ID: ${entrepreneurUser.id})`);
    }

    // Check if Business already exists in PostgreSQL
    const existingBusiness = await prisma.business.findFirst({
      where: { businessName: item.businessName },
    });

    if (existingBusiness) {
      // Update ownerId & categoryId without deleting or modifying services/availability
      await prisma.business.update({
        where: { id: existingBusiness.id },
        data: {
          ownerId: entrepreneurUser.id,
          categoryId: categoryRecord ? categoryRecord.id : existingBusiness.categoryId,
          verificationStatus: 'APPROVED',
          verifiedAt: new Date(),
          verificationDetails: 'Verified platform micro-enterprise.',
        },
      });
      console.log(`Updated existing business ID ${existingBusiness.id} (${existingBusiness.businessName}) -> ownerId: ${entrepreneurUser.id}`);
    } else {
      // If business does not exist at all, create it
      const { services, availability, ...businessDetails } = item;
      const newBusiness = await prisma.business.create({
        data: {
          ...businessDetails,
          ownerId: entrepreneurUser.id,
          categoryId: categoryRecord ? categoryRecord.id : null,
          verificationStatus: 'APPROVED',
          verifiedAt: new Date(),
          verificationDetails: 'Verified platform micro-enterprise.',
          services: {
            create: services,
          },
          availability: {
            create: availability,
          },
        },
      });
      console.log(`Created new business ID ${newBusiness.id} (${newBusiness.businessName}) -> ownerId: ${entrepreneurUser.id}`);
    }
  }

  // Backfill categoryId for any remaining businesses missing categoryId
  const unlinkedBusinesses = await prisma.business.findMany({
    where: { categoryId: null },
  });
  for (const biz of unlinkedBusinesses) {
    const matchedCat = categoryMap.get(biz.category);
    if (matchedCat) {
      await prisma.business.update({
        where: { id: biz.id },
        data: { categoryId: matchedCat.id },
      });
    }
  }

  // 5. Seed/Upsert 5 Official Learning Resources
  const officialLearningResources = [
    {
      title: "Starting Your Home Business",
      slug: "starting-your-home-business",
      category: "Business Setup",
      description: "Step-by-step roadmap to start operating your business safely and effectively from home.",
      summary: "Starting a micro-enterprise from home requires minimal initial capital if planned wisely. Follow this beginner-friendly checklist to validate your idea, set up a working environment, and secure your first paying customers.",
      readTime: "7 min read",
      author: "Aatmanirbhar Nari Mentorship Team",
      publishedDate: "August 2026",
      isPublished: true,
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
      title: "Pricing Basics: Profit Without Undercharging",
      slug: "pricing-basics-profit-without-undercharging",
      category: "Pricing & Finance",
      description: "Learn how to calculate your true costs and set a fair, profitable price for your services.",
      summary: "Many women entrepreneurs calculate prices based only on raw material cost, forgetting labor, electricity, packaging, and personal profit margins. Here is a simple math formula to price correctly.",
      readTime: "5 min read",
      author: "Financial Literacy Cell",
      publishedDate: "August 2026",
      isPublished: true,
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
      title: "Digital Marketing via WhatsApp & Social Media",
      slug: "digital-marketing-via-whatsapp-social-media",
      category: "Marketing",
      description: "Simple steps to promote your business in local WhatsApp and Facebook groups.",
      summary: "You don't need expensive ads to grow your customer base. Highlighting real photos of your fresh food or finished garments in local WhatsApp groups drives high trust and rapid word-of-mouth orders.",
      readTime: "8 min read",
      author: "Digital Growth Coach",
      publishedDate: "August 2026",
      isPublished: true,
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
      title: "Creating Your Brand Identity & Packaging",
      slug: "creating-your-brand-identity-packaging",
      category: "Branding",
      description: "How to choose a memorable name, logo, and presentation for your products.",
      summary: "Your brand is the promise you make to your customers. A memorable business name, clean packaging, and a custom thank-you note turn one-time buyers into lifelong advocates.",
      readTime: "6 min read",
      author: "Brand Strategy Desk",
      publishedDate: "August 2026",
      isPublished: true,
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
      title: "Licensing & Legal Basics for Micro-Businesses",
      slug: "licensing-legal-basics-for-micro-businesses",
      category: "Legal Basics",
      description: "A quick guide to local business registrations and food safety licenses (FSSAI).",
      summary: "Understanding basic registrations like FSSAI (for food businesses) and Udyam Registration (for MSMEs) protects your business and unlocks government subsidies.",
      readTime: "10 min read",
      author: "Compliance & Advisory Team",
      publishedDate: "August 2026",
      isPublished: true,
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

  for (const article of officialLearningResources) {
    await prisma.learningContent.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        category: article.category,
        description: article.description,
        summary: article.summary,
        readTime: article.readTime,
        author: article.author,
        publishedDate: article.publishedDate,
        sections: article.sections,
        keyTakeaways: article.keyTakeaways,
        isPublished: true,
      },
      create: article,
    });
  }
  console.log(`Seeded ${officialLearningResources.length} official learning resources.`);

  console.log('Idempotent seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
