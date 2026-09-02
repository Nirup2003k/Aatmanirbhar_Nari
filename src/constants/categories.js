import {
  ChefHat,
  Scissors,
  Sparkles,
  Palette,
  UtensilsCrossed,
  GraduationCap,
  Store,
} from 'lucide-react';

export const OFFICIAL_CATEGORIES = [
  {
    id: 1,
    name: 'Tiffin Services',
    description: 'Homemade, healthy, and hygienic daily meals delivered to you.',
    icon: 'ChefHat',
    iconComponent: ChefHat,
  },
  {
    id: 2,
    name: 'Tailoring & Boutique',
    description: 'Custom stitching, alterations, and beautiful ethnic wear.',
    icon: 'Scissors',
    iconComponent: Scissors,
  },
  {
    id: 3,
    name: 'Beauty Services',
    description: 'Professional salon services from the comfort of your home.',
    icon: 'Sparkles',
    iconComponent: Sparkles,
  },
  {
    id: 4,
    name: 'Handicrafts & Decor',
    description: 'Unique handmade decor, gifts, and traditional art pieces.',
    icon: 'Palette',
    iconComponent: Palette,
  },
  {
    id: 5,
    name: 'Catering & Food',
    description: 'Bulk food orders, event catering, and specialty delicacies.',
    icon: 'UtensilsCrossed',
    iconComponent: UtensilsCrossed,
  },
  {
    id: 6,
    name: 'Education & Tutoring',
    description: 'Private tuition, skill classes, and educational coaching.',
    icon: 'GraduationCap',
    iconComponent: GraduationCap,
  },
  {
    id: 7,
    name: 'Other Services',
    description: 'Various specialized services, home businesses, and custom support.',
    icon: 'Store',
    iconComponent: Store,
  },
];

export const CATEGORY_NAMES = OFFICIAL_CATEGORIES.map((cat) => cat.name);

export const CATEGORY_MAP = OFFICIAL_CATEGORIES.reduce((acc, cat) => {
  acc[String(cat.id)] = cat.name;
  return acc;
}, {});
