import { insertRow, listRows, updateRow, jsonError } from '../../lib/supabaseServer';
import { optionalNumber, optionalText } from '../../lib/payload';

export async function GET() {
  const result = await listRows('clinic_settings');
  return Response.json({ ...result }, { status: result.ok ? 200 : 503 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = {
      clinic_name: optionalText(body.clinic_name), contact_email: optionalText(body.contact_email),
      contact_phone: optionalText(body.contact_phone), business_hours: optionalText(body.business_hours),
      default_units: optionalText(body.default_units) ?? 'metric', notifications_enabled: Boolean(body.notifications_enabled),
      data_retention_months: optionalNumber(body.data_retention_months) ?? 60,
    };
    const current = await listRows<{ id: string }>('clinic_settings', 'id');
    const result = current.data[0] ? await updateRow('clinic_settings', current.data[0].id, payload) : await insertRow('clinic_settings', payload);
    return Response.json({ ...result });
  } catch (error) { return jsonError(error); }
}
