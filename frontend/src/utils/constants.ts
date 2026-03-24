export const ROOM_TYPES = [
  { value: 'living_room', label: 'Living Room', icon: 'weekend', area: 300 },
  { value: 'bedroom', label: 'Bedroom', icon: 'bed', area: 180 },
  { value: 'kitchen', label: 'Kitchen', icon: 'countertops', area: 150 },
  { value: 'bathroom', label: 'Bathroom', icon: 'bathtub', area: 60 },
  { value: 'dining_room', label: 'Dining Room', icon: 'dining', area: 200 },
  { value: 'home_office', label: 'Home Office', icon: 'desktop_windows', area: 160 },
];

export const TIERS = [
  { value: 'basic', label: 'Basic', description: 'Best value' },
  { value: 'standard', label: 'Standard', description: 'Popular choice' },
  { value: 'premium', label: 'Premium', description: 'Quality upgrade' },
  { value: 'luxury', label: 'Luxury', description: 'Top-of-the-line' },
];

export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment', icon: 'apartment' },
  { value: 'villa', label: 'Villa', icon: 'villa' },
  { value: 'house', label: 'Ind. House', icon: 'house' },
  { value: 'penthouse', label: 'Penthouse', icon: 'domain' },
];

export const DESIGN_STYLES = [
  { value: 'modern_minimalist', label: 'Modern Minimalist', multiplier: 1.0,
    image: 'https://images.unsplash.com/photo-1586023492125-27272f1144b3?auto=format&fit=crop&w=800&q=80' },
  { value: 'contemporary', label: 'Contemporary Chic', multiplier: 1.1,
    image: 'https://images.unsplash.com/photo-1555041469-fd26927b8d5a?auto=format&fit=crop&w=800&q=80' },
  { value: 'traditional', label: 'Traditional Elegance', multiplier: 1.15,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80' },
  { value: 'industrial', label: 'Industrial Loft', multiplier: 1.05,
    image: 'https://images.unsplash.com/photo-1565538810643-b5bdb514cc4a?auto=format&fit=crop&w=800&q=80' },
  { value: 'scandinavian', label: 'Scandinavian', multiplier: 1.08,
    image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80' },
  { value: 'luxury_classic', label: 'Luxury Classic', multiplier: 1.5,
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80' },
];

export const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  draft: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  saved: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  reviewed: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  converted: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};
