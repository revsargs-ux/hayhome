import { Host, Review, Booking, User } from "./types";
import { supabase } from "./supabase";
import { promises as fs } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "src", "data");

// JSON fallback helpers (если Supabase недоступен)
async function readJSON<T>(filename: string): Promise<T[]> {
  try {
    const file = await fs.readFile(path.join(dataDir, filename), "utf-8");
    return JSON.parse(file);
  } catch {
    return [];
  }
}

// Table names with hayhome_ prefix to avoid conflicts with Dispatcher.PRO
const T = {
  hosts: "hayhome_hosts",
  reviews: "hayhome_reviews",
  bookings: "hayhome_bookings",
  users: "hayhome_users",
};

// ============================================
// HOSTS
// ============================================
// Публичные поля для GET /api/hosts — исключаем паспорт/реквизиты/координаты
const HOST_PUBLIC_FIELDS = "id,name,familyName,location,city,region,stars,pricePerNight,description,longDescription,i18n,coverPhoto,photos,badges,languages,amenities,experiences,maxGuests,availableRooms,rating,reviewCount,verified,phone,email,createdAt,status";

export async function getHosts(includeAll = false): Promise<Host[]> {
  if (includeAll) {
    const { data, error } = await supabase
      .from(T.hosts)
      .select(HOST_PUBLIC_FIELDS)
      .order("rating", { ascending: false });
    if (error || !data) {
      console.warn("[Supabase] getHosts(all) error:", error?.message);
      return readJSON<Host>("hosts.json");
    }
    return data as Host[];
  }

  const { data, error } = await supabase
    .from(T.hosts)
    .select(HOST_PUBLIC_FIELDS)
    .eq("status", "active")
    .order("rating", { ascending: false });

  if (error || !data) {
    console.warn("[Supabase] getHosts fallback to JSON:", error?.message);
    return readJSON<Host>("hosts.json");
  }
  return data as Host[];
}

export async function getHost(id: string): Promise<Host | null> {
  const { data, error } = await supabase
    .from(T.hosts)
    .select(HOST_PUBLIC_FIELDS)
    .eq("id", id)
    .single();

  if (error || !data) {
    console.warn("[Supabase] getHost fallback to JSON:", error?.message);
    const hosts = await readJSON<Host>("hosts.json");
    return hosts.find((h) => h.id === id) ?? null;
  }
  return data as Host;
}

export async function createHost(
  host: Omit<Host, "id" | "createdAt" | "rating" | "reviewCount" | "verified" | "status">
): Promise<Host> {
  const newHost = {
    ...host,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split("T")[0],
    rating: 0,
    reviewCount: 0,
    verified: false,
    status: "pending",
  };

  const { data, error } = await supabase
    .from(T.hosts)
    .insert(newHost)
    .select()
    .single();

  if (error || !data) {
    console.error("[Supabase] createHost error:", error?.message);
    throw new Error(`Failed to create host: ${error?.message}`);
  }
  return data as Host;
}

export async function updateHost(id: string, updates: Partial<Host>): Promise<Host | null> {
  const { data, error } = await supabase
    .from(T.hosts)
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    console.error("[Supabase] updateHost error:", error?.message);
    return null;
  }
  return data as Host;
}

// ============================================
// REVIEWS
// ============================================
export async function getReviews(hostId?: string): Promise<Review[]> {
  let query = supabase.from(T.reviews).select("*").order("date", { ascending: false });
  if (hostId) query = query.eq("hostId", hostId);

  const { data, error } = await query;

  if (error || !data) {
    console.warn("[Supabase] getReviews fallback to JSON:", error?.message);
    const reviews = await readJSON<Review>("reviews.json");
    return hostId ? reviews.filter((r) => r.hostId === hostId) : reviews;
  }
  return data as Review[];
}

export async function createReview(review: Omit<Review, "id">): Promise<Review> {
  const newReview: Review = { ...review, id: `r${Date.now()}` };

  const { data, error } = await supabase
    .from(T.reviews)
    .insert(newReview)
    .select()
    .single();

  if (error || !data) {
    console.error("[Supabase] createReview error:", error?.message);
    throw new Error(`Failed to create review: ${error?.message}`);
  }

  // Пересчёт рейтинга хозяина
  const { data: hostReviews } = await supabase
    .from(T.reviews)
    .select("rating")
    .eq("hostId", review.hostId);

  if (hostReviews && hostReviews.length > 0) {
    const avg = hostReviews.reduce((s: number, r: any) => s + r.rating, 0) / hostReviews.length;
    await supabase
      .from(T.hosts)
      .update({
        rating: Math.round(avg * 10) / 10,
        reviewCount: hostReviews.length,
      })
      .eq("id", review.hostId);
  }

  return data as Review;
}

// ============================================
// BOOKINGS
// ============================================
export async function getBookings(hostId?: string): Promise<Booking[]> {
  let query = supabase.from(T.bookings).select("*").order("createdAt", { ascending: false });
  if (hostId) query = query.eq("hostId", hostId);

  const { data, error } = await query;

  if (error || !data) {
    console.warn("[Supabase] getBookings fallback to JSON:", error?.message);
    const bookings = await readJSON<Booking>("bookings.json");
    return hostId ? bookings.filter((b) => b.hostId === hostId) : bookings;
  }
  return data as Booking[];
}

export async function createBooking(
  booking: Omit<Booking, "id" | "createdAt" | "status">
): Promise<Booking> {
  const newBooking: Booking = {
    ...booking,
    id: `b${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "pending",
  };

  const { data, error } = await supabase
    .from(T.bookings)
    .insert(newBooking)
    .select()
    .single();

  if (error || !data) {
    console.error("[Supabase] createBooking error:", error?.message);
    throw new Error(`Failed to create booking: ${error?.message}`);
  }
  return data as Booking;
}

export async function updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | null> {
  const { data, error } = await supabase
    .from(T.bookings)
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    console.error("[Supabase] updateBooking error:", error?.message);
    return null;
  }
  return data as Booking;
}

// ============================================
// USERS
// ============================================
export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase.from(T.users).select("id,name,email,role,createdAt");

  if (error || !data) {
    console.warn("[Supabase] getUsers fallback to JSON:", error?.message);
    return readJSON<User>("users.json");
  }
  return data as User[];
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from(T.users)
    .select("id,name,email,role,createdAt,password")
    .eq("email", email)
    .single();

  if (error || !data) {
    console.warn("[Supabase] getUserByEmail fallback to JSON:", error?.message);
    const users = await readJSON<User>("users.json");
    return users.find((u) => u.email === email) ?? null;
  }
  return data as User;
}

export async function createUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
  const newUser: User = {
    ...user,
    id: `u${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from(T.users)
    .insert(newUser)
    .select()
    .single();

  if (error || !data) {
    console.error("[Supabase] createUser error:", error?.message);
    throw new Error(`Failed to create user: ${error?.message}`);
  }
  return data as User;
}
