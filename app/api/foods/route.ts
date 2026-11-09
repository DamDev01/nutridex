import { getFoodLibrary } from "../../lib/foodLibraryServer";
import { insertRow, jsonError } from "../../lib/supabaseServer";
import { optionalNumber, optionalText, requiredText } from "../../lib/payload";

export async function GET() {
  try {
    return Response.json({ ok: true, simulated: false, data: await getFoodLibrary() });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = {
      name: requiredText(body.name ?? body.Nome),
      category: optionalText(body.category ?? body.Categoria),
      calories: optionalNumber(body.calories ?? body.Calorias),
      carbs: optionalNumber(body.carbs ?? body.Carboidratos),
      protein: optionalNumber(body.protein ?? body.Proteinas ?? body["Proteínas"]),
      fat: optionalNumber(body.fat ?? body.Gorduras),
      serving: optionalText(body.serving ?? body.Porcao ?? body["Porção"]) ?? "100g",
    };

    const result = await insertRow("foods", payload);
    return Response.json({ ...result });
  } catch (error) {
    return jsonError(error);
  }
}



