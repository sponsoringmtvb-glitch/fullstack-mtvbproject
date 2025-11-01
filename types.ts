export type PlayerStatus = 'pending' | 'approved' | 'rejected' | 'validated' | 'verified' | 'assigned';
export type PlayerCategory = string;

export interface PlayerDocuments {
  idCard: string | null;
  parentalAuth: string | null;
  medicalCert: string | null;
}

export interface Player {
  id: number;
  name: string;
  sex: 'Male' | 'Female';
  email: string;
  dob: string; // Date of Birth as ISO string
  phone: string;
  status: PlayerStatus;
  category: PlayerCategory;
  team: string | null;
  documents: PlayerDocuments;
  notifications: string[];
  isVerified: boolean;
  password?: string; // Only for registration, not stored long-term
  authProvider?: 'email' | 'google';

  // Roster-specific details
  position: 'Setter' | 'Outside Hitter' | 'Middle Blocker' | 'Opposite Hitter' | 'Libero';
  number: number;
  imageUrl: string;
  height: string;
  bio: string;
  stats: {
    matchesPlayed: number;
    points: number;
    blocks: number;
    aces: number;
  };
}

export interface NewsArticle {
  id: number;
  title: string;
  date: string; // ISO 8601 format
  summary: string;
  content: string;
  imageUrl: string;
}

export interface LiveScore {
  ourSets: number;
  opponentSets: number;
  ourPoints: number;
  opponentPoints: number;
  currentSet: number;
  servingTeam?: 'us' | 'opponent';
}

export interface Match {
  id: number;
  opponent: string;
  date: string; // ISO 8601 format
  location: string;
  isHome: boolean;
  category: string;
  result?: {
    ourScore: number;
    opponentScore: number;
  };
  playerOfTheMatchId?: number;
  liveStreamUrl?: string;
  liveScore?: LiveScore;
}

export interface GalleryPhoto {
    id: number;
    imageUrl: string;
    caption: string;
}

export enum SponsorTier {
    Platinum = 'Platinum',
    Gold = 'Gold',
    Silver = 'Silver',
}

export interface Sponsor {
    id: number;
    name: string;
    imageUrl: string;
    websiteUrl: string;
    tier: SponsorTier;
}

export type AdminPage = 'dashboard' | 'registrations' | 'matches' | 'news' | 'sponsors' | 'categories' | 'teams' | 'appearance' | 'staff' | 'general' | 'products' | 'orders' | 'classement';

export interface HomePageContent {
  title: string;
  subtitle: string;
  ctaTeam: string;
  ctaSchedule: string;
  heroImageUrl: string;
}

export interface ClubInfo {
    history: string;
    mission: string;
}

export interface StaffMember {
    id: number;
    name: string;
    position: string;
    bio: string;
    imageUrl: string;
}

export interface CategoryRule {
  name: PlayerCategory;
  startYear: number;
  endYear: number;
}

export interface Team {
  id: number;
  name: string;
  category: string;
  logo: string;
  photoUrl: string;
}

export interface SmtpSettings {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
}

export interface GeneralSettings {
  clubName: string;
  logoUrl: string;
  faviconUrl: string;
  isMaintenanceMode: boolean;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
  enabledStandingsCategories: string[];
  smtpSettings: SmtpSettings;
}

export interface AdminActivity {
    id: number;
    timestamp: string;
    message: string;
    link?: { page: AdminPage; id?: any };
}

// Store Types
export interface VariantOption {
  value: string; // e.g., 'L', '#FF0000'
  label: string; // e.g., 'Large', 'Red'
}

export interface ProductVariant {
  name: string; // e.g., 'Size', 'Color'
  type: 'button' | 'color' | 'dropdown';
  options: VariantOption[];
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    images: string[];
    variants: ProductVariant[];
    category: string;
    stock: number;
}

export interface CartItem extends Product {
    cartId: string;
    quantity: number;
    selectedVariants: { [key: string]: string }; // e.g., { "Size": "L", "Color": "#FF0000" }
}

export interface OrderItem {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    selectedVariants: { [key: string]: string };
}

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
    id: number;
    customer: {
        name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        postalCode: string;
    };
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    date: string; // ISO 8601
}

// Classement Types
export interface StandingItem {
    id?: number;
    teamName: string;
    points: number;
    played: number;
    wins: number;
    losses: number;
}

export type Classement = {
    [category: string]: StandingItem[];
};