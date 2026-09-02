export const VERIFICATION_GUIDANCE = {
  'Tiffin Services': {
    title: 'Tiffin Services Verification Guidance',
    prompts: [
      'Description of food preparation setup and hygiene standards',
      'Operating location / kitchen address details',
      'FSSAI registration / licence details (if applicable)',
      'Any other relevant food safety or business proof',
    ],
    placeholder: 'e.g. Operating from home kitchen at Vidya Nagar, Hubli. Preparing fresh South Indian vegetarian tiffins daily using stainless steel containers. FSSAI Registration No: 212xxxxxxxxxxx (or state if not applicable/in process).',
  },
  'Catering & Food': {
    title: 'Catering & Food Verification Guidance',
    prompts: [
      'Description of catering and food service capacity',
      'Operating kitchen / unit location',
      'FSSAI registration / licence details (if applicable)',
      'Relevant business proof or past event orders if available',
    ],
    placeholder: 'e.g. Small-batch catering for up to 50 guests. Kitchen located at Gokul Road, Hubli. FSSAI Registration No: 212xxxxxxxxxxx. Photos/menu list available on request.',
  },
  'Tailoring & Boutique': {
    title: 'Tailoring & Boutique Verification Guidance',
    prompts: [
      'Description of tailoring and boutique work offered',
      'Business or workshop location',
      'Work experience, stitching portfolio, or training background',
      'Relevant business proof if available',
    ],
    placeholder: 'e.g. 6+ years experience in custom blouse tailoring and salwar suit stitching. Operating boutique studio at Keshwapur, Hubli. Sample work photos available.',
  },
  'Beauty Services': {
    title: 'Beauty Services Verification Guidance',
    prompts: [
      'Description of beauty and salon services provided',
      'Service location (home studio or doorstep service area)',
      'Beautician training / certification details (if applicable)',
      'Relevant business proof if available',
    ],
    placeholder: 'e.g. 4 years experience as certified beautician. Offering doorstep facials, waxing, and bridal mehendi in Hubli city. Diploma in Beauty & Wellness from XYZ Institute.',
  },
  'Handicrafts & Decor': {
    title: 'Handicrafts & Decor Verification Guidance',
    prompts: [
      'Description of handcrafted products and materials used',
      'How and where products are crafted',
      'Portfolio or product catalog examples',
      'Relevant business proof if available',
    ],
    placeholder: 'e.g. Handcrafted eco-friendly clay diyas, festive torans, and crochet bags. Crafting unit at Old Hubli. Product catalog and craft workshop photos available.',
  },
  'Education & Tutoring': {
    title: 'Education & Tutoring Verification Guidance',
    prompts: [
      'Subjects or skill coaching offered',
      'Teaching experience and educational qualifications (if applicable)',
      'Operating location and teaching mode (home tuition, online, or center)',
      'Relevant credentials or business proof',
    ],
    placeholder: 'e.g. B.Sc. graduate offering Mathematics & Science home tuition for classes 5 to 10 in Deshpande Nagar, Hubli. 3+ years tutoring experience.',
  },
  'Other Services': {
    title: 'General Service Verification Guidance',
    prompts: [
      'Detailed description of the micro-business service',
      'Experience, skills, or qualification details',
      'Operating location or service coverage area',
      'Relevant business proof or references',
    ],
    placeholder: 'e.g. Providing home event decoration and mehendi stall management in Hubli-Dharwad. 2+ years experience with local community events.',
  },
};

export const DEFAULT_GUIDANCE = {
  title: 'Business Verification Guidance',
  prompts: [
    'Detailed description of your micro-business operations',
    'Operating location / address',
    'Relevant qualifications, experience, or licences (if applicable)',
    'Any other proof demonstrating genuine business operations',
  ],
  placeholder: 'Describe your business operations, experience, and operating location to help our team verify your enterprise.',
};

export function getCategoryGuidance(categoryName) {
  return VERIFICATION_GUIDANCE[categoryName] || DEFAULT_GUIDANCE;
}
