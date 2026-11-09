import { insertRow, listRows, jsonError } from '../../lib/supabaseServer';
import { optionalText, requiredText } from '../../lib/payload';

export async function GET() {
  const result = await listRows('anamneses');
  return Response.json({ ...result }, { status: result.ok ? 200 : 503 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await insertRow('anamneses', {
      patient_id: requiredText(body.patient_id), patient_name: optionalText(body.patient_name),
      chief_complaint: optionalText(body.chief_complaint), food_history: optionalText(body.food_history),
      pathologies: optionalText(body.pathologies), medications: optionalText(body.medications),
      sleep_notes: optionalText(body.sleep_notes), physical_activity: optionalText(body.physical_activity),
      consent_recorded_at: body.consent ? new Date().toISOString() : null,
    });
    return Response.json({ ...result });
  } catch (error) { return jsonError(error); }
}
