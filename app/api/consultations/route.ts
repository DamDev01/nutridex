import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "db.json");

async function readDb() {
  const data = await fs.readFile(dbPath, "utf-8");
  return JSON.parse(data);
}

async function writeDb(data: any) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.consultations);
}

export async function POST(request: Request) {
  const db = await readDb();
  const newConsultation = await request.json();
  newConsultation.id = db.consultations.length > 0 ? Math.max(...db.consultations.map((c: any) => c.id)) + 1 : 1;
  db.consultations.push(newConsultation);
  await writeDb(db);
  return NextResponse.json(newConsultation, { status: 201 });
}