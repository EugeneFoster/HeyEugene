import { NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET() {
  const configured = isSupabaseConfigured();
  const supabase = createServiceClient();

  if (!supabase) {
    return NextResponse.json({
      ok: false,
      mode: "mock",
      message: "Supabase env vars missing — showing mock data",
      supabaseHost: null,
      tenants: 0,
      tickets: 0,
    });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const host = url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  const [tenantRes, ticketRes] = await Promise.all([
    supabase.from("support_tenants").select("id", { count: "exact", head: true }),
    supabase.from("support_tickets").select("id", { count: "exact", head: true }),
  ]);

  const tenants = tenantRes.count ?? 0;
  const tickets = ticketRes.count ?? 0;
  const errors = [tenantRes.error?.message, ticketRes.error?.message].filter(
    Boolean
  );

  const expectedHost = "hhnrxyexvfdfzeigvins.supabase.co";
  const wrongProject = host !== expectedHost;

  return NextResponse.json({
    ok: tenants > 0 && !tenantRes.error,
    mode: tenants > 0 ? "live" : "connected_empty",
    supabaseHost: host,
    wrongProject,
    expectedHost: wrongProject ? expectedHost : undefined,
    tenants,
    tickets,
    errors: errors.length ? errors : undefined,
    hint:
      wrongProject || tenants === 0
        ? "Set Railway vars to MikesCRM (same as mikesplace-dev wrangler.toml), then redeploy."
        : undefined,
  });
}
