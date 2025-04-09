"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Schedule() {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [filteredConsultations, setFilteredConsultations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchConsultations() {
      try {
        const res = await fetch("http://localhost:3000/api/consultations", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        setConsultations(data);
        setFilteredConsultations(data);
      } catch (error) {
        console.error("Erro ao carregar consultas:", error);
      }
    }
    fetchConsultations();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredConsultations(consultations);
    } else {
      const filtered = consultations.filter((consultation) =>
        consultation.patient.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredConsultations(filtered);
    }
  }, [searchTerm, consultations]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-2xl font-bold text-foreground mb-8">Agenda Completa</h1>
      <div className="max-w-4xl mx-auto">
        <Input
          type="text"
          placeholder="Pesquisar por paciente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-6"
        />
        <div className="space-y-4">
          {filteredConsultations.length > 0 ? (
            filteredConsultations.map((consultation: any) => (
              <Card key={consultation.id}>
                <CardContent className="p-4">
                  <p className="font-medium">
                    {consultation.date} às {consultation.time} - {consultation.patient}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{consultation.type}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {consultations.length === 0 ? "Erro ao carregar consultas." : "Nenhuma consulta encontrada."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}