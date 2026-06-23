export interface ViewHistoryEntry {
  hostId: string;
  viewedAt: string;
}

const STORAGE_KEY = "hayhome_view_history";
const MAX_ITEMS = 20;

export function getHistory(): ViewHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as ViewHistoryEntry[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function addToHistory(hostId: string): void {
  if (typeof window === "undefined") return;
  try {
    const history = getHistory();
    const filtered = history.filter((h) => h.hostId !== hostId);
    filtered.unshift({ hostId, viewedAt: new Date().toISOString() });
    const trimmed = filtered.slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}

export function removeHistory(hostId: string): void {
  if (typeof window === "undefined") return;
  try {
    const history = getHistory();
    const filtered = history.filter((h) => h.hostId !== hostId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // ignore
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
