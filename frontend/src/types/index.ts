// ── User ──
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  city: string;
  role: string;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
}

// ── Auth ──
export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

// ── Estimate ──
export interface RoomInput {
  room_type: string;
  count: number;
}

export interface RoomBreakdown {
  room_type: string;
  count: number;
  area_sqft: number;
  price_per_sqft: number;
  room_cost: number;
}

export interface EstimateResult {
  breakdown: RoomBreakdown[];
  material_cost: number;
  labour_cost: number;
  labour_percent: number;
  subtotal: number;
  gst_amount: number;
  gst_percent: number;
  grand_total: number;
  tier: string;
}

export interface EstimationRecord {
  id: string;
  user_name: string;
  user_email: string;
  guest_email: string;
  project_type: string;
  property_type: string;
  style: string;
  tier: string;
  rooms_breakdown: RoomBreakdown[];
  material_cost: number;
  labour_cost: number;
  subtotal: number;
  gst_amount: number;
  grand_total: number;
  status: string;
  created_at: string;
}

// ── CMS ──
export interface CompanyProfile {
  name: string;
  tagline: string;
  logo_url: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  social_links: Record<string, string>;
  footer_text: string;
}

export interface SEOMeta {
  page_slug: string;
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  og_image_url: string;
  canonical_url: string;
}

export interface Testimonial {
  id: number;
  name: string;
  city: string;
  content: string;
  rating: number;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export interface PortfolioProject {
  id: number;
  title: string;
  city: string;
  style: string;
  image_url: string;
  is_visible: boolean;
  order: number;
}

// ── Pricing ──
export interface PricingItem {
  id: number;
  room_type: string;
  room_type_display: string;
  tier: string;
  tier_display: string;
  price_per_sqft: number;
}

export interface TaxConfig {
  gst_percent: number;
  labour_percent: number;
}

// ── Admin ──
export interface AdminStats {
  total_users: number;
  active_users: number;
  total_estimates: number;
  total_revenue: number;
  avg_estimate_value: number;
  monthly_trend: { month: string; count: number; total: number }[];
}
