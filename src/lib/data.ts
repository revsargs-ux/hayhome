import { promises as fs } from "fs";
import path from "path";
import { Host, Review, Booking, User } from "./types";

const dataDir = path.join(process.cwd(), "src", "data");

async function readJSON<T>(filename: string): Promise<T[]> {
  const file = await fs.readFile(path.join(dataDir, filename), "utf-8");
  return JSON.parse(file);
}

async function writeJSON<T>(filename: string, data: T[]): Promise<void> {
  await fs.writeFile(
    path.join(dataDir, filename),
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

export async function getHosts(): Promise<Host[]> {
  return readJSON<Host>("hosts.json");
}

export async function getHost(id: string): Promise<Host | null> {
  const hosts = await getHosts();
  return hosts.find((h) => h.id === id) ?? null;
}

export async function createHost(host: Omit<Host, "id" | "createdAt" | "rating" | "reviewCount" | "verified" | "status">): Promise<Host> {
  const hosts = await getHosts();
  const newHost: Host = {
    ...host,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split("T")[0],
    rating: 0,
    reviewCount: 0,
    verified: false,
    status: "pending",
  };
  hosts.push(newHost);
  await writeJSON("hosts.json", hosts);
  return newHost;
}

export async function updateHost(id: string, updates: Partial<Host>): Promise<Host | null> {
  const hosts = await getHosts();
  const idx = hosts.findIndex((h) => h.id === id);
  if (idx === -1) return null;
  hosts[idx] = { ...hosts[idx], ...updates };
  await writeJSON("hosts.json", hosts);
  return hosts[idx];
}

export async function getReviews(hostId?: string): Promise<Review[]> {
  const reviews = await readJSON<Review>("reviews.json");
  if (hostId) return reviews.filter((r) => r.hostId === hostId);
  return reviews;
}

export async function createReview(review: Omit<Review, "id">): Promise<Review> {
  const reviews = await readJSON<Review>("reviews.json");
  const newReview: Review = { ...review, id: `r${Date.now()}` };
  reviews.push(newReview);
  await writeJSON("reviews.json", reviews);

  const hosts = await getHosts();
  const hostIdx = hosts.findIndex((h) => h.id === review.hostId);
  if (hostIdx !== -1) {
    const hostReviews = [...reviews.filter((r) => r.hostId === review.hostId)];
    const avg = hostReviews.reduce((s, r) => s + r.rating, 0) / hostReviews.length;
    hosts[hostIdx].rating = Math.round(avg * 10) / 10;
    hosts[hostIdx].reviewCount = hostReviews.length;
    await writeJSON("hosts.json", hosts);
  }

  return newReview;
}

export async function getBookings(hostId?: string): Promise<Booking[]> {
  const bookings = await readJSON<Booking>("bookings.json");
  if (hostId) return bookings.filter((b) => b.hostId === hostId);
  return bookings;
}

export async function createBooking(booking: Omit<Booking, "id" | "createdAt" | "status">): Promise<Booking> {
  const bookings = await readJSON<Booking>("bookings.json");
  const newBooking: Booking = {
    ...booking,
    id: `b${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  bookings.push(newBooking);
  await writeJSON("bookings.json", bookings);
  return newBooking;
}

export async function updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | null> {
  const bookings = await readJSON<Booking>("bookings.json");
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  bookings[idx] = { ...bookings[idx], ...updates };
  await writeJSON("bookings.json", bookings);
  return bookings[idx];
}

export async function getUsers(): Promise<User[]> {
  return readJSON<User>("users.json");
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await getUsers();
  return users.find((u) => u.email === email) ?? null;
}

export async function createUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
  const users = await getUsers();
  const newUser: User = { ...user, id: `u${Date.now()}`, createdAt: new Date().toISOString() };
  users.push(newUser);
  await writeJSON("users.json", users);
  return newUser;
}
