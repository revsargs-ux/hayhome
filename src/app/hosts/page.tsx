import HostsClient from "./HostsClient";
import { Host } from "@/lib/types";

async function fetchHosts(): Promise<Host[]> {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/hosts`, { next: { revalidate: 300 } });
    return res.ok ? res.json() : [];
  } catch { return []; }
}

export default async function HostsPage() {
  const hosts = await fetchHosts();
  const featured = hosts.filter((h) => h.status === "active").slice(0, 8);

  return (
    <>
      {/* Static SEO content — visible to search engines, hidden visually */}
      <section className="sr-only" aria-label="Host families overview">
        <h1>Armenian Host Families — Homestays in Armenia | HayHome</h1>
        <p>
          Discover authentic Armenian homestays with HayHome. Stay with local families, enjoy
          home-cooked meals, wine tasting, traditional crafts, and warm Armenian hospitality.
          {featured.length > 0 && ` Browse ${featured.length}+ verified host families across Armenia.`}
        </p>
        <ul>
          {featured.map((host) => (
            <li key={host.id}>
              <a href={`/hosts/${host.id}`}>
                <strong>{host.familyName}</strong> — {host.city}, Armenia.{" "}
                From ${host.pricePerNight}/night.{" "}
                {host.description}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <HostsClient />
    </>
  );
}
