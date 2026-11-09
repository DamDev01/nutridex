import { insertRow, jsonError, listRows, queryRows } from "../../lib/supabaseServer";
import { optionalText } from "../../lib/payload";
import { deletePhotoObjectFromUrl, uploadPhotoObject } from "../../lib/supabaseStorage";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function safeFileName(name: string) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

export async function GET() {
  try {
    const result = await listRows("photos");
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");
      const patientId = optionalText(formData.get("patient_id"));
      const patientName = optionalText(formData.get("patient_name") ?? formData.get("Paciente"));
      const consent = optionalText(formData.get("consent"));

      if (!(file instanceof File) || file.size === 0) {
        throw new Error("Selecione uma imagem para enviar.");
      }
      if (!patientId || !patientName) {
        throw new Error("Selecione um paciente para vincular a fotografia.");
      }
      if (consent !== "accepted") throw new Error("Confirme o consentimento do paciente para a fotografia.");
      if (!allowedTypes.has(file.type)) {
        throw new Error("Envie uma imagem JPG, PNG ou WEBP.");
      }
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("A imagem deve ter no máximo 10 MB.");
      }

      const patient = await queryRows<{ id: string; name: string }>(`patients?select=id,name&id=eq.${encodeURIComponent(patientId)}&limit=1`);
      if (!patient.ok) throw new Error("Não foi possível verificar o paciente.");
      if (!patient.data.length) return Response.json({ ok: false, error: "Paciente não encontrado nesta conta." }, { status: 404 });
      const fileName = `${crypto.randomUUID()}-${safeFileName(file.name)}`;
      const path = `${patientId}/${fileName}`;
      const fileUrl = await uploadPhotoObject(file, path);
      const payload = {
        patient_id: patientId,
        patient_name: patient.data[0].name,
        angle: optionalText(formData.get("angle") ?? formData.get("Ângulo")),
        note: optionalText(formData.get("note") ?? formData.get("Observação") ?? formData.get("Observacao")),
        file_name: file.name,
        file_url: fileUrl,
        consent_recorded_at: new Date().toISOString(),
      };

      try {
        const result = await insertRow("photos", payload);
        return Response.json({ ...result });
      } catch (error) {
        try {
          await deletePhotoObjectFromUrl(fileUrl);
        } catch {
          console.error("Não foi possível remover um arquivo após falha ao registrar a fotografia.");
          throw new Error("Não foi possível registrar a fotografia nem remover o arquivo enviado. Entre em contato com o suporte.");
        }
        throw error;
      }
    }
    return Response.json({ ok: false, error: "Envie uma imagem e confirme o consentimento do paciente." }, { status: 400 });
  } catch (error) {
    return jsonError(error);
  }
}
