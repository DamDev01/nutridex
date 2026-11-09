const baseUrl = process.env.NUTRIDEX_URL || 'http://127.0.0.1:3000';
const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/health`, { signal: AbortSignal.timeout(15000) });
const body = await response.json().catch(() => ({}));
if (!response.ok || !body.ok) {
  console.error(JSON.stringify({ ok: false, status: response.status, ...body }));
  process.exit(1);
}
console.log(JSON.stringify(body));
