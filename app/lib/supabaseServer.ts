import { authConfig, dataHeaders, getGoogleSession, AuthError } from "./googleAuth";
export type SupabaseInsertResult<T = Record<string, unknown>> = {
  data: T[];
  simulated: boolean;
  ok: true;
};

export type SupabaseQueryResult<T> = {
  data: T[];
  simulated: boolean;
  ok: boolean;
  error?: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;



export function hasSupabaseConfig() {
  return Boolean(supabaseUrl && publishableKey && !supabaseUrl.includes("SEU-PROJETO"));
}

function endpoint(path: string) {
  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL não configurada.");
  }

  return `${supabaseUrl.replace(/\/$/, "")}/rest/v1/${path}`;
}

const headers = dataHeaders;

function readableError(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return 'Falha inesperada ao acessar o banco de dados.';
}

function reportDataError(operation: string, error: unknown) {
  console.error(JSON.stringify({ level: 'error', scope: 'supabase', operation, message: readableError(error), occurred_at: new Date().toISOString() }));
}

async function supabaseFetch(path: string, init: RequestInit = {}) {
  return fetch(endpoint(path), { ...init, headers: await headers(init.headers), cache: 'no-store', signal: AbortSignal.timeout(10_000) });
}

export async function writeAudit(action: string, entity: string, entityId?: unknown) {
  if (entity === 'audit_logs' || !hasSupabaseConfig()) return;
  try {
    const response = await fetch(endpoint('audit_logs'), {
      method: 'POST', headers: await headers({ Prefer: 'return=minimal' }), cache: 'no-store', signal: AbortSignal.timeout(5_000),
      body: JSON.stringify({ actor_id: (await getGoogleSession()).user.id, action, entity, entity_id: entityId ? String(entityId) : null, metadata: { source: 'server_api' } }),
    });
    if (!response.ok) throw new Error(`Audit request failed (${response.status})`);
  } catch (error) { reportDataError(`audit:${entity}`, error); }
}

export async function listRows<T>(table: string, select = "*", order = "created_at.desc") {
  if (!hasSupabaseConfig()) throw new AuthError("Conexão indisponível.",503);

  try {
    const response = await supabaseFetch(`${table}?select=${encodeURIComponent(select)}&order=${order}`);
    if (!response.ok) throw new Error(await response.text());
    return { data: (await response.json()) as T[], simulated: false, ok: true } satisfies SupabaseQueryResult<T>;
  } catch (error) {
    if (error instanceof AuthError) throw error;
    reportDataError(`list:${table}`, error);
    return { data: [] as T[], simulated: false, ok: false, error: readableError(error) } satisfies SupabaseQueryResult<T>;
  }
}


export async function queryRows<T>(path: string) {
  if (!hasSupabaseConfig()) throw new AuthError("Conexão indisponível.",503);

  try {
    const response = await supabaseFetch(path);
    if (!response.ok) throw new Error(await response.text());
    return { data: (await response.json()) as T[], simulated: false, ok: true } satisfies SupabaseQueryResult<T>;
  } catch (error) {
    if (error instanceof AuthError) throw error;
    reportDataError(`query:${path.split('?')[0]}`, error);
    return { data: [] as T[], simulated: false, ok: false, error: readableError(error) } satisfies SupabaseQueryResult<T>;
  }
}
export async function insertRow<T>(table: string, payload: Record<string, unknown>): Promise<SupabaseInsertResult<T>> {
  if (!hasSupabaseConfig()) throw new AuthError("Conexão indisponível.",503);

  const user = (await getGoogleSession()).user;
  await validateRelations(payload);
  payload = { ...payload, owner_id: user.id };
  const response = await fetch(endpoint(table), {
    method: "POST",
    headers: await headers({ Prefer: "return=representation" }),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = (await response.json()) as T[];
  await writeAudit('insert', table, (data[0] as { id?: unknown } | undefined)?.id);
  return { data, simulated: false, ok: true };
}


export async function updateRow<T>(table: string, id: string, payload: Record<string, unknown>): Promise<SupabaseInsertResult<T>> {
  if (!hasSupabaseConfig()) throw new AuthError("Conexão indisponível.",503);

  await validateRelations(payload);
  payload = { ...payload, owner_id: (await getGoogleSession()).user.id };
  const response = await fetch(endpoint(`${table}?id=eq.${encodeURIComponent(id)}`), {
    method: "PATCH",
    headers: await headers({ Prefer: "return=representation" }),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = (await response.json()) as T[];
  await writeAudit('update', table, id);
  return { data, simulated: false, ok: true };
}

export async function deleteRow(table: string, id: string) {
  if (!hasSupabaseConfig()) throw new AuthError("Conexão indisponível.",503);

  const response = await fetch(endpoint(`${table}?id=eq.${encodeURIComponent(id)}`), {
    method: "DELETE",
    headers: await headers({ Prefer: "return=representation" }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();
  await writeAudit('delete', table, id);
  return { data, simulated: false, ok: true };
}

export async function deleteRowsWhere(table: string, column: string, value: string) {
  if (!hasSupabaseConfig()) throw new AuthError("Conexão indisponível.",503);
  const response = await fetch(endpoint(`${table}?${column}=eq.${encodeURIComponent(value)}`), {
    method: 'DELETE', headers: await headers({ Prefer: 'return=representation' }), cache: 'no-store', signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(await response.text());
  const data = await response.json();
  await writeAudit('bulk_delete', table, `${column}:${value}`);
  return { data, simulated: false, ok: true };
}
export function jsonError(error: unknown, status = 500) {
  const message = error instanceof Error ? error.message : "Erro inesperado.";
  return Response.json({ ok: false, error: message }, { status: error instanceof AuthError ? error.status : status });
}

async function validateRelations(payload: Record<string,unknown>) {
  for (const [field,table] of [["patient_id","patients"],["meal_plan_id","meal_plans"]]) {
    const id=payload[field]; if (!id) continue;
    const r=await supabaseFetch(table+"?select=id&id=eq."+encodeURIComponent(String(id))+"&limit=1");
    if (!r.ok || !(await r.json() as unknown[]).length) throw new AuthError("Registro vinculado não encontrado na sua conta.",403);
  }
}

