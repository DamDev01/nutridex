import { getFoodLibrary } from "./foodLibraryServer";
import type { FoodItem } from "./foodNutrition";
import { anthropometry, appointments, exams, finances, history, measures, notes, patients, photos } from "../data";
import { listRows, queryRows } from "./supabaseServer";
import { signedPhotoUrl } from "./supabaseStorage";

export type DbPatient = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  age: number | null;
  goal: string | null;
  calories: number | null;
  adherence: number | null;
  weight: number | null;
  height?: number | null;
  notes?: string | null;
  next_appointment_at: string | null;
};

export type DbAppointment = {
  id: string;
  patient_id?: string | null;
  patient_name: string;
  scheduled_at: string;
  type: string | null;
  goal: string | null;
  status: string | null;
};

export type DbFood = FoodItem;

export type DbNote = {
  id: string;
  patient_id?: string | null;
  title: string;
  note: string;
  patient_name: string | null;
  created_at: string;
};

export type DbExam = {
  id: string;
  patient_id?: string | null;
  name: string;
  exam_date: string | null;
  status: string | null;
  note: string | null;
};

export type DbPhoto = {
  id: string;
  patient_id?: string | null;
  patient_name?: string | null;
  angle: string | null;
  note: string | null;
  file_name: string | null;
  file_url?: string | null;
  created_at: string;
};

export type DbPayment = {
  id: string;
  patient_id?: string | null;
  patient_name: string;
  amount: number;
  method: string | null;
  status: string | null;
  paid_at: string;
};

export type DbAnthropometry = {
  id: string;
  patient_id?: string | null;
  patient_name: string | null;
  weight: number | null;
  height: number | null;
  body_fat: number | null;
  lean_mass: number | null;
  recorded_at: string;
};


export type DbMealPlan = {
  id: string;
  patient_id: string | null;
  patient_name: string | null;
  title: string;
  status: string | null;
  created_at: string;
  updated_at: string;
};

export type DbMealPlanItem = {
  id: string;
  meal_plan_id: string;
  meal_name: string;
  food_name: string;
  amount: string | null;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  created_at: string;
};
export type DbBodyMeasure = {
  id: string;
  patient_id?: string | null;
  patient_name: string | null;
  waist: number | null;
  hip: number | null;
  arm: number | null;
  thigh: number | null;
  recorded_at: string;
};

export type DbAnamnesis = {
  id: string; patient_id: string; patient_name: string | null;
  chief_complaint: string | null; food_history: string | null; pathologies: string | null;
  medications: string | null; sleep_notes: string | null; physical_activity: string | null;
  consent_recorded_at: string | null; created_at: string; updated_at: string;
};

export type DbClinicSettings = {
  id: string; clinic_name: string | null; contact_email: string | null; contact_phone: string | null;
  business_hours: string | null; default_units: string; notifications_enabled: boolean; data_retention_months: number;
};

function eq(value: string) {
  return encodeURIComponent(`eq.${value}`);
}

function patientRelationFilter(patient: DbPatient) {
  return encodeURIComponent(`(patient_id.eq.${patient.id},patient_name.eq.${patient.name})`);
}

export async function getPatients() {
  const result = await listRows<DbPatient>("patients", "id,name,age,goal,calories,adherence,weight,next_appointment_at");
  return result.simulated ? patients.map((patient, index) => ({
    id: `mock-${index}`,
    name: patient.name,
    age: patient.age,
    goal: patient.goal,
    calories: patient.calories,
    adherence: patient.adherence,
    weight: Number(patient.weight.replace(",", ".").replace(" kg", "")),
    next_appointment_at: null,
  })) : result.data;
}

export async function getAppointments() {
  const result = await listRows<DbAppointment>("appointments", "id,patient_id,patient_name,scheduled_at,type,goal,status");
  return result.simulated ? appointments.map((item, index) => ({
    id: `mock-${index}`,
    patient_id: null,
    patient_name: item.patient,
    scheduled_at: new Date(`2026-06-27T${item.time}:00`).toISOString(),
    type: item.type,
    goal: item.goal,
    status: item.status,
  })) : result.data;
}

export async function getFoods() {
  return getFoodLibrary();
}

export async function getNotes() {
  const result = await listRows<DbNote>("clinical_notes", "id,patient_id,title,note,patient_name,created_at");
  return result.simulated ? notes.map((item, index) => ({
    id: `mock-${index}`,
    patient_id: null,
    title: item.title,
    note: item.text,
    patient_name: "Maria Silva",
    created_at: new Date().toISOString(),
  })) : result.data;
}

export async function getExams() {
  const result = await listRows<DbExam>("exams", "id,patient_id,name,exam_date,status,note");
  return result.simulated ? exams.map((item, index) => ({
    id: `mock-${index}`,
    patient_id: null,
    name: item.name,
    exam_date: item.date,
    status: item.status,
    note: item.note,
  })) : result.data;
}

export async function getPhotos() {
  const result = await listRows<DbPhoto>("photos", "id,patient_id,patient_name,angle,note,file_name,file_url,created_at");
  const rows = result.simulated ? photos.map((item, index) => ({
    id: `mock-${index}`,
    angle: item.type,
    note: item.note,
    file_name: null,
    file_url: null,
    created_at: new Date().toISOString(),
  })) : result.data;
  return Promise.all(rows.map(async (photo) => ({ ...photo, file_url: await signedPhotoUrl(photo.file_url) })));
}

