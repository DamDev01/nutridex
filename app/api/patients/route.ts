import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "db.json");

export async function GET() {
  try {
    const dbData = fs.readFileSync(dbPath, "utf-8");
    const db = JSON.parse(dbData);
    return NextResponse.json(db.patients);
  } catch (error) {
    console.error("Erro ao ler o db.json:", error);
    return NextResponse.json({ error: "Erro ao carregar pacientes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newPatient = await request.json();
    const dbData = fs.readFileSync(dbPath, "utf-8");
    const db = JSON.parse(dbData);

    const newId = db.patients.length > 0 ? Math.max(...db.patients.map((p: any) => p.id)) + 1 : 1;
    const patientWithId = { id: newId, ...newPatient };
    db.patients.push(patientWithId);

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    return NextResponse.json(patientWithId, { status: 201 });
  } catch (error) {
    console.error("Erro ao adicionar paciente:", error);
    return NextResponse.json({ error: "Erro ao adicionar paciente" }, { status: 500 });
  }
}