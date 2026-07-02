import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, region, category, hostId, excludeId, limit } = body;

    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ hosts: [], services: [] });

    const maxItems = limit || 4;
    const result: { hosts: any[]; services: any[] } = { hosts: [], services: [] };

    if (type === "hosts" || type === "all") {
      let q = supabase.from("hayhome_hosts").select("*");
      if (excludeId) q = q.neq("id", excludeId);
      if (region && region !== "all") q = q.eq("region", region);
      const { data: hosts } = await q.order("rating", { ascending: false }).limit(maxItems);
      result.hosts = hosts || [];
    }

    if (type === "services" || type === "all") {
      let q = supabase.from("hayhome_services").select("*");
      if (excludeId) q = q.neq("id", excludeId);
      if (category && category !== "all") q = q.eq("category", category);
      if (region && region !== "all") q = q.eq("region", region);
      const { data: services } = await q.order("created_at", { ascending: false }).limit(maxItems);
      result.services = services || [];
    }

    if (type === "similar-hosts" && hostId) {
      const { data: current } = await supabase.from("hayhome_hosts").select("region, city").eq("id", hostId).single();
      if (current) {
        const { data } = await supabase
          .from("hayhome_hosts")
          .select("*")
          .neq("id", hostId)
          .eq("region", current.region)
          .order("rating", { ascending: false })
          .limit(maxItems);
        result.hosts = data || [];
      }
    }

    if (type === "similar-services" && hostId) {
      const { data: current } = await supabase.from("hayhome_hosts").select("region").eq("id", hostId).single();
      if (current) {
        const { data } = await supabase
          .from("hayhome_services")
          .select("*")
          .eq("region", current.region)
          .limit(maxItems);
        result.services = data || [];
      }
    }

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ hosts: [], services: [] });
  }
}
