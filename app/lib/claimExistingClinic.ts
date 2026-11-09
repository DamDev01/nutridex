import type { User } from "@supabase/supabase-js";
export async function claimExistingClinic(user:User){
  const expected=process.env.NUTRIDEX_INITIAL_OWNER_EMAIL?.trim().toLowerCase();
  if(!expected||!user.email_confirmed_at||user.email?.trim().toLowerCase()!==expected||!user.identities?.some(identity=>identity.provider==="google"))return;
  const key=process.env.SUPABASE_SECRET_KEY;const url=process.env.NEXT_PUBLIC_SUPABASE_URL;if(!key||!url)return;
  const tables=["patients","appointments","clinical_notes","exams","photos","payments","anthropometry_records","body_measures","meal_plans","meal_plan_items","anamneses","clinic_settings","foods"];
  for(const table of tables){const r=await fetch(url+"/rest/v1/"+table+"?owner_id=is.null",{method:"PATCH",headers:{apikey:key,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify({owner_id:user.id}),cache:"no-store",signal:AbortSignal.timeout(10000)});if(!r.ok)throw new Error("Não foi possível vincular os registros existentes ao proprietário.");}
}
