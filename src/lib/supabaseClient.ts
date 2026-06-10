import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Database features will be disabled. Set these in your .env.local file."
  );
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * Submit a lead + calculation payload to the calculations_ledger table.
 * Returns the inserted row UUID on success.
 */
export async function submitCalculation(
  payload: {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    timeline: "immediate" | "1-3-months" | "planning";
    configurationData: Record<string, unknown>;
    estimatedTotalCost: number;
  }
): Promise<{ id: string } | { error: string }> {
  if (!supabase) {
    return { error: "Supabase not configured — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY" };
  }

  const { data, error } = await supabase
    .from("calculations_ledger")
    .insert({
      client_name: payload.clientName,
      client_email: payload.clientEmail,
      client_phone: payload.clientPhone,
      timeline: payload.timeline,
      configuration_data: payload.configurationData,
      estimated_total_cost: payload.estimatedTotalCost,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[Supabase] insert error:", error);
    return { error: error.message };
  }

  return { id: data.id };
}
