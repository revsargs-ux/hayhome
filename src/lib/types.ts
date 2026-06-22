export type Stars = 1 | 2 | 3 | 4 | 5;

export interface HostI18nEntry {
  familyName?: string;
  description?: string;
  longDescription?: string;
}

export interface Host {
  i18n?: Record<string, HostI18nEntry>;
  id: string;
  name: string;
  familyName: string;
  location: string;
  city: string;
  region: string;
  stars: Stars;
  pricePerNight: number;
  description: string;
  longDescription: string;
  photos: string[];
  coverPhoto: string;
  languages: string[];
  amenities: string[];
  experiences: string[];
  badges: string[];
  maxGuests: number;
  availableRooms: number;
  rating: number;
  admin_notes?: string;
  reviewCount: number;
  verified: boolean;
  phone: string;
  email: string;
  createdAt: string;
  status: "active" | "pending" | "suspended";
}

export interface Badge {
  emoji: string;
  label: string;
  color: string;
}

export interface Review {
  id: string;
  hostId: string;
  guestName: string;
  guestCountry: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Partner {
  id: string;
  user_id: string;
  role: "ambassador" | "hunter" | "regional";
  region: string | null;
  status: "active" | "frozen" | "suspended";
  balance: number;
  total_earned: number;
  total_withdrawn: number;
  code: string;
  created_at: string;
}

export interface Referral {
  id: string;
  partner_id: string;
  referred_user_id: string;
  type: "guest" | "host" | "experience";
  referred_entity_id: string | null;
  status: "active" | "expired" | "fraud";
  first_booking_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface Payout {
  id: string;
  partner_id: string;
  amount: number;
  method: "idram" | "bank_transfer" | "crypto";
  details: string;
  status: "pending" | "completed" | "rejected";
  created_at: string;
  processed_at: string | null;
  note: string | null;
}

export interface Booking {
  id: string;
  hostId: string;
  hostName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCountry: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  message: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "guest" | "host" | "admin";
  createdAt: string;
}
