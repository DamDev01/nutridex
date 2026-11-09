export function optionalNumber(value: FormDataEntryValue | string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return null;
  const normalized = String(value).replace(",", ".");
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return null;
  if (parsed < 0) throw new Error("Valores numéricos não podem ser negativos.");
  return parsed;
}

export function optionalText(value: FormDataEntryValue | string | null | undefined) {
  const text = value === null || value === undefined ? "" : String(value).trim();
  return text || null;
}

export function requiredText(value: FormDataEntryValue | string | null | undefined, fallback = "Sem nome") {
  return optionalText(value) ?? fallback;
}

export function assertRange(value: number | null, label: string, min: number, max: number) {
  if (value === null) return value;
  if (value < min || value > max) {
    throw new Error(`${label} deve estar entre ${min} e ${max}.`);
  }
  return value;
}

export function optionalEmail(value: FormDataEntryValue | string | null | undefined) {
  const email = optionalText(value);
  if (!email) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Informe um e-mail válido.");
  }
  return email;
}

export function combineDateTime(dateValue: unknown, timeValue: unknown) {
  const date = optionalText(String(dateValue ?? ""));
  const time = optionalText(String(timeValue ?? ""));

  if (!date) return new Date().toISOString();
  return new Date(`${date}T${time ?? "09:00"}:00`).toISOString();
}