export async function getPayments() {
  const result = await listRows<DbPayment>("payments", "id,patient_id,patient_name,amount,method,status,paid_at");
  return result.data;
}

export async function getAnthropometryRecords() {
  const result = await listRows<DbAnthropometry>("anthropometry_records", "id,patient_id,patient_name,weight,height,body_fat,lean_mass,recorded_at");
  return result.data;
}

export async function getBodyMeasures() {
  const result = await listRows<DbBodyMeasure>("body_measures", "id,patient_id,patient_name,waist,hip,arm,thigh,recorded_at");
  return result.data;
}

export async function getAnamneses() {
  const result = await listRows<DbAnamnesis>("anamneses", "id,patient_id,patient_name,chief_complaint,food_history,pathologies,medications,sleep_notes,physical_activity,consent_recorded_at,created_at,updated_at");
  return result.data;
}

export async function getClinicSettings() {
  const result = await listRows<DbClinicSettings>("clinic_settings", "id,clinic_name,contact_email,contact_phone,business_hours,default_units,notifications_enabled,data_retention_months");
  return result.data[0] ?? null;
}

export async function getPatientById(id: string) {
  const result = await queryRows<DbPatient>(`patients?select=id,name,email,phone,age,goal,calories,adherence,weight,height,notes,next_appointment_at&id=${eq(id)}&limit=1`);
  return result.data[0] ?? null;
}

export async function getPatientDetail(id: string) {
  const patient = await getPatientById(id);

  if (!patient) {
    return null;
  }

  const relationFilter = patientRelationFilter(patient);
  const [appointmentsResult, notesResult, examsResult, photosResult, paymentsResult, anthropometryResult, measuresResult] = await Promise.all([
    queryRows<DbAppointment>(`appointments?select=id,patient_id,patient_name,scheduled_at,type,goal,status&or=${relationFilter}&order=scheduled_at.desc`),
    queryRows<DbNote>(`clinical_notes?select=id,patient_id,title,note,patient_name,created_at&or=${relationFilter}&order=created_at.desc`),
    queryRows<DbExam>(`exams?select=id,patient_id,name,exam_date,status,note&or=${relationFilter}&order=exam_date.desc`),
    queryRows<DbPhoto>(`photos?select=id,patient_id,patient_name,angle,note,file_name,file_url,created_at&or=${relationFilter}&order=created_at.desc`),
    queryRows<DbPayment>(`payments?select=id,patient_id,patient_name,amount,method,status,paid_at&or=${relationFilter}&order=paid_at.desc`),
    queryRows<DbAnthropometry>(`anthropometry_records?select=id,patient_id,patient_name,weight,height,body_fat,lean_mass,recorded_at&or=${relationFilter}&order=recorded_at.desc`),
    queryRows<DbBodyMeasure>(`body_measures?select=id,patient_id,patient_name,waist,hip,arm,thigh,recorded_at&or=${relationFilter}&order=recorded_at.desc`),
  ]);

  const signedPhotos = await Promise.all(photosResult.data.map(async (photo) => ({ ...photo, file_url: await signedPhotoUrl(photo.file_url) })));
  return {
    patient,
    appointments: appointmentsResult.data,
    notes: notesResult.data,
    exams: examsResult.data,
    photos: signedPhotos,
    payments: paymentsResult.data,
    anthropometry: anthropometryResult.data,
    measures: measuresResult.data,
  };
}


export async function getMealPlans() {
  const result = await listRows<DbMealPlan>("meal_plans", "id,patient_id,patient_name,title,status,created_at,updated_at");
  return result.data;
}

export async function getMealPlanItems(mealPlanId: string) {
  const result = await queryRows<DbMealPlanItem>(`meal_plan_items?select=id,meal_plan_id,meal_name,food_name,amount,calories,protein,carbs,fat,created_at&meal_plan_id=${eq(mealPlanId)}&order=created_at.asc`);
  return result.data;
}

export async function getMealPlanData(patientId?: string) {
  const patientsData = await getPatients();
  const selectedPatient = patientId ? patientsData.find((patient) => patient.id === patientId) ?? patientsData[0] : patientsData[0];
  const foodsData = await getFoods();

  if (!selectedPatient) {
    return { patients: patientsData, selectedPatient: null, plan: null, items: [], foods: foodsData };
  }

  const patientFilter = encodeURIComponent(`(patient_id.eq.${selectedPatient.id},patient_name.eq.${selectedPatient.name})`);
  const plansResult = await queryRows<DbMealPlan>(`meal_plans?select=id,patient_id,patient_name,title,status,created_at,updated_at&or=${patientFilter}&order=updated_at.desc&limit=1`);
  const plan = plansResult.data[0] ?? null;
  const items = plan ? await getMealPlanItems(plan.id) : [];

  return { patients: patientsData, selectedPatient, plan, items, foods: foodsData };
}
export function formatDate(value: string | null | undefined) {
  if (!value) return "Sem data";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

export function formatTime(value: string | null | undefined) {
  if (!value) return "--:--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 5);
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(date);
}

export function formatCurrency(value: number | null | undefined) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value ?? 0);
}

export { anthropometry, finances, history, measures };



