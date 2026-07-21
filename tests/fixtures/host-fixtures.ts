import { BASE_URL } from "../config";

export const SAMPLE_HOST = {
  name: "Тест",
  familyName: "Тестовая семья Авторан",
  patronymic: "Тестович",
  city: "Ереван",
  region: "Ереван",
  phone: "+374991234567",
  email: `test.host.${Date.now()}@hay-home.com`,
  pricePerNight: 50,
  stars: 4,
  description: "Тестовый хост для автотестов — не бронировать",
  maxGuests: 2,
  availableRooms: 1,
  languages: ["ru", "en"],
  amenities: ["wifi", "breakfast"],
  experiences: ["wine tasting"],
  badges: [],
  photos: [],
  coverPhoto: "",
  lang: "ru",
};

export const SAMPLE_REVIEW = {
  rating: 5,
  text: "Отличное место, всё понравилось! Тест.",
};

export const SAMPLE_REQUEST = {
  guestName: "Тест Гость",
  guestEmail: `test.request.${Date.now()}@hay-home.com`,
  guestPhone: "+74991234567",
  checkIn: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
  checkOut: new Date(Date.now() + 10 * 86400000).toISOString().split("T")[0],
  guests: 2,
  category: "homestay",
  region: "Ереван",
  budget: 100,
  message: "Тестовая заявка для автотестов",
};

// Создать хоста через API и вернуть его ID
export async function createTestHost(cookie?: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/hosts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: `hayhome_auth=${cookie}` } : {}),
    },
    body: JSON.stringify(SAMPLE_HOST),
  });
  if (!res.ok) throw new Error(`createTestHost failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.id as string;
}
